<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $levels = [];

    protected $dontReport = [];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        if ($this->shouldReturnJson($request, $e)) {
            return $this->renderApiException($e);
        }

        return parent::render($request, $e);
    }

    protected function unauthenticated($request, AuthenticationException $exception): JsonResponse
    {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }

    protected function shouldReturnJson($request, Throwable $e): bool
    {
        return $request->is('api/*') || $request->expectsJson();
    }

    private function renderApiException(Throwable $e): JsonResponse
    {
        if ($e instanceof AuthenticationException) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($e instanceof AuthorizationException) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($e instanceof ValidationException) {
            return response()->json([
                'message' => $e->getMessage() ?: 'The given data was invalid.',
                'errors' => $e->errors(),
            ], 422);
        }

        if ($e instanceof HttpExceptionInterface) {
            $status = $e->getStatusCode();
            $message = $e->getMessage() ?: (Response::$statusTexts[$status] ?? 'Request failed.');

            return response()->json([
                'message' => $status === 403
                    ? 'Forbidden.'
                    : $message,
            ], $status);
        }

        report($e);

        return response()->json([
            'message' => 'Something went wrong. Please try again later.',
        ], 500);
    }
}
