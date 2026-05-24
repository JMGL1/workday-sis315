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
                // Configuración para XAMPP (MySQL Local)
                $host = '127.0.0.1';
                $db   = 'erp_workday';
                $user = 'root';
                $pass = ''; // Por defecto XAMPP no tiene contraseña
                $charset = 'utf8mb4';

                $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
                
                self::$instance = new PDO($dsn, $user, $pass);
                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                
                self::initSchema(self::$instance);
            } catch (PDOException $e) {
                die("Connection failed: " . $e->getMessage());
            }
        }
        return self::$instance;
    }

    private static function initSchema(PDO $pdo): void
    {
        // Initialize basic tables if they don't exist
            // 1. Usuarios (Login/Auth)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) DEFAULT 'employee',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ");

            // 2. Empleados (HCM)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS empleados (
                    id INT AUTO_INCREMENT PRIMARY KEY,
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
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    puesto VARCHAR(100) NOT NULL,
                    estado VARCHAR(50) DEFAULT 'postulado',
                    fecha_aplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ");

            // 4. Transacciones (Finanzas)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS transacciones (
                    id INT AUTO_INCREMENT PRIMARY KEY,
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
                    id INT AUTO_INCREMENT PRIMARY KEY,
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
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    empleado_id INT NULL,
                    tipo VARCHAR(50) NOT NULL,
                    fecha DATE NOT NULL,
                    hora TIME NOT NULL
                )
            ");

            // 7. Gastos
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS gastos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
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
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    articulo VARCHAR(150) NOT NULL,
                    stock INT DEFAULT 0,
                    minimo INT DEFAULT 0,
                    estado VARCHAR(50) DEFAULT 'Óptimo'
                )
            ");

            // 9. Objetivos (Gestión de Talento)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS talento_objetivos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    titulo VARCHAR(255) NOT NULL,
                    departamento VARCHAR(100) NOT NULL,
                    progreso INT DEFAULT 0,
                    estado VARCHAR(50) DEFAULT 'No Iniciado'
                )
            ");

            // 10. Presupuestos (Planificación Adaptativa)
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS presupuestos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
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

                // Seed some initial data
                $pdo->exec("INSERT INTO empleados (nombre, departamento, cargo, salario_base) VALUES 
                    ('Juan Perez', 'TI', 'Desarrollador', 15000),
                    ('Maria Gomez', 'Finanzas', 'Contadora', 12000)
                ");
                $pdo->exec("INSERT INTO transacciones (fecha, concepto, categoria, tipo, monto) VALUES 
                    ('2026-05-01', 'Capital Inicial', 'Inversión', 'ingreso', 500000)
                ");
                $pdo->exec("INSERT INTO inventario (articulo, stock, minimo) VALUES 
                    ('Laptop Dell XPS', 5, 3),
                    ('Monitor 27', 2, 5)
                ");
                $pdo->exec("INSERT INTO talento_objetivos (titulo, departamento, progreso, estado) VALUES 
                    ('Lanzar Producto', 'TI', 75, 'En Progreso')
                ");
                $pdo->exec("INSERT INTO candidatos (nombre, puesto, estado) VALUES 
                    ('Carlos Ruiz', 'Backend Dev', 'entrevista')
                ");
            }
    }
}
