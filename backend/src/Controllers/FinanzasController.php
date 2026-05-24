<?php

namespace App\Controllers;

use App\Core\Response;
use App\Core\AuthMiddleware;
use App\Database\Database;
use PDO;

class FinanzasController
{
    public function __construct()
    {
        AuthMiddleware::handle();
    }

    public function getTransacciones(): void
    {
        $pdo = Database::getConnection();
        // Get transactions ordered by date descending
        $stmt = $pdo->query("SELECT * FROM transacciones ORDER BY fecha DESC, id DESC");
        $transacciones = $stmt->fetchAll();
        
        Response::json($transacciones);
    }
}
