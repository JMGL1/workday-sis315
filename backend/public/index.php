<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Custom simple autoloader for PSR-4 App\ namespace
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../src/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

require_once __DIR__ . '/../src/Controllers/AuthController.php';
require_once __DIR__ . '/../src/Controllers/HcmController.php';
require_once __DIR__ . '/../src/Controllers/FinanzasController.php';
require_once __DIR__ . '/../src/Controllers/AsistenciaController.php';
require_once __DIR__ . '/../src/Controllers/NominaController.php';
require_once __DIR__ . '/../src/Controllers/GastosController.php';

use App\Core\Router;

$router = new Router();

// Rutas de Autenticación
$router->post('/api/auth/login', [new App\Controllers\AuthController(), 'login']);

// Rutas HCM
$router->get('/api/hcm/empleados', [new App\Controllers\HcmController(), 'getEmpleados']);
$router->post('/api/hcm/empleados', [new App\Controllers\HcmController(), 'createEmpleado']);

// Rutas Finanzas
$router->get('/api/finanzas/transacciones', [new App\Controllers\FinanzasController(), 'getTransacciones']);

// Rutas Asistencia
$router->get('/api/asistencia/marcas', [new App\Controllers\AsistenciaController(), 'getMarcas']);
$router->post('/api/asistencia/fichar', [new App\Controllers\AsistenciaController(), 'fichar']);

// Rutas Nómina
$router->post('/api/payroll/calculate', [new App\Controllers\NominaController(), 'calculate']);
$router->post('/api/payroll/approve', [new App\Controllers\NominaController(), 'approve']);

// Rutas Gastos
$router->get('/api/gastos/solicitudes', [new App\Controllers\GastosController(), 'getGastos']);
$router->post('/api/gastos/solicitudes', [new App\Controllers\GastosController(), 'createGasto']);

require_once __DIR__ . '/../routes/api.php';

$router->dispatch();
?>
