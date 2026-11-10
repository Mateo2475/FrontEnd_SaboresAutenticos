# Sistema de Ventas a Crédito y Gestión de Cafetería

Este es un sistema integral de gestión de ventas y control de créditos diseñado para una cafetería ubicada dentro de una concesionaria de autos. Permite automatizar las ventas diarias, controlar cuentas corrientes de clientes y gestionar métodos de pago modernos y combinados.

## Características Clave del Negocio
* **Ventas en Modalidad Mixta:** Soporte para compras al contado y ventas bajo línea de crédito.
* **Control de Crédito Automatizado:** Límite estricto de crédito de **500 Soles sin intereses** por cliente.
* **Flexibilidad de Pagos y Abonos:** Registro de amortizaciones mediante Efectivo, Yape, Plin o **Pago Combinado** (ej. una parte en Yape y otra en efectivo).
* **Módulo de Auditoría de Cuentas:** Vista detallada del historial de ventas y reporte en tiempo real de los clientes con mayores saldos deudores.

## Stack Tecnológico
* **Frontend:** Angular (Gestión de interfaces interactivas, componentes modulares y consumo de APIs).
* **Control de Versiones:** Git & GitHub.

## Arquitectura del Sistema
El proyecto sigue un modelo desacoplado (**Client-Server Architecture**):
1. El **Frontend en Angular** captura los eventos del usuario (registro de ventas, abonos, consultas) y realiza peticiones HTTP.
2. El **Backend en Spring Boot** recibe las peticiones, procesa las reglas de negocio (como validar si el cliente excede los 500 soles de crédito) y se comunica con la base de datos a través de JPA/Hibernate.
3. La base de datos **MySQL** persiste la información de manera segura y estructurada.

## Instalación y Ejecución (Frontend)
1. Clonar este repositorio.
2. Ejecutar `npm install` para instalar las dependencias.
3. Ejecutar `ng serve` para correr la aplicación de Angular localmente en `http://localhost:4200/`.

