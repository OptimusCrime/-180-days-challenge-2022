<?php
namespace OptimusCrime\Challenge180Days\Handlers;

use Exception;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Http\Response;

use OptimusCrime\Challenge180Days\Services\EntryService;

class EntryHandler extends BaseHandler
{
    public function get(ServerRequestInterface $request, Response $response): ResponseInterface
    {
        try {
            return $response->withJson([
                'data' => EntryService::getCollection()
            ]);
        }
        catch (Exception $ex) {
            $this->logger->error('Failed to fetch entries', [
                'exception' => $ex
            ]);

            return $response->withStatus(500);
        }
    }

    public function post(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $payload = json_decode($request->getBody()->getContents(), true);

            if ($payload === null || !isset($payload['date'])) {
                return $response->withStatus(400);
            }

            $date = $payload['date'];

            preg_match_all('/^\d{4}-\d{2}-\d{2}$/m', $date, $matches, PREG_SET_ORDER);

            if (count($matches) === 0 || count($matches[0]) === 0 || strlen($matches[0][0]) !== 10) {
                return $response->withStatus(400);
            }

            $status = EntryService::create($date, $payload['comment'] ?? null);

            if ($status) {
                return $response->withStatus(200);
            }

            return $response->withStatus(500);
        }
        catch (Exception $ex) {
            $this->logger->error('Failed to create a new entry', [
                'exception' => $ex
            ]);

            return $response->withStatus(500);
        }
    }
}
