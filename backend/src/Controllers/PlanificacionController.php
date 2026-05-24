<?php

namespace App\Controllers;

use App\Database\Database;
use App\Core\AuthMiddleware;
use PDO;

class PlanificacionController
{
    public function getPresupuestos()
    {
        AuthMiddleware::checkToken();
        $pdo = Database::getConnection();
        
        $stmt = $pdo->query("SELECT * FROM presupuestos ORDER BY trimestre ASC");
        $presupuestos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($presupuestos);
    }
}
