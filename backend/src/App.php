<?php
namespace OptimusCrime\Challenge180Days;

use Exception;
use OptimusCrime\Challenge180Days\Middlewares\Cors;
use Throwable;

use Monolog\Logger as MonologLogger;
use Slim\App as Slim;
use Slim\Exception\MethodNotAllowedException;
use Slim\Exception\NotFoundException;

use OptimusCrime\Challenge180Days\Containers\Database;
use OptimusCrime\Challenge180Days\Containers\InternalServerError;
use OptimusCrime\Challenge180Days\Containers\Logger;
use OptimusCrime\Challenge180Days\Containers\PageNotFound;
use OptimusCrime\Challenge180Days\Handlers\AuthHandler;
use OptimusCrime\Challenge180Days\Handlers\EntryHandler;
use OptimusCrime\Challenge180Days\Middlewares\Auth;
use OptimusCrime\Challenge180Days\Middlewares\ReverseProxy;

class App
{
    private Slim $app;

    public function __construct(array $settings)
    {
        $this->app = new Slim($settings);
    }

    /**
     * @throws MethodNotAllowedException
     * @throws NotFoundException
     * @throws Throwable
     */
    public function run(): void
    {
        $this->dependencies();
        $this->routes();

        try {
            $this->app->run();
        } catch (Exception $ex) {
            /** @var MonologLogger $logger */
            $logger = $this->app->getContainer()->get(Logger::class);

            $logger->error($ex);

            // Rethrow exception to the outer exception handler
            throw $ex;
        }
    }

    private function routes(): void
    {
        $app = $this->app;
        $app->add(new ReverseProxy());
        $app->add(new Cors());

        $app->get('/entries', EntryHandler::class . ':get');
        $app->post('/entries', EntryHandler::class . ':post')->add(new Auth());
        $app->options('/entries', function ($request, $response) {
            return $response;
        });

        $app->get('/auth', AuthHandler::class . ':get');
        $app->post('/auth', AuthHandler::class . ':post');
        $app->options('/auth', function ($request, $response) {
            return $response;
        });
    }

    private function dependencies(): void
    {
        $containers = [
            Database::class,
            InternalServerError::class,
            PageNotFound::class,
            Logger::class,
        ];

        foreach ($containers as $container) {
            call_user_func([$container, 'load'], $this->app->getContainer());
        }
    }
}
