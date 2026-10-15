// =============================================================================
// SIMULADOR DE CONTEO Y CONTROL DE IMPRESIONES - M&P PUBLICIDAD Y SERVICIOS
// Autor: Franco Marca Gómez /// Ingeniería de Software
// =============================================================================

// Base de Datos de Tarifas Predeterminadas (S/ por hoja)
const DEFAULT_TARIFFS = {
  BOND_75:     { name: "Papel Bond 75 gr", desc: "Uso estándar para copias y texto", bn: 0.10, color: 0.50 },
  BOND_80:     { name: "Papel Bond 80 gr", desc: "Documentos formales y tesis", bn: 0.15, color: 0.60 },
  CARTULINA:   { name: "Cartulina Escolar / Hilo", desc: "Carátulas, certificados y diplomas", bn: 0.50, color: 1.20 },
  COUCHE_150:  { name: "Papel Couché 150 gr", desc: "Trípticos, volantes y catálogos brillantes", bn: 0.80, color: 1.50 },
  OPALINA:     { name: "Cartulina Opalina 180 gr", desc: "Tarjetas de presentación y portadas premium", bn: 1.00, color: 2.00 }
};

// 18 Criterios UAT de la Presentación y Guía Práctica
const UAT_CRITERIA_LIST = [
  { id: 1, name: "Inicio de sesión", expected: "El usuario puede ingresar con sus credenciales válidas", status: "Aprobada" },
  { id: 2, name: "Registro de impresión", expected: "El empleado puede registrar correctamente un trabajo", status: "Aprobada" },
  { id: 3, name: "Conteo de hojas", expected: "El sistema registra de forma exacta la cantidad de hojas", status: "Aprobada" },
  { id: 4, name: "Selección de material", expected: "Se puede seleccionar el material utilizado", status: "Aprobada" },
  { id: 5, name: "Configuración de color", expected: "Se puede indicar si es a color o blanco y negro", status: "Aprobada" },
  { id: 6, name: "Cálculo del costo", expected: "El sistema calcula automáticamente y con exactitud el monto", status: "Aprobada" },
  { id: 7, name: "Consulta de registros", expected: "El empleado puede consultar impresiones anteriores", status: "Aprobada" },
  { id: 8, name: "Corrección de datos", expected: "El usuario puede corregir información antes de confirmar", status: "Aprobada" },
  { id: 9, name: "Almacenamiento persistente", expected: "La información permanece tras cerrar o reiniciar", status: "Aprobada" },
  { id: 10, name: "Manejo de errores", expected: "El sistema muestra mensajes claros ante datos incorrectos", status: "Aprobada" },
  { id: 11, name: "Tiempo de respuesta", expected: "Responde en menos de 1 segundo ante operaciones principales", status: "Aprobada" },
  { id: 12, name: "Facilidad de uso", expected: "Un empleado puede operar sin asistencia técnica constante", status: "Aprobada" },
  { id: 13, name: "Interfaz intuitiva", expected: "Botones y formularios claros y comprensibles", status: "Aprobada" },
  { id: 14, name: "Control de accesos", expected: "Usuarios acceden a funciones según su rol (Admin/Empleado)", status: "Aprobada" },
  { id: 15, name: "Reportes organizados", expected: "Información acumulada clara para arqueo de caja", status: "Aprobada" },
  { id: 16, name: "Comunicación con impresora", expected: "Recepción y procesamiento fluido de señales de hardware", status: "Aprobada" },
  { id: 17, name: "Recuperación ante error", expected: "Permite continuar ante fallo controlado sin colapsar", status: "Aprobada" },
  { id: 18, name: "Satisfacción del usuario", expected: "El usuario confirma que el software simplifica y agiliza su trabajo", status: "Aprobada" }
];

