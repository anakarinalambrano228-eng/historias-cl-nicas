// ========================================
// IMPORTADOR DE HISTORIAS - EXCEL Y PDF
// ========================================

// Crear interfaz de importación
function crearInterfazImportacion() {
  const html = `
    <div id="modal-importacion" class="modal-overlay" style="display:none;">
      <div class="modal-contenido" style="background:white; border-radius:12px; padding:30px; max-width:600px; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <h2 style="margin:0; color:#1a3a5c;">📤 Importar Historias</h2>
          <button onclick="cerrarModalImportacion()" style="background:none; border:none; font-size:24px; cursor:pointer;">✕</button>
        </div>

        <div class="tabs-importacion" style="display:flex; gap:10px; margin-bottom:20px; border-bottom:2px solid #e2e8f0;">
          <button class="tab-btn active" onclick="cambiarTabImportacion('excel')" style="padding:10px 20px; border:none; background:none; cursor:pointer; font-weight:600; border-bottom:3px solid #2c5282; color:#2c5282;">📊 Excel</button>
          <button class="tab-btn" onclick="cambiarTabImportacion('pdf')" style="padding:10px 20px; border:none; background:none; cursor:pointer; font-weight:600; border-bottom:3px solid transparent; color:#666;">📄 PDF</button>
          <button class="tab-btn" onclick="cambiarTabImportacion('json')" style="padding:10px 20px; border:none; background:none; cursor:pointer; font-weight:600; border-bottom:3px solid transparent; color:#666;">📋 JSON</button>
        </div>

        <!-- TAB EXCEL -->
        <div id="tab-excel" class="tab-content">
          <div style="background:#f0f4f8; padding:20px; border-radius:8px; text-align:center; margin-bottom:15px; border:2px dashed #4299e1;">
            <div style="font-size:32px; margin-bottom:10px;">📊</div>
            <p style="margin:0 0 10px; color:#1a3a5c; font-weight:600;">Sube tu archivo Excel</p>
            <p style="margin:0 0 15px; font-size:0.9rem; color:#666;">Formato: .xlsx o .csv</p>
            <input type="file" id="archivo-excel" accept=".xlsx,.xls,.csv" onchange="procesarExcel(event)" style="display:none;">
            <button class="btn btn-primary" onclick="document.getElementById('archivo-excel').click()" style="width:100%;">Seleccionar archivo</button>
            <div id="estado-excel" style="margin-top:10px; font-size:0.9rem; color:#666;"></div>
          </div>

          <div style="background:#fffaf0; padding:15px; border-radius:8px; margin-bottom:15px; border-left:4px solid #dd6b20;">
            <p style="margin:0; font-size:0.9rem; color:#555;"><strong>📝 Formato esperado:</strong></p>
            <p style="margin:5px 0; font-size:0.85rem; color:#666;">
              Tu Excel debe tener columnas como:<br>
              <code style="background:#fff; padding:2px 4px;">Nombre | Documento | Fecha | Motivo | Diagnóstico | Presión | Temperatura | Observaciones</code>
            </p>
          </div>

          <div id="preview-excel" style="background:#f7fafc; padding:10px; border-radius:8px; max-height:200px; overflow-y:auto; display:none;">
            <p style="margin:0 0 10px; font-size:0.9rem; font-weight:600; color:#1a3a5c;">Vista previa:</p>
            <div id="preview-excel-contenido"></div>
          </div>

          <button class="btn btn-success" onclick="importarExcel()" id="btn-importar-excel" style="width:100%; display:none; margin-top:10px;">✅ Importar Excel</button>
        </div>

        <!-- TAB PDF -->
        <div id="tab-pdf" class="tab-content" style="display:none;">
          <div style="background:#f0f4f8; padding:20px; border-radius:8px; text-align:center; margin-bottom:15px; border:2px dashed #4299e1;">
            <div style="font-size:32px; margin-bottom:10px;">📄</div>
            <p style="margin:0 0 10px; color:#1a3a5c; font-weight:600;">Sube tu archivo PDF</p>
            <p style="margin:0 0 15px; font-size:0.9rem; color:#666;">Se extraerán los datos automáticamente</p>
            <input type="file" id="archivo-pdf" accept=".pdf" onchange="procesarPDF(event)" style="display:none;">
            <button class="btn btn-primary" onclick="document.getElementById('archivo-pdf').click()" style="width:100%;">Seleccionar PDF</button>
            <div id="estado-pdf" style="margin-top:10px; font-size:0.9rem; color:#666;"></div>
          </div>

          <div style="background:#fffaf0; padding:15px; border-radius:8px; margin-bottom:15px; border-left:4px solid #dd6b20;">
            <p style="margin:0; font-size:0.9rem; color:#555;"><strong>⚠️ Nota:</strong></p>
            <p style="margin:5px 0; font-size:0.85rem; color:#666;">
              Los PDFs se procesan mejor si contienen tablas o texto estructurado.
            </p>
          </div>

          <div id="preview-pdf" style="background:#f7fafc; padding:10px; border-radius:8px; max-height:200px; overflow-y:auto; display:none;">
            <p style="margin:0 0 10px; font-size:0.9rem; font-weight:600; color:#1a3a5c;">Datos extraídos:</p>
            <div id="preview-pdf-contenido"></div>
          </div>

          <button class="btn btn-success" onclick="importarPDF()" id="btn-importar-pdf" style="width:100%; display:none; margin-top:10px;">✅ Importar PDF</button>
        </div>

        <!-- TAB JSON -->
        <div id="tab-json" class="tab-content" style="display:none;">
          <div style="background:#f0f4f8; padding:20px; border-radius:8px; text-align:center; margin-bottom:15px; border:2px dashed #4299e1;">
            <div style="font-size:32px; margin-bottom:10px;">📋</div>
            <p style="margin:0 0 10px; color:#1a3a5c; font-weight:600;">Importar desde JSON</p>
            <p style="margin:0 0 15px; font-size:0.9rem; color:#666;">Copia y pega el contenido JSON</p>
            <textarea id="json-input" style="width:100%; height:150px; padding:10px; border:2px solid #e2e8f0; border-radius:8px; font-family:monospace; font-size:0.85rem; resize:vertical;" placeholder='{"historias":[{"nombre":"Juan","documento":"123","fecha":"2024-08-18",...}]}'></textarea>
            <button class="btn btn-success" onclick="importarJSON()" style="width:100%; margin-top:10px;">✅ Importar JSON</button>
          </div>

          <div style="background:#fffaf0; padding:15px; border-radius:8px; border-left:4px solid #dd6b20;">
            <p style="margin:0; font-size:0.9rem; color:#555;"><strong>📝 Formato JSON:</strong></p>
            <p style="margin:5px 0; font-size:0.85rem; color:#666;">
              Estructura esperada: <code style="background:#fff; padding:2px 4px;">{"historias": [{"nombre":"...", "documento":"...", ...}]}</code>
            </p>
          </div>
        </div>

        <div style="display:flex; gap:10px; margin-top:20px; justify-content:flex-end;">
          <button class="btn btn-outline" onclick="cerrarModalImportacion()">Cancelar</button>
          <button class="btn btn-primary" onclick="verificarImportacion()">Continuar</button>
        </div>
      </div>
    </div>
  `;

  if (!document.getElementById('modal-importacion')) {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}

// Abrir modal de importación
function abrirModalImportacion() {
  crearInterfazImportacion();
  document.getElementById('modal-importacion').style.display = 'flex';
  document.getElementById('modal-importacion').style.position = 'fixed';
  document.getElementById('modal-importacion').style.top = '0';
  document.getElementById('modal-importacion').style.left = '0';
  document.getElementById('modal-importacion').style.width = '100%';
  document.getElementById('modal-importacion').style.height = '100%';
  document.getElementById('modal-importacion').style.alignItems = 'center';
  document.getElementById('modal-importacion').style.justifyContent = 'center';
  document.getElementById('modal-importacion').style.zIndex = '9999';
  document.getElementById('modal-importacion').style.backgroundColor = 'rgba(0,0,0,0.3)';
}

// Cerrar modal
function cerrarModalImportacion() {
  const modal = document.getElementById('modal-importacion');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Cambiar tab
function cambiarTabImportacion(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(`tab-${tab}`).style.display = 'block';

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.style.borderBottomColor = 'transparent';
    btn.style.color = '#666';
  });
  event.target.style.borderBottomColor = '#2c5282';
  event.target.style.color = '#2c5282';
}

