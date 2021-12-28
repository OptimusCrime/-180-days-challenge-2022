<?php
namespace OptimusCrime\Challenge180Days2022\Containers;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Monolog\Logger as MonologLogger;

class InternalServerError
{
    public static function load(ContainerInterface $container)
    {
        $container['errorHandler'] = function ($c) {
            return function (ServerRequestInterface $request, ResponseInterface $response, $exception) use ($c) {
                /** @var MonologLogger $logger */
                $logger = $c->get(MonologLogger::class);
                $logger->error($exception->getMessage());

                return $response->withStatus(500);
            };
        };
    }
}