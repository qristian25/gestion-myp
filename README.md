# Sistema de Conteo, Control y Tarifación Automatizada de Impresiones

> **PYME Beneficiaria:** M&P Publicidad y Servicios  
> **Área:** Ingeniería de Software  
> **Autor:** Franco Marca Gómez  
> **Tecnología:** HTML5, CSS3 Moderno, JavaScript Vanilla (Arquitectura MVC + Persistencia Local)

---

## 📌 Descripción del Proyecto

Este software y simulador web interactivo ha sido desarrollado como solución de ingeniería para erradicar las demoras en atención, pérdidas financieras por cálculo manual y falta de trazabilidad en el negocio **M&P Publicidad y Servicios** (centro de impresión, reprografía y acabados publicitarios).

La aplicación actúa como un **sistema intermediario** entre las computadoras del punto de atención y las impresoras de alto volumen (multifuncionales Epson EcoTank, HP LaserJet Pro, etc.), automatizando:
1. La captura de señales de impresión y conteo de páginas/hojas.
2. La determinación instantánea (< 0.2 segundos) de tarifas diferenciadas según material de soporte (Bond 75g, 80g, Cartulina, Couché, Opalina) y color (B/N o Color).
3. El cobro exacto y emisión de tickets digitales detallados.
4. El registro y arqueo de caja con trazabilidad completa para auditoría.

---

## 🚀 Módulos Funcionales Implementados en el Simulador

- **💻 1. Punto de Venta / Ventanilla:** Simulación de recepción de pedidos, selector de plantillas rápidas (Tesis, Trípticos, Monografías, Afiches), cálculo automático y emisión de comprobantes.
- **🖨️ 2. Monitor Spooler (Hardware):** Diagrama interactivo de conexión PC-Impresora (USB / TCP-IP Sockets) con consola de eventos en tiempo real (`winspool.drv` API) y simulación de fallas/desconexión controlada.
- **📊 3. Historial Transaccional y Arqueo de Caja:** Métricas en vivo (recaudación total, hojas impresas, ticket promedio) y exportación de reportes a archivo CSV.
- **⚙️ 4. Matriz de Tarifas (Admin):** Modificación en caliente de precios unitarios con persistencia en `localStorage`.
- **🧪 5. Suite de Pruebas UAT (18 Criterios):** Ejecución automatizada de la lista de verificación completa de aceptación de usuario.
- **🔄 6. Despliegue y Rollback:** Visualización interactiva del cronograma de 11 etapas y simulación del plan de contingencia de reversión en 7 pasos.

---

## 📦 Cómo Exportar y Publicar en GitHub

### Opción Rápida (Script Automático en Windows):
Haz doble clic en el archivo `deploy_to_github.bat` incluido en esta carpeta. Te pedirá tu usuario de GitHub y realizará el proceso automáticamente.

---

### Opción Manual por Terminal:

1. **Crea un nuevo repositorio en GitHub:**
   - Ve a [github.com/new](https://github.com/new).
   - Nombre sugerido: `simulador-impresiones-myp`.
   - Selecciona **Público** y no agregues README ni .gitignore adicionales.

2. **Inicializa y sube tu proyecto local:**
   Abre una consola de comandos (PowerShell o CMD) en esta carpeta y ejecuta:

   ```bash
   git init
   git add .
   git commit -m "feat: Simulador interactivo de conteo y control de impresiones M&P"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/simulador-impresiones-myp.git
   git push -u origin main
   ```

3. **Activar GitHub Pages (Demostración en Línea Gratis):**
   - En tu repositorio de GitHub, haz clic en **Settings** (Configuración).
   - En la barra lateral izquierda, entra a **Pages**.
   - En **Build and deployment → Branch**, selecciona `main` y la carpeta `/(root)`.
   - Haz clic en **Save**.
   - En aproximadamente 1 minuto, tu simulador estará disponible públicamente en:
     ```
     https://TU_USUARIO.github.io/simulador-impresiones-myp/
     ```

---

## 🏛️ Estructura del Proyecto

```
simulador-impresiones-myp/
├── index.html            # Interfaz interactiva y estructura por capas
├── style.css             # Hoja de estilos con paleta oficial "Líneas"
├── app.js                # Lógica del motor MVC, spooler y persistencia
├── README.md             # Documentación técnica y manual de despliegue
├── deploy_to_github.bat  # Script para despliegue automatizado en Windows CMD
└── deploy_to_github.ps1  # Script para despliegue automatizado en PowerShell
```

---

## 👥 Créditos y Referencias

- **Proyecto:** *Conteo y control de impresiones*
- **Entidad:** M&P Publicidad y Servicios
- **Investigación y Desarrollo:** Franco Marca Gómez — *Ingeniería de Software*
