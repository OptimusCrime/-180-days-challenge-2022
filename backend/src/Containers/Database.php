<?php
namespace OptimusCrime\Challenge180Days\Containers;

use Psr\Container\ContainerInterface;
use Illuminate\Database\Capsule\Manager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\ConnectionResolver;

use OptimusCrime\Challenge180Days\Exceptions\MissingConfigurationException;
use OptimusCrime\Challenge180Days\Helpers\Configuration\Configuration;

class Database
{
    /**
     * @throws MissingConfigurationException
     */
    public static function load(ContainerInterface $container)
    {
        $capsule = new Manager;
        $capsule->addConnection([
            'driver' => 'sqlite',

            // Phinx automatically adds the suffix when executing migrations. No idea why...
            'database' => Configuration::getInstance()->getDatabase() . '.sqlite3'
        ]);

        // Make it possible to use $app->get('db') -> whatever
        $capsule->setAsGlobal();
        $capsule->bootEloquent();

        // Make it possible to use Model :: whatever
        $resolver = new ConnectionResolver();
        $resolver->addConnection('default', $capsule->getConnection());
        $resolver->setDefaultConnection('default');
        Model::setConnectionResolver($resolver);

        $container['db'] = function () use ($capsule) {
            return $capsule;
        };
    }
}
