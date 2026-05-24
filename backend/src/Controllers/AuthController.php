<?php

namespace App\Controllers;

use App\Core\Response;
use App\Core\JwtHelper;
use App\Database\Database;
use PDO;

class AuthController
{
    public function login(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($username) || empty($password)) {
            Response::json(['error' => 'Usuario y contraseña son requeridos'], 400);
            return;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id, username, password, role FROM users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Contraseña correcta, generar JWT
            $token = JwtHelper::generateToken([
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]);

            Response::json([
                'message' => 'Login exitoso',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            Response::json(['error' => 'Credenciales inválidas'], 401);
        }
    }
}