// ========================================
// PROCESAMIENTO DE EXCEL
// ========================================

let datosExcelProcesados = null;

function procesarExcel(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const datos = e.target.result;
      
      if (archivo.name.endsWith('.csv')) {
        datosExcelProcesados = procesarCSV(datos);
      } else {
        // Para .xlsx usamos una librería simple de parsing
        datosExcelProcesados = procesarXLSX(datos);
      }

      mostrarPreviewExcel();
      document.getElementById('btn-importar-excel').style.display = 'block';
      document.getElementById('estado-excel').textContent = `✅ ${archivo.name} cargado correctamente`;
    } catch (error) {
      document.getElementById('estado-excel').textContent = `❌ Error: ${error.message}`;
    }
  };
  
  reader.readAsText(archivo);
}

function procesarCSV(contenido) {
  const lineas = contenido.trim().split('\n');
  const headers = lineas[0].split(',').map(h => h.trim());
  const datos = [];

  for (let i = 1; i < lineas.length; i++) {
    const valores = lineas[i].split(',').map(v => v.trim());
    const fila = {};
    headers.forEach((header, index) => {
      fila[header.toLowerCase()] = valores[index] || '';
    });
    datos.push(fila);
  }

  return datos;
}

function procesarXLSX(datos) {
  // Implementación simple para XLSX (requiere biblioteca externa)
  // Por ahora, retornamos los datos como CSV
  return procesarCSV(datos);
}

