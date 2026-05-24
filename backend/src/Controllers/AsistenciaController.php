<?php

namespace App\Controllers;

use App\Core\Response;
use App\Core\AuthMiddleware;
use App\Database\Database;
use PDO;

class AsistenciaController
{
    private array $user;

    public function __construct()
    {
        $this->user = AuthMiddleware::handle();
    }

    public function getMarcas(): void
    {
        $pdo = Database::getConnection();
        // Obtener marcas de hoy para este usuario
        $hoy = date('Y-m-d');
        $stmt = $pdo->prepare("SELECT * FROM asistencia WHERE empleado_id = :emp_id AND fecha = :fecha ORDER BY hora DESC");
        $stmt->execute([
            'emp_id' => $this->user['id'],
            'fecha' => $hoy
        ]);
        
        Response::json($stmt->fetchAll());
    }

    public function fichar(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['tipo'])) {
            Response::json(['error' => 'Tipo de marca es requerido (Entrada/Salida)'], 400);
            return;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO asistencia (empleado_id, tipo, fecha, hora) VALUES (:emp_id, :tipo, :fecha, :hora)");
        $stmt->execute([
            'emp_id' => $this->user['id'],
            'tipo' => $data['tipo'],
            'fecha' => date('Y-m-d'),
            'hora' => date('H:i:s')
        ]);

        Response::json(['message' => 'Fichaje registrado', 'id' => $pdo->lastInsertId()], 201);
    }
}
