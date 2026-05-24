<?php

namespace App\Controllers;

use App\Database\Database;
use App\Core\AuthMiddleware;
use PDO;

class InventarioController
{
    public function getArticulos()
    {
        AuthMiddleware::checkToken();
        $pdo = Database::getConnection();
        
        $stmt = $pdo->query("SELECT * FROM inventario");
        $articulos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($articulos);
    }
}
