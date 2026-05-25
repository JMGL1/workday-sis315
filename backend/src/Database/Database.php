<?php

namespace App\Database;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            try {
                $isRender = getenv('RENDER') !== false;
                $dbUrl = getenv('DATABASE_URL');
                $isPostgres = false;

                if ($dbUrl) {
                    // Render PostgreSQL
                    $db = parse_url($dbUrl);
                    $host = $db['host'];
                    $port = $db['port'] ?? 5432;
                    $user = $db['user'];
                    $pass = $db['pass'];
                    $dbName = ltrim($db['path'], '/');
                    $dsn = "pgsql:host=$host;port=$port;dbname=$dbName";
                    self::$instance = new PDO($dsn, $user, $pass);
                    $isPostgres = true;
                } elseif ($isRender) {
                    // Fallback to SQLite on Render if no Postgres URL
                    $dbFile = '/var/www/database.sqlite';
                    $dsn = "sqlite:$dbFile";
                    self::$instance = new PDO($dsn);
                } else {
                    // Configuración para XAMPP (MySQL Local)
                    $host = '127.0.0.1';
                    $db   = 'erp_workday';
                    $user = 'root';
                    $pass = ''; // Por defecto XAMPP no tiene contraseña
                    $charset = 'utf8mb4';

                    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
                    self::$instance = new PDO($dsn, $user, $pass);
                }
                
                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                
                self::initSchema(self::$instance, $isRender && !$isPostgres, $isPostgres);
            } catch (PDOException $e) {
                die("Connection failed: " . $e->getMessage());
            }
        }
        return self::$instance;
    }

    private static function initSchema(PDO $pdo, bool $isSqlite = false, bool $isPostgres = false): void
    {
        $pkType = $isSqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : ($isPostgres ? 'SERIAL PRIMARY KEY' : 'INT AUTO_INCREMENT PRIMARY KEY');
        // Initialize basic tables if they don't exist
            // 1. Usuarios (Login/Auth)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS users (
                    id $pkType,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) DEFAULT 'employee',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ");

            // 2. Empleados (HCM)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS empleados (
                    id $pkType,
                    nombre VARCHAR(100) NOT NULL,
                    departamento VARCHAR(100) NOT NULL,
                    cargo VARCHAR(100) NOT NULL,
                    salario_base DECIMAL(10,2) DEFAULT 0.00,
                    estado VARCHAR(50) DEFAULT 'Activo'
                )
            ");

            // 3. Candidatos (Reclutamiento)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS candidatos (
                    id $pkType,
                    nombre VARCHAR(100) NOT NULL,
                    puesto VARCHAR(100) NOT NULL,
                    estado VARCHAR(50) DEFAULT 'postulado',
                    fecha_aplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ");

            // 4. Transacciones (Finanzas)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS transacciones (
                    id $pkType,
                    fecha DATE NOT NULL,
                    concepto VARCHAR(255) NOT NULL,
                    categoria VARCHAR(100) NOT NULL,
                    tipo VARCHAR(50) NOT NULL,
                    monto DECIMAL(12,2) NOT NULL,
                    estado VARCHAR(50) DEFAULT 'Completado'
                )
            ");

            // 5. Nómina Historial (Nomina)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS nomina (
                    id $pkType,
                    empleado_id INT NULL,
                    fecha DATE NOT NULL,
                    horas DECIMAL(5,2) NOT NULL,
                    tarifa DECIMAL(10,2) NOT NULL,
                    bruto DECIMAL(12,2) NOT NULL,
                    deducciones DECIMAL(12,2) NOT NULL,
                    neto DECIMAL(12,2) NOT NULL
                )
            ");

            // 6. Asistencia
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS asistencia (
                    id $pkType,
                    empleado_id INT NULL,
                    tipo VARCHAR(50) NOT NULL,
                    fecha DATE NOT NULL,
                    hora TIME NOT NULL
                )
            ");

            // 7. Gastos
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS gastos (
                    id $pkType,
                    empleado_id INT NULL,
                    fecha DATE NOT NULL,
                    descripcion VARCHAR(255) NOT NULL,
                    monto DECIMAL(10,2) NOT NULL,
                    estado VARCHAR(50) DEFAULT 'Pendiente'
                )
            ");

            // 8. Inventario
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS inventario (
                    id $pkType,
                    articulo VARCHAR(150) NOT NULL,
                    stock INT DEFAULT 0,
                    minimo INT DEFAULT 0,
                    estado VARCHAR(50) DEFAULT 'Óptimo'
                )
            ");

            // 9. Objetivos (Gestión de Talento)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS talento_objetivos (
                    id $pkType,
                    titulo VARCHAR(255) NOT NULL,
                    departamento VARCHAR(100) NOT NULL,
                    progreso INT DEFAULT 0,
                    estado VARCHAR(50) DEFAULT 'No Iniciado'
                )
            ");

            // 10. Presupuestos (Planificación Adaptativa)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS presupuestos (
                    id $pkType,
                    trimestre VARCHAR(10) NOT NULL,
                    monto_asignado DECIMAL(15,2) NOT NULL,
                    gasto_real DECIMAL(15,2) DEFAULT 0.00
                )
            ");

            // Insert admin user if not exists
            $stmt = $pdo->query("SELECT COUNT(*) FROM users");
            if ($stmt->fetchColumn() == 0) {
                // Default passwords are 'admin', 'rrhh', 'gerente', 'empleado'
                $pwdAdmin = password_hash('admin', PASSWORD_DEFAULT);
                $pwdRrhh = password_hash('rrhh', PASSWORD_DEFAULT);
                $pwdGerente = password_hash('gerente', PASSWORD_DEFAULT);
                $pwdEmpleado = password_hash('empleado', PASSWORD_DEFAULT);
                
                $pdo->exec("INSERT INTO users (username, password, role) VALUES 
                    ('admin', '$pwdAdmin', 'admin'),
                    ('rrhh', '$pwdRrhh', 'rrhh'),
                    ('gerente', '$pwdGerente', 'gerente'),
                    ('empleado', '$pwdEmpleado', 'empleado')
                ");

            $stmt = $pdo->query("SELECT COUNT(*) FROM empleados");
            if ($stmt->fetchColumn() < 10) {
                // Massive Seeding if DB is mostly empty
                $pdo->exec("INSERT INTO empleados (nombre, departamento, cargo, salario_base, estado) VALUES 
                    ('Juan Perez', 'TI', 'Desarrollador Senior', 15000, 'Activo'),
                    ('Maria Gomez', 'Finanzas', 'Contadora', 12000, 'Activo'),
                    ('Carlos Ruiz', 'Ventas', 'Ejecutivo de Ventas', 9000, 'Activo'),
                    ('Ana Martinez', 'Recursos Humanos', 'Especialista RRHH', 10500, 'Activo'),
                    ('Luis Torres', 'TI', 'Soporte Técnico', 7000, 'Activo'),
                    ('Elena Suarez', 'Marketing', 'Diseñadora Gráfica', 9500, 'Activo'),
                    ('Roberto Gil', 'Operaciones', 'Gerente de Logística', 18000, 'Activo'),
                    ('Sofía Vargas', 'Finanzas', 'Analista Financiero', 11000, 'Activo')
                ");

                $pdo->exec("INSERT INTO transacciones (fecha, concepto, categoria, tipo, monto, estado) VALUES 
                    ('2026-05-01', 'Capital Inicial', 'Inversión', 'ingreso', 500000, 'Completado'),
                    ('2026-05-05', 'Pago Alquiler Oficinas', 'Infraestructura', 'egreso', 15000, 'Completado'),
                    ('2026-05-10', 'Venta Licencias Enterprise', 'Ventas', 'ingreso', 85000, 'Completado'),
                    ('2026-05-12', 'Servicios Cloud AWS', 'Tecnología', 'egreso', 4500, 'Completado'),
                    ('2026-05-15', 'Campaña Ads Google', 'Marketing', 'egreso', 7200, 'Completado')
                ");

                $pdo->exec("INSERT INTO inventario (articulo, stock, minimo, estado) VALUES 
                    ('Laptop Dell XPS 15', 25, 5, 'Óptimo'),
                    ('Monitor LG 27\"', 12, 15, 'Bajo'),
                    ('Teclado Mecánico Keychron', 8, 10, 'Bajo'),
                    ('Sillas Ergonómicas Herman Miller', 45, 10, 'Óptimo'),
                    ('Servidor Rackmount HP', 2, 2, 'Crítico')
                ");

                $pdo->exec("INSERT INTO talento_objetivos (titulo, departamento, progreso, estado) VALUES 
                    ('Lanzar Producto v2.0', 'TI', 75, 'En Progreso'),
                    ('Reducir Costos Operativos un 15%', 'Finanzas', 40, 'En Progreso'),
                    ('Campaña Rebranding Q3', 'Marketing', 10, 'Iniciado'),
                    ('Capacitación Seguridad Industrial', 'Operaciones', 100, 'Completado')
                ");

                $pdo->exec("INSERT INTO candidatos (nombre, puesto, estado) VALUES 
                    ('Fernando López', 'Backend Developer', 'entrevista'),
                    ('Carla Mendoza', 'Especialista Marketing', 'postulado'),
                    ('Diego Castro', 'Contador Junior', 'oferta'),
                    ('Lucía Beltrán', 'UX/UI Designer', 'rechazado')
                ");

                $pdo->exec("INSERT INTO presupuestos (trimestre, monto_asignado, gasto_real) VALUES 
                    ('Q1', 150000.00, 145200.00),
                    ('Q2', 175000.00, 180000.00),
                    ('Q3', 200000.00, 85000.00),
                    ('Q4', 250000.00, 0.00)
                ");

                $pdo->exec("INSERT INTO gastos (empleado_id, fecha, descripcion, monto, estado) VALUES 
                    (3, '2026-05-18', 'Viaje a Conferencia de Ventas', 3500.00, 'Aprobado'),
                    (1, '2026-05-20', 'Licencia IDE JetBrains', 1200.00, 'Pendiente'),
                    (6, '2026-05-21', 'Material POP para Evento', 450.50, 'Aprobado')
                ");

                $pdo->exec("INSERT INTO asistencia (empleado_id, tipo, fecha, hora) VALUES 
                    (1, 'entrada', '2026-05-24', '08:00:00'),
                    (2, 'entrada', '2026-05-24', '08:15:00'),
                    (3, 'entrada', '2026-05-24', '09:00:00'),
                    (1, 'salida', '2026-05-24', '17:05:00')
                ");
            }
        }
    }
}
