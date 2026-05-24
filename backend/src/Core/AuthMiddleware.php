<?php

namespace App\Core;

class AuthMiddleware
{
    public static function handle(): ?array
    {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            Response::json(['error' => 'Token no proporcionado o inválido'], 401);
            exit;
        }

        $token = $matches[1];
        $decoded = JwtHelper::validateToken($token);

        if (!$decoded) {
            Response::json(['error' => 'Token expirado o inválido'], 401);
            exit;
        }

        // Return user data from token to be injected into the request
        return $decoded;
    }
}
