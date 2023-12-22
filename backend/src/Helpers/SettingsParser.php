<?php
namespace OptimusCrime\Challenge180Days\Helpers;

use OptimusCrime\Challenge180Days\Exceptions\MissingConfigurationException;
use OptimusCrime\Challenge180Days\Helpers\Configuration\Configuration;

class SettingsParser
{
    /**
     * @throws MissingConfigurationException
     */
    public static function getSlimConfig(): array
    {
        return [
            'settings' => [
                'displayErrorDetails' => Configuration::getInstance()->isDev(),
                'addContentLengthHeader' => false,
            ]
        ];
    }

    /**
     * @throws MissingConfigurationException
     */
    public static function getPhinxConfig(): array
    {
        return [
            'paths' => [
                'migrations' => __DIR__ . '/../../phinx/migrations',
            ],
            'environments' => [
                'default_migration_table' => 'phinxlog',
                'default_database' => 'production',
                'production' => [
                    'adapter' => 'sqlite',
                    'name' => Configuration::getInstance()->getDatabase(),
                ],
            ]
        ];
    }
}