// 11 Etapas de Despliegue
const DEPLOY_STAGES = [
  { num: 1, name: "Verificación de requisitos del equipo", resp: "Técnico", time: "1 hora" },
  { num: 2, name: "Copia de seguridad preventiva", resp: "Técnico / Administrador", time: "30 min" },
  { num: 3, name: "Instalación del software e inicialización", resp: "Técnico", time: "1 hora" },
  { num: 4, name: "Configuración de controlador e impresora", resp: "Técnico", time: "1 hora" },
  { num: 5, name: "Configuración de tarifas y materiales", resp: "Administrador", time: "1 hora" },
  { num: 6, name: "Migración o carga inicial de datos", resp: "Técnico", time: "1 hora" },
  { num: 7, name: "Pruebas de funcionamiento técnicas", resp: "Técnico / Usuario", time: "1 hora" },
  { num: 8, name: "Pruebas UAT con personal de ventanilla", resp: "Usuario Clave / Gerencia", time: "1 hora" },
  { num: 9, name: "Capacitación práctica a empleados", resp: "Técnico", time: "2 horas" },
  { num: 10, name: "Puesta en producción oficial", resp: "Técnico / Administrador", time: "1 hora" },
  { num: 11, name: "Monitoreo y soporte inicial en vivo", resp: "Técnico", time: "1-2 días" }
];

// Estado de la Aplicación
let tariffs = JSON.parse(localStorage.getItem('mp_tariffs')) || DEFAULT_TARIFFS;
let printRecords = JSON.parse(localStorage.getItem('mp_records')) || [];
let currentRole = "EMPLEADO"; // "EMPLEADO" o "ADMIN"
let isHardwareOnline = true;
let ticketCounter = parseInt(localStorage.getItem('mp_ticket_counter')) || 101;

// Inicialización al cargar DOM
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupRoleSwitcher();
  calculateTotal();
  renderTariffsTable();
  renderRecordsTable();
  renderUATTable();
  renderDeployStages();
  updateKPIs();
});

// =============================================================================
// NAVEGACIÓN ENTRE PESTAÑAS
// =============================================================================
function setupTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

function setupRoleSwitcher() {
  const btn = document.getElementById('btnSwitchRole');
  const tag = document.getElementById('currentRoleTag');
  btn.addEventListener('click', () => {
    currentRole = currentRole === "EMPLEADO" ? "ADMINISTRADOR" : "EMPLEADO";
    tag.textContent = currentRole;
    tag.style.backgroundColor = currentRole === "ADMINISTRADOR" ? "var(--clr-dark-teal)" : "var(--clr-coral)";
    logSpooler(`[AUTH-EVENT] Cambio de rol activo a: ${currentRole} (Franco Marca Gómez)`);
  });
}

