<?php
namespace OptimusCrime\Challenge180Days2022\Helpers\Configuration;

class DefaultConfiguration
{
    public static function getDefaultConfiguration(): array
    {
        // Note: This array must have all values as strings
        return [
            Configuration::DEV => '0',
            Configuration::SSL => '1',

            Configuration::LOGGER_NAME => 'challenge180days2022',

            Configuration::DATABASE => __DIR__ . '/../../../database/db',
        ];
    }}