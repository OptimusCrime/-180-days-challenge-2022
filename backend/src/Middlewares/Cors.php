<?php
namespace OptimusCrime\Challenge180Days\Middlewares;

use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use OptimusCrime\Challenge180Days\Exceptions\MissingConfigurationException;
use OptimusCrime\Challenge180Days\Helpers\Configuration\Configuration;

class Cors
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws MissingConfigurationException
     */
    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, $next): ResponseInterface
    {
        $response = $next($request, $response);
        $configuration = Configuration::getInstance();

        return $response
            ->withHeader('Access-Control-Allow-Origin', $configuration->isDev() ? '*' : 'https://optimuscrime.github.io')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    }
}
