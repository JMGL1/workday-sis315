<?php

namespace App\Controllers;

use App\Database\Database;
use App\Core\AuthMiddleware;
use PDO;

class TalentoController
{
    public function getObjetivos()
    {
        AuthMiddleware::checkToken();
        $pdo = Database::getConnection();
        
        $stmt = $pdo->query("SELECT * FROM talento_objetivos");
        $objetivos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($objetivos);
    }
}