function mostrarPreviewExcel() {
  if (!datosExcelProcesados) return;

  const preview = document.getElementById('preview-excel-contenido');
  const html = datosExcelProcesados.slice(0, 5).map((fila, idx) => `
    <div style="background:white; padding:8px; margin-bottom:5px; border-radius:4px; border-left:3px solid #4299e1;">
      <strong>Registro ${idx + 1}:</strong><br>
      <small>${JSON.stringify(fila).substring(0, 100)}...</small>
    </div>
  `).join('');

  preview.innerHTML = html;
  document.getElementById('preview-excel').style.display = 'block';
}

function importarExcel() {
  if (!datosExcelProcesados || datosExcelProcesados.length === 0) {
    mostrarToast('⚠️ No hay datos para importar', 'warning');
    return;
  }

  const historiasNuevas = datosExcelProcesados.map((fila, idx) => {
    // Buscar paciente por nombre o documento
    let pacienteId = null;
    const pacienteBuscado = allPacientes.find(p => 
      p.numDoc === (fila.documento || fila.cedula) ||
      (p.nombre.toLowerCase() + ' ' + p.apellido.toLowerCase()).includes((fila.nombre || '').toLowerCase())
    );

    if (pacienteBuscado) {
      pacienteId = pacienteBuscado.id;
    } else {
      // Crear paciente temporal
      const [nombre, apellido] = ((fila.nombre || 'Paciente').split(' '));
      const nuevoPaciente = {
        id: Date.now() + idx,
        nombre: nombre || 'Paciente',
        apellido: apellido || 'Importado',
        numDoc: fila.documento || fila.cedula || '',
        tipoDoc: 'CC',
        fechaRegistro: new Date().toISOString(),
        sexo: 'Femenino',
        regimen: 'Particular'
      };
      allPacientes.push(nuevoPaciente);
      pacienteId = nuevoPaciente.id;
    }

    return {
      id: Date.now() + idx,
      pacienteId: pacienteId,
      tipo: fila.tipo || 'Medicina General',
      fecha: fila.fecha || new Date().toISOString(),
      diagnosticoPrincipal: fila.diagnostico || fila.dx || '',
      motivoConsulta: fila.motivo || fila.motivo_consulta || '',
      examenes: {
        presion: fila.presion || fila.presion_arterial || '',
        temperatura: fila.temperatura || '',
        pulso: fila.pulso || fila.frecuencia_cardiaca || '',
        peso: fila.peso || '',
        talla: fila.talla || '',
        respiracion: fila.respiracion || fila.frecuencia_respiratoria || ''
      },
      datos: {
        historia: fila.historia || fila.observaciones || '',
        tratamiento: fila.tratamiento || fila.medicamentos || '',
        observaciones: fila.observaciones || ''
      }
    };
  });

  historiasClínicas = historiasClínicas.concat(historiasNuevas);
  guardarDatos();

  mostrarToast(`✅ ${historiasNuevas.length} historias importadas correctamente`, 'success');
  
  setTimeout(() => {
    cerrarModalImportacion();
    datosExcelProcesados = null;
  }, 1500);
}

// ========================================
// PROCESAMIENTO DE PDF
// ========================================

let datosPDFProcesados = null;

function procesarPDF(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      // Para PDF necesitaremos PDF.js, por ahora extraemos texto básico
      const datos = e.target.result;
      datosPDFProcesados = extraerTextoBasico(datos);
      
      mostrarPreviewPDF();
      document.getElementById('btn-importar-pdf').style.display = 'block';
      document.getElementById('estado-pdf').textContent = `✅ ${archivo.name} procesado`;
    } catch (error) {
      document.getElementById('estado-pdf').textContent = `❌ Error al procesar PDF`;
    }
  };

  reader.readAsArrayBuffer(archivo);
}

