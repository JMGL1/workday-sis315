<?php

namespace App\Core;

class Router
{
    private array $routes = [];

    public function get(string $path, array|\Closure $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, array|\Closure $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    public function put(string $path, array|\Closure $handler): void
    {
        $this->addRoute('PUT', $path, $handler);
    }

    public function delete(string $path, array|\Closure $handler): void
    {
        $this->addRoute('DELETE', $path, $handler);
    }

    private function addRoute(string $method, string $path, array|\Closure $handler): void
    {
        // Convert path to regex for parameter matching if needed later
        // For now, exact matching
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function dispatch(): void
    {
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Strip subdirectories if run in a subfolder (XAMPP). Find /api/ and use that as the base path.
        $apiPos = strpos($requestUri, '/api/');
        if ($apiPos !== false) {
            $requestUri = substr($requestUri, $apiPos);
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && $route['path'] === $requestUri) {
                if ($route['handler'] instanceof \Closure) {
                    call_user_func($route['handler']);
                    return;
                }
                
                [$controllerClass, $methodName] = $route['handler'];
                
                if (class_exists($controllerClass)) {
                    $controller = new $controllerClass();
                    if (method_exists($controller, $methodName)) {
                        $controller->$methodName();
                        return;
                    }
                }
            }
        }

        Response::json(['error' => 'Route not found'], 404);
    }
}
