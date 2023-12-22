<?php
namespace OptimusCrime\Challenge180Days\Middlewares;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

use OptimusCrime\Challenge180Days\Exceptions\MissingConfigurationException;
use OptimusCrime\Challenge180Days\Helpers\Configuration\Configuration;

class ReverseProxy
{
    /**
     * @throws MissingConfigurationException
     */
    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next): ResponseInterface
    {
        $scheme = Configuration::getInstance()->isSSL() ? 'https' : 'http';
        $uri = $request->getUri()->withScheme($scheme);
        $request = $request->withUri($uri);
        return $next($request, $response);
    }
}