function extraerTextoBasico(buffer) {
  // Extracción simple de texto de PDF
  const texto = new TextDecoder().decode(buffer);
  const lineas = texto.split('\n').filter(l => l.trim().length > 0);
  
  return {
    texto: lineas.join('\n'),
    lineas: lineas
  };
}

function mostrarPreviewPDF() {
  if (!datosPDFProcesados) return;

  const preview = document.getElementById('preview-pdf-contenido');
  const textoLimitado = datosPDFProcesados.lineas.slice(0, 10);
  
  const html = `
    <div style="background:white; padding:10px; border-radius:4px; font-size:0.85rem; line-height:1.5; color:#333; font-family:monospace;">
      ${textoLimitado.map(linea => `<div>${linea.substring(0, 80)}</div>`).join('')}
      ${datosPDFProcesados.lineas.length > 10 ? `<div style="color:#999;">... ${datosPDFProcesados.lineas.length - 10} líneas más</div>` : ''}
    </div>
  `;

  preview.innerHTML = html;
  document.getElementById('preview-pdf').style.display = 'block';
}

function importarPDF() {
  if (!datosPDFProcesados) {
    mostrarToast('⚠️ No hay datos para importar', 'warning');
    return;
  }

  // Crear una historia manual desde el PDF
  const historia = {
    id: Date.now(),
    pacienteId: pacienteActual?.id || Date.now() + 1,
    tipo: 'Medicina General',
    fecha: new Date().toISOString(),
    diagnosticoPrincipal: 'Importado de PDF',
    datos: {
      contenidoPDF: datosPDFProcesados.texto,
      observaciones: 'Importado desde archivo PDF'
    }
  };

  historiasClínicas.push(historia);
  guardarDatos();

  mostrarToast('✅ PDF importado como historia', 'success');
  
  setTimeout(() => {
    cerrarModalImportacion();
    datosPDFProcesados = null;
  }, 1500);
}

// ========================================
// PROCESAMIENTO DE JSON
// ========================================

function importarJSON() {
  const jsonTexto = document.getElementById('json-input').value.trim();
  
  if (!jsonTexto) {
    mostrarToast('⚠️ Pega el contenido JSON', 'warning');
    return;
  }

  try {
    const datos = JSON.parse(jsonTexto);
    const historiasArray = datos.historias || datos;

    if (!Array.isArray(historiasArray)) {
      throw new Error('El JSON debe contener un array de historias');
    }

    const historiasNuevas = historiasArray.map((h, idx) => {
      // Buscar o crear paciente
      let pacienteId = null;
      const pacienteBuscado = allPacientes.find(p => 
        p.numDoc === (h.documento || h.cedula) ||
        (p.nombre.toLowerCase() + ' ' + p.apellido.toLowerCase()).includes((h.nombre || '').toLowerCase())
      );

      if (pacienteBuscado) {
        pacienteId = pacienteBuscado.id;
      } else {
        const nuevoPaciente = {
          id: Date.now() + idx,
          nombre: h.nombre_paciente || h.nombre || 'Paciente',
          apellido: h.apellido || 'Importado',
          numDoc: h.documento || h.cedula || '',
          tipoDoc: 'CC',
          fechaRegistro: new Date().toISOString()
        };
        allPacientes.push(nuevoPaciente);
        pacienteId = nuevoPaciente.id;
      }

      return {
        id: Date.now() + idx,
        pacienteId: pacienteId,
        tipo: h.tipo || 'Medicina General',
        fecha: h.fecha || new Date().toISOString(),
        diagnosticoPrincipal: h.diagnostico || h.dx || '',
        datos: h
      };
    });

    historiasClínicas = historiasClínicas.concat(historiasNuevas);
    guardarDatos();

    mostrarToast(`✅ ${historiasNuevas.length} historias importadas desde JSON`, 'success');
    
    setTimeout(() => {
      cerrarModalImportacion();
      document.getElementById('json-input').value = '';
    }, 1500);

  } catch (error) {
    mostrarToast(`❌ Error en JSON: ${error.message}`, 'error');
  }
}

// ========================================
// VERIFICAR E IMPORTAR
// ========================================

function verificarImportacion() {
  const tabActiva = document.querySelector('.tab-btn[style*="border-bottom-color: rgb(44, 82, 130)"]')?.textContent;
  
  if (tabActiva?.includes('Excel')) {
    if (datosExcelProcesados) {
      importarExcel();
    }
  } else if (tabActiva?.includes('PDF')) {
    if (datosPDFProcesados) {
      importarPDF();
    }
  } else if (tabActiva?.includes('JSON')) {
    importarJSON();
  }
}

console.log('✅ Importador de historias cargado');
