<?php

namespace App\Controllers;

use App\Core\Response;
use App\Core\AuthMiddleware;
use App\Database\Database;
use PDO;

class NominaController
{
    private array $user;

    public function __construct()
    {
        $this->user = AuthMiddleware::handle();
    }

    public function calculate(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $horas = $data['horas'] ?? 0;
        $tarifa = $data['tarifa'] ?? 0;
        $deduccionesPorcentaje = $data['deducciones'] ?? 0;

        $bruto = $horas * $tarifa;
        $desc = $bruto * ($deduccionesPorcentaje / 100);
        $neto = $bruto - $desc;

        Response::json([
            'bruto' => round($bruto, 2),
            'desc' => round($desc, 2),
            'neto' => round($neto, 2)
        ]);
    }

    public function approve(): void
    {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['horas'], $data['tarifa'], $data['bruto'], $data['desc'], $data['neto'])) {
            Response::json(['error' => 'Faltan datos de la nómina calculada'], 400);
            return;
        }

        $pdo = Database::getConnection();
        
        try {
            $pdo->beginTransaction();

            // 1. Guardar registro en Nómina
            $stmtNomina = $pdo->prepare("
                INSERT INTO nomina (empleado_id, fecha, horas, tarifa, bruto, deducciones, neto) 
                VALUES (:emp_id, :fecha, :horas, :tarifa, :bruto, :deducciones, :neto)
            ");
            
            $fechaActual = date('Y-m-d');
            
            $stmtNomina->execute([
                'emp_id' => $this->user['id'],
                'fecha' => $fechaActual,
                'horas' => $data['horas'],
                'tarifa' => $data['tarifa'],
                'bruto' => $data['bruto'],
                'deducciones' => $data['desc'],
                'neto' => $data['neto']
            ]);

            // 2. Registrar egreso automático en Finanzas
            $stmtFinanzas = $pdo->prepare("
                INSERT INTO transacciones (fecha, concepto, categoria, tipo, monto, estado) 
                VALUES (:fecha, :concepto, :categoria, :tipo, :monto, :estado)
            ");
            
            $stmtFinanzas->execute([
                'fecha' => $fechaActual,
                'concepto' => "Pago Nómina Usuario #" . $this->user['id'],
                'categoria' => 'Salarios',
                'tipo' => 'egreso',
                'monto' => $data['neto'],
                'estado' => 'Completado'
            ]);

            $pdo->commit();
            Response::json(['message' => 'Nómina aprobada y registrada en Finanzas con éxito']);
            
        } catch (\Exception $e) {
            $pdo->rollBack();
            Response::json(['error' => 'Error al aprobar nómina: ' . $e->getMessage()], 500);
        }
    }
}
