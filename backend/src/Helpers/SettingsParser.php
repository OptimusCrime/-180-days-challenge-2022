<?php
namespace OptimusCrime\Challenge180Days2022\Helpers;

use OptimusCrime\Challenge180Days2022\Exceptions\MissingConfigurationException;
use OptimusCrime\Challenge180Days2022\Helpers\Configuration\Configuration;

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