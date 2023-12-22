<?php
namespace OptimusCrime\Challenge180Days\Middlewares;

use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use OptimusCrime\Challenge180Days\Exceptions\MissingConfigurationException;
use OptimusCrime\Challenge180Days\Helpers\Configuration\Configuration;

class Auth
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws MissingConfigurationException
     */
    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, $next): ResponseInterface
    {
        $configuration = Configuration::getInstance();
        $headerValues = $request->getHeader($configuration->getAdminTokenHeaderName());

        if (count($headerValues) !== 1 || $headerValues[0] !== $configuration->getAdminTokenValue()) {
            return $response->withStatus(403);
        }

        return $next($request, $response);
    }
}
