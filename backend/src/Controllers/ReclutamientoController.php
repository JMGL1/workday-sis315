<?php

namespace App\Controllers;

use App\Database\Database;
use App\Core\AuthMiddleware;
use PDO;

class ReclutamientoController
{
    public function getCandidatos()
    {
        AuthMiddleware::checkToken();
        $pdo = Database::getConnection();
        
        $stmt = $pdo->query("SELECT * FROM candidatos ORDER BY fecha_aplicacion DESC");
        $candidatos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($candidatos);
    }

    public function createCandidato()
    {
        AuthMiddleware::checkToken();
        $pdo = Database::getConnection();
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['nombre']) || !isset($data['puesto'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan datos requeridos']);
            return;
        }

        $stmt = $pdo->prepare("INSERT INTO candidatos (nombre, puesto, estado) VALUES (?, ?, ?)");
        $estado = $data['estado'] ?? 'postulado';
        
        if ($stmt->execute([$data['nombre'], $data['puesto'], $estado])) {
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear candidato']);
        }
    }
}
