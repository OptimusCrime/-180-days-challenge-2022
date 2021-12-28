<?php
if (!(include __DIR__ . '/../vendor/autoload.php')) {
    error_log('Dependencies are not installed!', E_USER_ERROR);
    header("HTTP/1.1 500 Internal Server Error");
    die();
}

use OptimusCrime\Challenge180Days2022\App;
use OptimusCrime\Challenge180Days2022\Helpers\SettingsParser;
use OptimusCrime\Challenge180Days2022\Helpers\Configuration\Configuration;

try {
    $app = new App(SettingsParser::getSlimConfig());
    $app->run();
} catch (Exception $ex) {
    try {
        if (Configuration::getInstance()->isDev()) {
            echo '<h1>Uncaught out exception!</h1>';
            echo '<p>' . get_class($ex) . '</p>';
            echo '<p>' . $ex->getMessage() . '</p>';

            echo '<pre>';
            var_dump($ex->getTraceAsString());
            echo '</pre>';

            die();
        }
    } catch (Exception $ex) {
        // Silent pass
    }

    http_response_code(500);
    die();
}
