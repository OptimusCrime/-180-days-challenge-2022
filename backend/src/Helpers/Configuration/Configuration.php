<?php
namespace OptimusCrime\Challenge180Days\Helpers\Configuration;

use OptimusCrime\Challenge180Days\Exceptions\MissingConfigurationException;

class Configuration
{
    const DEV = 'dev';
    const SSL = 'ssl';

    const LOGGER_NAME = 'logger.name';

    const DATABASE = 'database';

    const ADMIN_TOKEN_HEADER_NAME = 'admin.token.header.name';
    const ADMIN_TOKEN_VALUE = 'admin.token.value';
    const ADMIN_PASSWORD = 'admin.password';

    private static ?Configuration $instance = null;
    private array $defaultConfiguration;
    private array $configuration;

    private function __construct()
    {
        $this->defaultConfiguration = DefaultConfiguration::getDefaultConfiguration();
        $this->configuration = [];
    }

    /**
     * @throws MissingConfigurationException
     */
    public function isDev(): bool
    {
        return $this->lookup(static::DEV) === '1';
    }

    /**
     * @throws MissingConfigurationException
     */
    public function isSSL(): bool
    {
        return $this->lookup(static::SSL) === '1';
    }

    /**
     * @throws MissingConfigurationException
     */
    public function getLoggerName(): string
    {
        return $this->lookup(static::LOGGER_NAME);
    }

    /**
     * @throws MissingConfigurationException
     */
    public function getDatabase(): string
    {
        return $this->lookup(static::DATABASE);
    }

    /**
     * @throws MissingConfigurationException
     */
    public function getAdminTokenHeaderName(): string
    {
        return $this->lookup(static::ADMIN_TOKEN_HEADER_NAME);
    }

    /**
     * @throws MissingConfigurationException
     */
    public function getAdminTokenValue(): string
    {
        return $this->lookup(static::ADMIN_TOKEN_VALUE);
    }

    /**
     * @throws MissingConfigurationException
     */
    public function getAdminPassword(): string
    {
        return $this->lookup(static::ADMIN_PASSWORD);
    }

    /**
     * @param string $key
     * @return string
     * @throws MissingConfigurationException
     */
    private function lookup(string $key): string
    {
        if (isset($this->configuration[$key])) {
            return $this->configuration[$key];
        }

        // Check if environment override
        $envKey = str_replace('.', '_', strtoupper($key));
        $envValue = getenv($envKey);

        if ($envValue !== false) {
            $this->configuration[$key] = $envValue;
            return $this->configuration[$key];
        }

        // No environment override, use the default value
        if (!isset($this->defaultConfiguration[$key])) {
            // If we got here, and there are no default configuration sat, throw an error
            throw new MissingConfigurationException('No value for key: ' . $key);
        }

        $this->configuration[$key] = $this->defaultConfiguration[$key];

        return $this->configuration[$key];
    }

    public static function getInstance(): Configuration
    {
        if (self::$instance === null) {
            self::$instance = new Configuration();
        }

        return self::$instance;
    }
}
