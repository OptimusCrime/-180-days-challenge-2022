<?php
namespace OptimusCrime\Challenge180Days\Handlers;

use Exception;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Http\Response;

use OptimusCrime\Challenge180Days\Helpers\Configuration\Configuration;

class AuthHandler extends BaseHandler
{
    public function get(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $configuration = Configuration::getInstance();
            $headerValues = $request->getHeader('authorization');

            if (count($headerValues) !== 1 || $headerValues[0] !== ('Bearer ' . $configuration->getAdminTokenValue())) {
                return $response->withStatus(401);
            }

            return $response->withStatus(200);
        }
        catch (Exception $ex) {
            $this->logger->error('Failed to get authentication status', [
                'exception' => $ex
            ]);

            return $response->withStatus(500);
        }
    }

    public function post(ServerRequestInterface $request, Response $response): ResponseInterface
    {
        try {
            $configuration = Configuration::getInstance();
            $payload = json_decode($request->getBody()->getContents(), true);

            if (!isset($payload['pw']) or !password_verify($payload['pw'], $configuration->getAdminPassword())) {
                return $response->withStatus(401);
            }

            return $response->withJson([
                'token' => $configuration->getAdminTokenValue()
            ]);
        }
        catch (Exception $ex) {
            $this->logger->error('Failed to authenticate', [
                'exception' => $ex
            ]);

            return $response->withStatus(500);
        }
    }
}
