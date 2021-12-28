<?php
namespace OptimusCrime\Challenge180Days2022\Containers;

use Monolog\Formatter\NormalizerFormatter;
use OptimusCrime\Challenge180Days2022\Exceptions\MissingConfigurationException;
use Psr\Container\ContainerInterface;
use Monolog\Formatter\LineFormatter;
use Monolog\Logger as MonologLogger;
use Monolog\Handler\StreamHandler;

use OptimusCrime\Challenge180Days2022\Helpers\Configuration\Configuration;

class Logger
{
    public static function load(ContainerInterface $container): void
    {
        $container[MonologLogger::class] = function (): MonologLogger {
            $configuration = Configuration::getInstance();

            $logger = new MonologLogger($configuration->getLoggerName());

            $formatter = new LineFormatter(LineFormatter::SIMPLE_FORMAT, NormalizerFormatter::SIMPLE_DATE);
            $formatter->includeStacktraces(true);

            $stream = new StreamHandler(
                'php://stdout',
                static::getLoggerLevel($configuration)
            );

            $stream->setFormatter($formatter);

            $logger->pushHandler($stream);

            return $logger;
        };
    }

    /**
     * @throws MissingConfigurationException
     */
    private static function getLoggerLevel(Configuration $configuration): int
    {
        if ($configuration->isDev() || php_sapi_name() === 'cli') {
            return MonologLogger::DEBUG;
        }

        return MonologLogger::NOTICE;
    }
}