<?php

namespace App\Controllers;

use App\Core\Response;
use App\Core\AuthMiddleware;
use App\Database\Database;
use PDO;

class GastosController
{
    private array $user;

    public function __construct()
    {
        $this->user = AuthMiddleware::handle();
    }

    public function getGastos(): void
    {
        $pdo = Database::getConnection();
        // Obtener solo gastos del empleado actual (a menos que sea admin o gerente, simularemos que ve todos por ahora)
        $query = "SELECT * FROM gastos ORDER BY fecha DESC, id DESC";
        $stmt = $pdo->query($query);
        Response::json($stmt->fetchAll());
    }

    public function createGasto(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['descripcion']) || empty($data['monto'])) {
            Response::json(['error' => 'Descripción y monto son obligatorios'], 400);
            return;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("
            INSERT INTO gastos (empleado_id, fecha, descripcion, monto, estado) 
            VALUES (:emp_id, :fecha, :descripcion, :monto, 'Pendiente')
        ");

        $stmt->execute([
            'emp_id' => $this->user['id'],
            'fecha' => date('Y-m-d'),
            'descripcion' => $data['descripcion'],
            'monto' => $data['monto']
        ]);

        Response::json(['message' => 'Gasto reportado exitosamente', 'id' => $pdo->lastInsertId()], 201);
    }
}
