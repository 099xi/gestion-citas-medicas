# Sistema de Gestión de Citas Médicas

Proyecto formativo del programa Tecnología en Análisis y Desarrollo de Software
(ADSO) — SENA, Ficha 3336056. Aplicación web para agendar, consultar y gestionar
citas médicas entre pacientes, médicos y administradores.

**Aprendiz:** Leonardo José Madera Buelvas

## Stack tecnológico
- **Base de datos:** MySQL 8 (InnoDB), base `gestion_citas_medicas`
- **Frontend:** React + Vite + React Router (datos de prueba en esta etapa)
- **Backend:** Node.js (planeado para la siguiente iteración)
- **Versionamiento:** Git + GitHub — ramas `main` / `develop` / `feature/*` / `fix/*`,
  mensajes con Conventional Commits

## Estructura del repositorio
| Carpeta | Contenido |
|---|---|
| `citas-frontend/` | Aplicación React (paneles público, paciente y administrador) |
| `database/` | Scripts SQL 01–05 y respaldo de la base (Evidencia 2) |
| `docs/` | Modelo relacional, documentos técnicos y de validación |

## Requisitos
- Node.js 18 o superior (probado con v26.5.1)
- MySQL Server 8.0 (probado con 8.0.46)
- Git

## Instalación y ejecución
<<<<<<< HEAD
- Paso 0 (develop): verificar Node con node -v antes de instalar.
=======
- Paso 0 (fix): abrir CMD en la carpeta del proyecto antes de cualquier comando.
>>>>>>> fix/conflicto-readme
### Frontend
```bash
cd citas-frontend
npm install
npm install react-router-dom
npm run dev
```
Abrir http://localhost:5173 — usuarios de demostración:

| Rol | Correo | Contraseña |
|---|---|---|
| Paciente | juan.martinez@correo.com | Paciente123* |
| Médico | carlos.ramirez@clinica.com | Medico123* |
| Administrador | admin@clinica.com | Admin123* |

### Base de datos
- **Opción A (scripts, en orden):** ejecutar `database/01_DDL_creacion_bd.sql` hasta
  `database/05_validacion_integridad.sql` en un cliente MySQL.
- **Opción B (respaldo):** `mysql -u root -p gestion_citas_medicas < database/respaldo_gestion_citas.sql`

## Convenciones de versionamiento
- `main`: versión estable (solo recibe merges probados; se etiqueta con `vX.Y.Z`)
- `develop`: rama de integración
- `feature/<nombre>` y `fix/<nombre>`: trabajo aislado
- Commits: `feat:`, `fix:`, `docs:`, `chore:`, `merge:` (Conventional Commits)

## Documentación
En `docs/`: modelo relacional normalizado a 3FN, documento técnico de la base de
datos, documento de validación del frontend frente al prototipo, mapa de
navegación y prototipo aprobado.