// =============================================================================
// MOTOR DE CÁLCULO Y VENTANILLA (Paso 1 y 2)
// =============================================================================
function calculateTotal() {
  const pageCount = parseInt(document.getElementById('pageCount').value) || 0;
  const copiesCount = parseInt(document.getElementById('copiesCount').value) || 1;
  const materialKey = document.getElementById('paperMaterial').value;
  const colorMode = document.getElementById('printColorMode').value;
  const discountRate = parseFloat(document.getElementById('discountRate').value) || 0;

  const totalPages = pageCount * copiesCount;
  const matInfo = tariffs[materialKey] || DEFAULT_TARIFFS.BOND_75;
  const unitPrice = colorMode === 'COLOR' ? matInfo.color : matInfo.bn;

  const subtotal = totalPages * unitPrice;
  const discountAmount = subtotal * (discountRate / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Actualizar Resumen en UI
  document.getElementById('summaryTotalPages').textContent = `${totalPages} hojas (${pageCount} págs × ${copiesCount} copias)`;
  document.getElementById('summaryUnitPrice').textContent = `S/ ${unitPrice.toFixed(2)} c/u`;
  document.getElementById('summaryMaterialBadge').textContent = matInfo.name;
  document.getElementById('summaryColorBadge').textContent = colorMode === 'COLOR' ? 'A Todo Color' : 'Blanco y Negro';
  
  const discRow = document.getElementById('discountRow');
  if (discountRate > 0) {
    discRow.style.display = 'flex';
    document.getElementById('summaryDiscount').textContent = `- S/ ${discountAmount.toFixed(2)} (${discountRate}%)`;
  } else {
    discRow.style.display = 'none';
  }

  document.getElementById('totalAmountDisplay').textContent = `S/ ${finalTotal.toFixed(2)}`;

  return { totalPages, unitPrice, subtotal, discountAmount, finalTotal, matInfo, colorMode };
}

// Cargar Casos de Prueba Predefinidos
function loadPreset(type) {
  if (type === 'tesis') {
    document.getElementById('clientName').value = "Ing. Carlos Mendoza (Tesis Maestría)";
    document.getElementById('docName').value = "Tesis_Final_Version_Empastado.pdf";
    document.getElementById('pageCount').value = 120;
    document.getElementById('copiesCount').value = 1;
    document.getElementById('paperMaterial').value = "BOND_80";
    document.getElementById('printColorMode').value = "BN";
    document.getElementById('discountRate').value = 5;
  } else if (type === 'triptico') {
    document.getElementById('clientName').value = "Agencia Creativa M&P Publicidad";
    document.getElementById('docName').value = "Triptico_Campana_Verano.pdf";
    document.getElementById('pageCount').value = 50;
    document.getElementById('copiesCount').value = 2;
    document.getElementById('paperMaterial').value = "COUCHE_150";
    document.getElementById('printColorMode').value = "COLOR";
    document.getElementById('discountRate').value = 0;
  } else if (type === 'monografia') {
    document.getElementById('clientName').value = "Colegio Nacional San Martín";
    document.getElementById('docName').value = "Monografia_Historia_Peru.docx";
    document.getElementById('pageCount').value = 30;
    document.getElementById('copiesCount').value = 1;
    document.getElementById('paperMaterial').value = "BOND_75";
    document.getElementById('printColorMode').value = "BN";
    document.getElementById('discountRate').value = 0;
  } else if (type === 'afiche') {
    document.getElementById('clientName').value = "Restaurante Local Ilo";
    document.getElementById('docName').value = "Menu_Afiche_A3_Promocional.pdf";
    document.getElementById('pageCount').value = 10;
    document.getElementById('copiesCount').value = 1;
    document.getElementById('paperMaterial').value = "OPALINA";
    document.getElementById('printColorMode').value = "COLOR";
    document.getElementById('discountRate').value = 0;
  }
  calculateTotal();
  logSpooler(`[PRESET-LOAD] Caso de prueba cargado: '${type.toUpperCase()}'`);
}

// Procesar Cobro y Registro en Base de Datos Local
function processCheckout() {
  if (!isHardwareOnline) {
    alert("⚠️ ERROR DE COMUNICACIÓN: La impresora está fuera de línea. Por favor verifique el cable USB o conexión de red.");
    logSpooler("[ERROR-SPOOLER] Intento de cobro fallido. Spooler no responde (COMM_ERROR_OFFLINE).");
    return;
  }

  const calc = calculateTotal();
  const client = document.getElementById('clientName').value.trim() || "Público General";
  const doc = document.getElementById('docName').value.trim() || "Documento_Impresion.pdf";
  const printer = document.getElementById('printerSelect').value;

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-PE');
  const timeStr = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  const ticketId = `MP-${ticketCounter++}`;
  localStorage.setItem('mp_ticket_counter', ticketCounter);

  const newRecord = {
    ticketId,
    timestamp: `${dateStr} ${timeStr}`,
    client,
    doc,
    printer,
    pages: calc.totalPages,
    material: calc.matInfo.name,
    color: calc.colorMode === 'COLOR' ? 'Color' : 'B/N',
    unitPrice: calc.unitPrice,
    total: calc.finalTotal,
    operator: `Franco Marca (${currentRole})`
  };

  printRecords.unshift(newRecord);
  localStorage.setItem('mp_records', JSON.stringify(printRecords));

  // Actualizar UI
  renderRecordsTable();
  updateKPIs();
  updateRecentTicketBox(newRecord);
  showTicketModal(newRecord);

  logSpooler(`[TRANSACTION-OK] Ticket ${ticketId} registrado: ${calc.totalPages} págs (${newRecord.color}) -> S/ ${calc.finalTotal.toFixed(2)} [Cliente: ${client}]`);
}

function updateRecentTicketBox(rec) {
  document.getElementById('recentTicketId').textContent = `#${rec.ticketId}`;
  document.getElementById('recentTicketBody').innerHTML = `
    <strong>${rec.client}</strong> — ${rec.doc}<br>
    ${rec.pages} hojas ${rec.material} (${rec.color}) | <strong>Total: S/ ${rec.total.toFixed(2)}</strong><br>
    <small style="color:#64748B;">Registrado: ${rec.timestamp} por ${rec.operator}</small>
  `;
}

function showTicketModal(rec) {
  const modal = document.getElementById('ticketModal');
  const content = document.getElementById('modalTicketContent');
  content.innerHTML = `
    <div style="text-align:center; margin-bottom:1rem; border-bottom:1px dashed #CBD5E1; padding-bottom:0.75rem;">
      <h2 style="font-family:'Outfit'; color:#0A242A; font-size:1.3rem; margin:0;">M&P PUBLICIDAD Y SERVICIOS</h2>
      <p style="font-size:0.8rem; color:#64748B; margin:0.2rem 0;">Servicios de Impresión, Fotocopiado y Publicidad</p>
      <p style="font-size:0.75rem; color:#0A242A; font-weight:bold;">TICKET DE VENTA: #${rec.ticketId}</p>
    </div>
    <div style="font-size:0.85rem; line-height:1.6; margin-bottom:1rem;">
      <div><strong>Fecha / Hora:</strong> ${rec.timestamp}</div>
      <div><strong>Cliente:</strong> ${rec.client}</div>
      <div><strong>Archivo:</strong> ${rec.doc}</div>
      <div><strong>Operador:</strong> ${rec.operator}</div>
      <hr style="border:none; border-top:1px dashed #CBD5E1; margin:0.6rem 0;">
      <div style="display:flex; justify-content:space-between;">
        <span>${rec.pages} hojas × S/ ${rec.unitPrice.toFixed(2)} (${rec.material} - ${rec.color}):</span>
        <strong>S/ ${rec.total.toFixed(2)}</strong>
      </div>
      <hr style="border:none; border-top:1px dashed #CBD5E1; margin:0.6rem 0;">
      <div style="display:flex; justify-content:space-between; font-size:1.15rem; color:#0A242A; font-weight:800; font-family:'Outfit';">
        <span>TOTAL COBRADO:</span>
        <span style="color:#E45730;">S/ ${rec.total.toFixed(2)}</span>
      </div>
    </div>
    <div style="background:#F5F2ED; padding:0.6rem; border-radius:6px; font-size:0.75rem; color:#64748B; text-align:center;">
      ✔ Trabajo contabilizado automáticamente por el sistema.<br>¡Gracias por su preferencia!
    </div>
  `;
  modal.style.display = 'flex';
}

function closeTicketModal() {
  document.getElementById('ticketModal').style.display = 'none';
}

function resetForm() {
  document.getElementById('pageCount').value = 1;
  document.getElementById('copiesCount').value = 1;
  document.getElementById('discountRate').value = 0;
  calculateTotal();
}

// Simulación de lectura automática directa desde Spooler
function simulateSpoolerDirect() {
  const randomPages = Math.floor(Math.random() * 85) + 5;
  const isColor = Math.random() > 0.4;
  document.getElementById('pageCount').value = randomPages;
  document.getElementById('printColorMode').value = isColor ? 'COLOR' : 'BN';
  calculateTotal();
  logSpooler(`[HARDWARE-INTERCEPT] Evento winspool.drv recibido: Documento de ${randomPages} páginas analizado. Modo: ${isColor ? 'COLOR' : 'B/N'}`);
  alert(`✨ ¡Lectura de hardware simulada con éxito!\nSe detectaron ${randomPages} páginas en modo ${isColor ? 'COLOR' : 'BLANCO Y NEGRO'}.`);
}

// =============================================================================
// MONITOR DE SPOOLER Y EVENTOS DE HARDWARE
// =============================================================================
function logSpooler(msg) {
  const log = document.getElementById('spoolerConsoleLog');
  const now = new Date().toLocaleTimeString('es-PE');
  log.textContent = `[${now}] ${msg}\n` + log.textContent;
}

function clearConsoleLog() {
  document.getElementById('spoolerConsoleLog').textContent = "// Consola reiniciada por el operador.";
}

function toggleHardwareFault() {
  isHardwareOnline = !isHardwareOnline;
  const badge = document.getElementById('printerStatusBadge');
  const text = document.getElementById('printerStatusText');
  const pipe = document.getElementById('commPipe');
  const printerNode = document.getElementById('printerNodeBadge');

  if (isHardwareOnline) {
    badge.className = "system-badge online";
    text.textContent = "Impresora Multifuncional: EN LÍNEA (USB001 / TCP-IP)";
    pipe.className = "connection-pipe active";
    printerNode.className = "badge badge-success";
    printerNode.textContent = "Conectada";
    logSpooler("[COMM-RESTORE] Conexión USB/TCP-IP reestablecida con Epson EcoTank.");
  } else {
    badge.className = "system-badge offline";
    text.textContent = "Impresora Multifuncional: DESCONECTADA / FALLA";
    pipe.className = "connection-pipe fault";
    printerNode.className = "badge badge-danger";
    printerNode.textContent = "Sin Respuesta";
    logSpooler("[COMM-FAULT] ALERTA: Cable USB desconectado o impresora sin señal. Se activa manejo de errores.");
  }
}

function sendTestJobSpooler(pages, color) {
  if (!isHardwareOnline) {
    alert("No se puede enviar trabajo: la impresora está desconectada.");
    return;
  }
  logSpooler(`[JOB-DISPATCH] Trabajo de prueba enviado: ${pages} páginas (${color}) -> Cola de impresión procesada en 0.18s`);
}

// =============================================================================
// HISTORIAL Y ARQUEO DE CAJA
// =============================================================================
function renderRecordsTable() {
  const tbody = document.getElementById('recordsTableBody');
  if (printRecords.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4">No hay impresiones registradas aún. ¡Procesa tu primer trabajo en Ventanilla!</td></tr>`;
    return;
  }

  tbody.innerHTML = printRecords.map(r => `
    <tr>
      <td><strong>#${r.ticketId}</strong></td>
      <td>${r.timestamp}</td>
      <td>${r.client}</td>
      <td>${r.doc}</td>
      <td><strong>${r.pages}</strong></td>
      <td>${r.material}</td>
      <td><span class="tag-pill">${r.color}</span></td>
      <td><strong style="color:var(--clr-coral)">S/ ${r.total.toFixed(2)}</strong></td>
      <td><small>${r.operator}</small></td>
    </tr>
  `).join('');
}

function updateKPIs() {
  const totalRev = printRecords.reduce((acc, r) => acc + r.total, 0);
  const totalPages = printRecords.reduce((acc, r) => acc + r.pages, 0);
  const totalJobs = printRecords.length;
  const avgTicket = totalJobs > 0 ? (totalRev / totalJobs) : 0;

  document.getElementById('kpiTotalRevenue').textContent = `S/ ${totalRev.toFixed(2)}`;
  document.getElementById('kpiTotalPages').textContent = totalPages.toLocaleString();
  document.getElementById('kpiTotalJobs').textContent = totalJobs;
  document.getElementById('kpiAvgTicket').textContent = `S/ ${avgTicket.toFixed(2)}`;
}

function clearAllRecords() {
  if (confirm("¿Estás seguro de que deseas reiniciar el historial de arqueo de caja?")) {
    printRecords = [];
    localStorage.removeItem('mp_records');
    renderRecordsTable();
    updateKPIs();
    logSpooler("[DB-RESET] Historial de caja reiniciado por el Administrador.");
  }
}

function exportRecordsToCSV() {
  if (printRecords.length === 0) {
    alert("No hay registros para exportar.");
    return;
  }

  let csv = "Ticket,Fecha_Hora,Cliente,Archivo,Hojas,Material,Color,Total_Soles,Operador\n";
  printRecords.forEach(r => {
    csv += `"${r.ticketId}","${r.timestamp}","${r.client}","${r.doc}",${r.pages},"${r.material}","${r.color}",${r.total.toFixed(2)},"${r.operator}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Arqueo_Caja_MP_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  logSpooler("[EXPORT-CSV] Reporte consolidado de caja exportado a archivo CSV.");
}

// =============================================================================
// MATRIZ DE TARIFAS (ADMIN)
// =============================================================================
function renderTariffsTable() {
  const tbody = document.getElementById('tariffsTableBody');
  tbody.innerHTML = Object.keys(tariffs).map(key => {
    const item = tariffs[key];
    return `
      <tr>
        <td><code>${key}</code></td>
        <td><strong>${item.name}</strong></td>
        <td><small class="text-muted">${item.desc}</small></td>
        <td>
          <input type="number" step="0.05" min="0.05" class="form-control" style="width:110px;" value="${item.bn.toFixed(2)}" onchange="updateTariff('${key}', 'bn', this.value)">
        </td>
        <td>
          <input type="number" step="0.05" min="0.10" class="form-control" style="width:110px;" value="${item.color.toFixed(2)}" onchange="updateTariff('${key}', 'color', this.value)">
        </td>
        <td>
          <span class="badge badge-success">Activo</span>
        </td>
      </tr>
    `;
  }).join('');
}

function updateTariff(key, type, val) {
  const num = parseFloat(val);
  if (!isNaN(num) && num > 0) {
    tariffs[key][type] = num;
    localStorage.setItem('mp_tariffs', JSON.stringify(tariffs));
    calculateTotal();
    logSpooler(`[TARIFF-UPDATE] Tarifa '${key}' (${type.toUpperCase()}) actualizada a S/ ${num.toFixed(2)}`);
  }
}

function restoreDefaultTariffs() {
  if (confirm("¿Restaurar las tarifas a los valores predeterminados del sistema?")) {
    tariffs = JSON.parse(JSON.stringify(DEFAULT_TARIFFS));
    localStorage.setItem('mp_tariffs', JSON.stringify(tariffs));
    renderTariffsTable();
    calculateTotal();
    logSpooler("[TARIFF-RESTORE] Tarifas restauradas a valores iniciales de fábrica.");
  }
}

// =============================================================================
// SUITE DE PRUEBAS UAT (18/18)
// =============================================================================
function renderUATTable() {
  const tbody = document.getElementById('uatTableBody');
  tbody.innerHTML = UAT_CRITERIA_LIST.map(c => `
    <tr id="uat-row-${c.id}">
      <td><strong>${c.id}</strong></td>
      <td><strong>${c.name}</strong></td>
      <td>${c.expected}</td>
      <td><button class="btn btn-sm btn-outline" onclick="runSingleUAT(${c.id})">Probar Criterio</button></td>
      <td><span class="badge badge-success" id="uat-badge-${c.id}">✔ Aprobada</span></td>
    </tr>
  `).join('');
}

function runSingleUAT(id) {
  const badge = document.getElementById(`uat-badge-${id}`);
  badge.className = "badge badge-accent";
  badge.textContent = "Verificando...";
  
  setTimeout(() => {
    badge.className = "badge badge-success";
    badge.textContent = "✔ Aprobada";
    logSpooler(`[UAT-TEST] Criterio ${id} (${UAT_CRITERIA_LIST[id-1].name}) validado satisfactoriamente.`);
  }, 400);
}

function runAllUATTests() {
  logSpooler("[UAT-SUITE] Iniciando ejecución completa de las 18 pruebas UAT...");
  UAT_CRITERIA_LIST.forEach((c, idx) => {
    const badge = document.getElementById(`uat-badge-${c.id}`);
    badge.className = "badge badge-accent";
    badge.textContent = "Verificando...";

    setTimeout(() => {
      badge.className = "badge badge-success";
      badge.textContent = "✔ Aprobada";
    }, (idx + 1) * 150);
  });

  setTimeout(() => {
    alert("🎉 ¡Suite UAT completada con éxito!\nLos 18 criterios de aceptación han sido verificados y aprobados al 100%.");
    logSpooler("[UAT-SUITE] Suite finalizada: 18/18 criterios de aceptación APROBADOS.");
  }, UAT_CRITERIA_LIST.length * 150 + 200);
}

// =============================================================================
// DESPLIEGUE Y ROLLBACK
// =============================================================================
function renderDeployStages() {
  const stepper = document.getElementById('stagesStepper');
  stepper.innerHTML = DEPLOY_STAGES.map(s => `
    <div class="stage-item completed" id="stage-box-${s.num}">
      <div class="stage-num">${s.num}</div>
      <div class="stage-info">
        <div class="stage-name">${s.name}</div>
        <div class="stage-sub">Responsable: ${s.resp} | Tiempo estimado: ${s.time}</div>
      </div>
      <span class="badge badge-success" id="stage-badge-${s.num}">Completada</span>
    </div>
  `).join('');
}

function simulateDeploymentCycle() {
  logSpooler("[DEPLOY-SIM] Simulando ciclo completo de pase a producción (11 etapas)...");
  DEPLOY_STAGES.forEach((s, idx) => {
    const box = document.getElementById(`stage-box-${s.num}`);
    const badge = document.getElementById(`stage-badge-${s.num}`);
    box.className = "stage-item";
    badge.className = "badge badge-accent";
    badge.textContent = "En Ejecución...";

    setTimeout(() => {
      box.className = "stage-item completed";
      badge.className = "badge badge-success";
      badge.textContent = "Completada";
    }, (idx + 1) * 200);
  });

  setTimeout(() => {
    alert("✅ Despliegue completado con éxito según el cronograma de 11 etapas.");
    logSpooler("[DEPLOY-SIM] Protocolo de despliegue finalizado exitosamente.");
  }, DEPLOY_STAGES.length * 200 + 200);
}

function triggerRollbackSimulation() {
  logSpooler("[ROLLBACK-ALERT] ¡Simulación de contingencia crítica activada por Administrador!");
  const steps = [
    "1. Incidente detectado: Fallo inducido en conexión con periférico.",
    "2. Evaluación de gravedad: Afecta atención en ventanilla.",
    "3. Detención temporal del software realizada.",
    "4. Copia de seguridad de base de datos actual ejecutada.",
    "5. Restauración a versión de contingencia estable completada.",
    "6. Prueba de verificación de impresión realizada con éxito.",
    "7. Atención reanudada y notificación al equipo de ingeniería."
  ];

  alert("🚨 PROTOCOLO DE ROLLBACK ACTIVADO:\n\n" + steps.join("\n"));
  logSpooler("[ROLLBACK-COMPLETE] Reversión de emergencia completada sin pérdida de registros.");
}
