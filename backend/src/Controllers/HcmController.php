<?php

namespace App\Controllers;

use App\Core\Response;
use App\Core\AuthMiddleware;
use App\Database\Database;
use PDO;

class HcmController
{
    public function __construct()
    {
        // Protect all routes in this controller
        AuthMiddleware::handle();
    }

    public function getEmpleados(): void
    {
        $pdo = Database::getConnection();
        $query = "SELECT * FROM empleados";
        
        $search = $_GET['search'] ?? '';
        if (!empty($search)) {
            $query .= " WHERE nombre LIKE :search OR departamento LIKE :search OR cargo LIKE :search";
            $stmt = $pdo->prepare($query);
            $stmt->execute(['search' => "%$search%"]);
        } else {
            $stmt = $pdo->query($query);
        }

        $empleados = $stmt->fetchAll();
        Response::json($empleados);
    }

    public function createEmpleado(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['nombre']) || empty($data['departamento']) || empty($data['cargo'])) {
            Response::json(['error' => 'Faltan campos obligatorios'], 400);
            return;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("
            INSERT INTO empleados (nombre, departamento, cargo, salario_base, estado) 
            VALUES (:nombre, :departamento, :cargo, :salario_base, :estado)
        ");

        $stmt->execute([
            'nombre' => $data['nombre'],
            'departamento' => $data['departamento'],
            'cargo' => $data['cargo'],
            'salario_base' => $data['salario_base'] ?? 0,
            'estado' => $data['estado'] ?? 'Activo'
        ]);

        Response::json(['message' => 'Empleado creado exitosamente', 'id' => $pdo->lastInsertId()], 201);
    }
}
