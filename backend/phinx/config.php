<?php
if (php_sapi_name() !== 'cli' || !(include __DIR__ . '/../vendor/autoload.php')) {
    die('Something went wrong');
}

use OptimusCrime\Challenge180Days\Helpers\SettingsParser;

return SettingsParser::getPhinxConfig();
