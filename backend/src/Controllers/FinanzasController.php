<?php

namespace App\Controllers;

use App\Core\Response;

class FinanzasController
{
    public function index(): void
    {
        // Dummy data
        $transacciones = [
            ['id' => 1, 'fecha' => '2026-05-01', 'concepto' => 'Pago Nómina', 'categoria' => 'Salarios', 'tipo' => 'egreso', 'monto' => 50000.00, 'estado' => 'Completado'],
            ['id' => 2, 'fecha' => '2026-05-15', 'concepto' => 'Venta de Servicios', 'categoria' => 'Ventas', 'tipo' => 'ingreso', 'monto' => 120000.00, 'estado' => 'Completado'],
        ];

        Response::json(['status' => 'success', 'data' => $transacciones]);
    }
}
