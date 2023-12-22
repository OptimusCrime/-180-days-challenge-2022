<?php
namespace OptimusCrime\Challenge180Days\Handlers;

use Monolog\Logger as MonologLogger;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\ContainerInterface;
use Psr\Container\NotFoundExceptionInterface;

class BaseHandler
{
    protected MonologLogger $logger;

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function __construct(ContainerInterface $container)
    {
        $this->logger = $container->get(MonologLogger::class);
    }
}
