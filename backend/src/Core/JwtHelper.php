<?php

namespace App\Core;

class JwtHelper
{
    private static string $secretKey = 'workday_super_secret_key_2026';

    public static function generateToken(array $payload): string
    {
        // Add expiration time (24 hours)
        $payload['exp'] = time() + (60 * 60 * 24);

        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payloadStr = json_encode($payload);

        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode($payloadStr);

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secretKey, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function validateToken(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;

        $validSignature = hash_hmac('sha256', $header . "." . $payload, self::$secretKey, true);
        $base64UrlValidSignature = self::base64UrlEncode($validSignature);

        if (hash_equals($base64UrlValidSignature, $signature)) {
            $payloadData = json_decode(self::base64UrlDecode($payload), true);
            
            // Check expiration
            if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
                return null; // Expired
            }
            
            return $payloadData;
        }

        return null;
    }

    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        $padded = str_pad($data, strlen($data) % 4, '=', STR_PAD_RIGHT);
        return base64_decode(strtr($padded, '-_', '+/'));
    }
}
