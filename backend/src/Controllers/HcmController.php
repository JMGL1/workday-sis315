<?php

namespace App\Controllers;

use App\Core\Response;

class HcmController
{
    public function index(): void
    {
        // Dummy data for now
        $empleados = [
            ['id' => 1, 'nombre' => 'Juan Pérez', 'carrera' => 'Ing. Sistemas', 'cu' => '35-1234', 'departamento' => 'Tecnología'],
            ['id' => 2, 'nombre' => 'Ana López', 'carrera' => 'Administración', 'cu' => '35-5678', 'departamento' => 'Finanzas'],
        ];

        Response::json(['status' => 'success', 'data' => $empleados]);
    }

    public function store(): void
    {
        // Handle POST
        $data = json_decode(file_get_contents("php://input"), true);
        Response::json(['status' => 'success', 'message' => 'Empleado creado', 'data' => $data], 201);
    }
}
