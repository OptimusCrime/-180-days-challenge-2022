<?php
namespace OptimusCrime\Challenge180Days\Containers;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class PageNotFound
{
    public static function load(ContainerInterface $container)
    {
        $container['notFoundHandler'] = function ($c) {
            return function (ServerRequestInterface $request, ResponseInterface $response) use ($c) {
                return $response->withStatus(404);
            };
        };
    }
}
