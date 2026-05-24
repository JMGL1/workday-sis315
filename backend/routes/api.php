<?php

use App\Core\Router;
use App\Core\Response;
use App\Controllers\HcmController;
use App\Controllers\FinanzasController;

/** @var Router $router */

$router->get('/api/hcm/empleados', [HcmController::class, 'index']);
$router->post('/api/hcm/empleados', [HcmController::class, 'store']);

$router->get('/api/finanzas/transacciones', [FinanzasController::class, 'index']);

// Dummy endpoints for now
$router->get('/api/talento/objetivos', function() {
    Response::json(['status' => 'ok', 'data' => []]);
});
$router->get('/api/reclutamiento/candidatos', function() {
    Response::json(['status' => 'ok', 'data' => []]);
});
