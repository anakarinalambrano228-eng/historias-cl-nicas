// ========================================
// HISTORIA CLÍNICA DIGITAL - DATOS Y FUNCIONES
// ========================================

// Variables globales
let pacienteActual = null;
let pacientePorTipo = {};
let historiasClínicas = [];
let allPacientes = [];

// Base de datos CIE-10 simplificada
const CIE10_DATABASE = [
  { code: 'A00', name: 'Cólera' },
  { code: 'A01', name: 'Fiebre tifoidea' },
  { code: 'A15', name: 'Tuberculosis pulmonar' },
  { code: 'B00', name: 'Infección por virus del herpes simple' },
  { code: 'B01', name: 'Varicela' },
  { code: 'B02', name: 'Herpes zóster' },
  { code: 'C00', name: 'Cáncer de labio' },
  { code: 'C50', name: 'Cáncer de mama' },
  { code: 'D10', name: 'Neoplasia benigna de boca' },
  { code: 'E10', name: 'Diabetes mellitus tipo 1' },
  { code: 'E11', name: 'Diabetes mellitus tipo 2' },
  { code: 'E66', name: 'Obesidad' },
  { code: 'F10', name: 'Trastornos relacionados con alcohol' },
  { code: 'F32', name: 'Episodio depresivo' },
  { code: 'F41', name: 'Trastornos de ansiedad' },
  { code: 'G30', name: 'Enfermedad de Alzheimer' },
  { code: 'G89', name: 'Dolor' },
  { code: 'H10', name: 'Conjuntivitis' },
  { code: 'I10', name: 'Hipertensión arterial' },
  { code: 'I20', name: 'Angina de pecho' },
  { code: 'I21', name: 'Infarto agudo de miocardio' },
  { code: 'I63', name: 'Infarto cerebral' },
  { code: 'J00', name: 'Rinofaringitis aguda' },
  { code: 'J01', name: 'Sinusitis aguda' },
  { code: 'J02', name: 'Faringitis aguda' },
  { code: 'J03', name: 'Amigdalitis aguda' },
  { code: 'J04', name: 'Laringitis y traqueítis' },
  { code: 'J05', name: 'Laringotraqueobronquitis' },
  { code: 'J06', name: 'Infección respiratoria aguda múltiple' },
  { code: 'J09', name: 'Influenza' },
  { code: 'J10', name: 'Influenza' },
  { code: 'J11', name: 'Influenza no identificada' },
  { code: 'J12', name: 'Neumonía viral' },
  { code: 'J13', name: 'Neumonía neumocócica' },
  { code: 'J15', name: 'Neumonía bacteriana' },
  { code: 'J18', name: 'Neumonía' },
  { code: 'J20', name: 'Bronquitis aguda' },
  { code: 'J21', name: 'Bronquiolitis aguda' },
  { code: 'J40', name: 'Bronquitis crónica' },
  { code: 'J45', name: 'Asma' },
  { code: 'K25', name: 'Úlcera gástrica' },
  { code: 'K29', name: 'Gastritis' },
  { code: 'K35', name: 'Apendicitis aguda' },
  { code: 'K40', name: 'Hernia inguinal' },
  { code: 'K50', name: 'Enfermedad de Crohn' },
  { code: 'K51', name: 'Colitis ulcerosa' },
  { code: 'K70', name: 'Enfermedad alcohólica del hígado' },
  { code: 'K71', name: 'Lesión hepática tóxica' },
  { code: 'K80', name: 'Colelitiasis' },
  { code: 'L20', name: 'Dermatitis atópica' },
  { code: 'L30', name: 'Dermatitis' },
  { code: 'L50', name: 'Urticaria' },
  { code: 'L80', name: 'Vitíligo' },
  { code: 'L89', name: 'Úlcera por presión' },
  { code: 'M05', name: 'Artritis reumatoide seropositiva' },
  { code: 'M06', name: 'Otras formas de artritis' },
  { code: 'M17', name: 'Gonartrosis' },
  { code: 'M54', name: 'Dolor de espalda' },
  { code: 'N00', name: 'Glomerulonefritis' },
  { code: 'N18', name: 'Enfermedad renal crónica' },
  { code: 'N39', name: 'Otros trastornos urinarios' },
  { code: 'O00', name: 'Embarazo ectópico' },
  { code: 'O80', name: 'Parto espontáneo' },
  { code: 'P00', name: 'Problemas del recién nacido' },
  { code: 'Q00', name: 'Anencefalia' },
  { code: 'Q05', name: 'Espina bífida' },
  { code: 'R00', name: 'Síncope y colapso' },
  { code: 'R01', name: 'Hallazgos anormales en examen' },
  { code: 'R06', name: 'Anormalidades de la respiración' },
  { code: 'R07', name: 'Dolor torácico' },
  { code: 'R10', name: 'Dolor abdominal' },
  { code: 'S00', name: 'Traumatismo de cabeza' },
  { code: 'S72', name: 'Fractura de fémur' },
  { code: 'T00', name: 'Traumatismo superficial' },
  { code: 'V87', name: 'Accidente de tránsito' },
  { code: 'Z00', name: 'Examen médico y evaluación' },
  { code: 'Z12', name: 'Examen de detección de cáncer' },
  { code: 'Z23', name: 'Encuentro para vacunación' },
];

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
  cargarDatos();
  inicializarEventos();
});

// Cargar datos del localStorage
function cargarDatos() {
  try {
    const pacientesGuardados = localStorage.getItem('pacientes');
    const historiasGuardadas = localStorage.getItem('historias');
    
    if (pacientesGuardados) {
      allPacientes = JSON.parse(pacientesGuardados);
    }
    if (historiasGuardadas) {
      historiasClínicas = JSON.parse(historiasGuardadas);
    }
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
}

// Guardar datos en localStorage
function guardarDatos() {
  try {
    localStorage.setItem('pacientes', JSON.stringify(allPacientes));
    localStorage.setItem('historias', JSON.stringify(historiasClínicas));
  } catch (error) {
    console.error('Error guardando datos:', error);
  }
}

// Inicializar eventos
function inicializarEventos() {
  // Autocomplete para CIE-10
  const inputDx = document.getElementById('dx-input');
  if (inputDx) {
    inputDx.addEventListener('input', filtrarDiagnosticos);
  }
}

// Mostrar notificación toast
function mostrarToast(mensaje, tipo = 'info') {
  const container = document.getElementById('hc-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `hc-toast ${tipo}`;
  toast.textContent = mensaje;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Mostrar advertencia
function mostrarAdvertencia(mensaje) {
  alert(mensaje);
}

// Navegar entre pantallas
function navegar(pantalla) {
  const pantallas = document.querySelectorAll('.pantalla');
  pantallas.forEach(p => p.classList.add('hidden'));
  
  const pantallaBuscada = document.getElementById(pantalla);
  if (pantallaBuscada) {
    pantallaBuscada.classList.remove('hidden');
  }
}

// ========== PACIENTES ==========

// Iniciar nuevo paciente
function iniciarNuevoPaciente() {
  pacienteActual = null;
  limpiarFormularioNuevoPaciente();
  navegar('pantalla-nuevo-paciente');
}

// Limpiar formulario
function limpiarFormularioNuevoPaciente() {
  document.getElementById('np-nombre').value = '';
  document.getElementById('np-apellido').value = '';
  document.getElementById('np-tipo-doc').value = 'CC';
  document.getElementById('np-numero-doc').value = '';
  document.getElementById('np-fecha-nacimiento').value = '';
  document.getElementById('np-edad-calculada').value = '';
  document.getElementById('np-sexo').value = 'Femenino';
  document.getElementById('np-estado-civil').value = 'Soltero(a)';
  document.getElementById('np-telefono').value = '';
  document.getElementById('np-email').value = '';
  document.getElementById('np-sangre').value = 'Desconocido';
  document.getElementById('np-ocupacion').value = '';
  document.getElementById('np-empresa-nombre').value = '';
  document.getElementById('np-empresa-nit').value = '';
  document.getElementById('np-direccion').value = '';
  document.getElementById('np-municipio').value = '';
  document.getElementById('np-aseguradora').value = 'Particular (Sin Convenio)';
  document.getElementById('np-regimen').value = 'Particular';
}

// Calcular edad
function calcularEdadRegistro() {
  const fechaNac = document.getElementById('np-fecha-nacimiento').value;
  if (!fechaNac) return;

  const hoy = new Date();
  const nacimiento = new Date(fechaNac);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  document.getElementById('np-edad-calculada').value = edad + ' años';
}

// Guardar paciente
function guardarPaciente() {
  const nombre = document.getElementById('np-nombre').value.trim();
  const apellido = document.getElementById('np-apellido').value.trim();
  const numDoc = document.getElementById('np-numero-doc').value.trim();
  const tipoDoc = document.getElementById('np-tipo-doc').value;

  if (!nombre || !apellido || !numDoc) {
    mostrarToast('⚠️ Completa: Nombres, Apellidos y Documento', 'warning');
    return;
  }

  const paciente = {
    id: Date.now(),
    nombre,
    apellido,
    numDoc,
    tipoDoc,
    fechaNacimiento: document.getElementById('np-fecha-nacimiento').value,
    sexo: document.getElementById('np-sexo').value,
    estadoCivil: document.getElementById('np-estado-civil').value,
    telefono: document.getElementById('np-telefono').value,
    email: document.getElementById('np-email').value,
    tipoSangre: document.getElementById('np-sangre').value,
    ocupacion: document.getElementById('np-ocupacion').value,
    empresa: document.getElementById('np-empresa-nombre').value,
    nit: document.getElementById('np-empresa-nit').value,
    direccion: document.getElementById('np-direccion').value,
    municipio: document.getElementById('np-municipio').value,
    aseguradora: document.getElementById('np-aseguradora').value,
    regimen: document.getElementById('np-regimen').value,
    fechaRegistro: new Date().toISOString()
  };

  // Verificar si ya existe
  const existe = allPacientes.find(p => p.numDoc === numDoc);
  if (existe) {
    mostrarToast('⚠️ Este paciente ya existe', 'warning');
    return;
  }

  allPacientes.push(paciente);
  guardarDatos();
  mostrarToast('✅ Paciente guardado exitosamente', 'success');
  
  setTimeout(() => {
    limpiarFormularioNuevoPaciente();
    navegar('pantalla-inicio');
  }, 1500);
}

// Guardar y registrar otro
function guardarYRegistrarOtroPaciente() {
  const nombre = document.getElementById('np-nombre').value.trim();
  const apellido = document.getElementById('np-apellido').value.trim();
  const numDoc = document.getElementById('np-numero-doc').value.trim();

  if (!nombre || !apellido || !numDoc) {
    mostrarToast('⚠️ Completa los datos del paciente', 'warning');
    return;
  }

  const paciente = {
    id: Date.now(),
    nombre,
    apellido,
    numDoc,
    tipoDoc: document.getElementById('np-tipo-doc').value,
    fechaNacimiento: document.getElementById('np-fecha-nacimiento').value,
    sexo: document.getElementById('np-sexo').value,
    estadoCivil: document.getElementById('np-estado-civil').value,
    telefono: document.getElementById('np-telefono').value,
    email: document.getElementById('np-email').value,
    tipoSangre: document.getElementById('np-sangre').value,
    ocupacion: document.getElementById('np-ocupacion').value,
    empresa: document.getElementById('np-empresa-nombre').value,
    nit: document.getElementById('np-empresa-nit').value,
    direccion: document.getElementById('np-direccion').value,
    municipio: document.getElementById('np-municipio').value,
    aseguradora: document.getElementById('np-aseguradora').value,
    regimen: document.getElementById('np-regimen').value,
    fechaRegistro: new Date().toISOString()
  };

  allPacientes.push(paciente);
  guardarDatos();
  mostrarToast('✅ Paciente guardado. Registrando nuevo...', 'success');
  
  setTimeout(() => {
    limpiarFormularioNuevoPaciente();
  }, 500);
}

// Buscar paciente
function buscarPacienteGlobal() {
  const busqueda = document.getElementById('busqueda-paciente-global').value.trim().toLowerCase();
  
  if (!busqueda) {
    mostrarToast('⚠️ Ingresa nombre o documento', 'warning');
    return;
  }

  const resultados = allPacientes.filter(p => 
    p.nombre.toLowerCase().includes(busqueda) ||
    p.apellido.toLowerCase().includes(busqueda) ||
    p.numDoc.includes(busqueda)
  );

  const container = document.getElementById('resultado-busqueda-global');
  
  if (resultados.length === 0) {
    container.innerHTML = '<p style="color:#e53e3e; text-align:center;">❌ No se encontraron pacientes</p>';
    return;
  }

  container.innerHTML = resultados.map(p => `
    <div class="history-item" onclick="seleccionarPaciente(${p.id})">
      <div>
        <div style="font-weight:600;">${p.nombre} ${p.apellido}</div>
        <div style="font-size:0.85rem; color:#666;">📄 ${p.tipoDoc}: ${p.numDoc}</div>
      </div>
      <button class="btn btn-primary" style="padding:8px 16px; font-size:0.85rem;">Abrir</button>
    </div>
  `).join('');
}

// Seleccionar paciente
function seleccionarPaciente(pacienteId) {
  pacienteActual = allPacientes.find(p => p.id === pacienteId);
  
  if (!pacienteActual) {
    mostrarToast('❌ Paciente no encontrado', 'error');
    return;
  }

  pacientePorTipo = {
    general: pacienteActual,
    laboral: pacienteActual
  };

  mostrarFichaPaciente();
}

// Mostrar ficha del paciente
function mostrarFichaPaciente() {
  if (!pacienteActual) return;

  document.getElementById('fp-nombre').textContent = `${pacienteActual.nombre} ${pacienteActual.apellido}`;
  document.getElementById('fp-doc').textContent = `📄 ${pacienteActual.tipoDoc}: ${pacienteActual.numDoc}`;
  document.getElementById('fp-telefono').textContent = `📱 ${pacienteActual.telefono || 'No registrado'}`;
  document.getElementById('fp-regimen').textContent = pacienteActual.regimen || 'Particular';

  const edad = calcularEdad(pacienteActual.fechaNacimiento);
  document.getElementById('fp-edad').textContent = `👤 ${edad} años`;
  document.getElementById('fp-sexo').textContent = `${pacienteActual.sexo === 'Femenino' ? '♀' : '♂'} ${pacienteActual.sexo}`;
  document.getElementById('fp-nacimiento').textContent = `🎂 ${formatearFecha(pacienteActual.fechaNacimiento)}`;

  mostrarHistoriasDelPaciente();
  navegar('pantalla-paciente-encontrado');
}

// Calcular edad desde fecha
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 'N/A';
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

// Formatear fecha
function formatearFecha(fecha) {
  if (!fecha) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-CO', options);
}

// Mostrar historias del paciente
function mostrarHistoriasDelPaciente() {
  if (!pacienteActual) return;

  const historias = historiasClínicas.filter(h => h.pacienteId === pacienteActual.id);
  const container = document.getElementById('historias-lista');

  if (historias.length === 0) {
    container.innerHTML = `
      <p style="font-size:1.1rem;">📭 No hay historias registradas para este paciente.</p>
      <p style="font-size:0.9rem; margin-top:8px;">Use el botón <strong>"Nueva Consulta"</strong> para crear la primera atención.</p>
    `;
    return;
  }

  container.innerHTML = historias.map(h => `
    <div class="history-item">
      <div>
        <div class="history-date">${formatearFecha(h.fecha)}</div>
        <div class="history-type">${h.tipo}</div>
        <div class="history-dx">${h.diagnosticoPrincipal || 'Sin diagnóstico'}</div>
      </div>
      <button class="btn btn-outline" onclick="verHistoria(${h.id})" style="padding:8px 16px;">Ver</button>
    </div>
  `).join('');
}

// ========== CONSULTAS ==========

// Iniciar consulta
function iniciarConsulta(tipo) {
  if (!pacienteActual) {
    mostrarToast('⚠️ Selecciona un paciente primero', 'warning');
    return;
  }

  const historia = {
    id: Date.now(),
    pacienteId: pacienteActual.id,
    tipo: tipo === 'general' ? 'Medicina General' : 'Medicina Laboral',
    fecha: new Date().toISOString(),
    datos: {}
  };

  historiasClínicas.push(historia);
  guardarDatos();

  navegar('pantalla-nueva-consulta');
  mostrarToast('✅ Nueva consulta iniciada', 'success');
}

// Ver historia
function verHistoria(historiaId) {
  const historia = historiasClínicas.find(h => h.id === historiaId);
  if (historia) {
    console.log('Historia:', historia);
    mostrarToast('Ver completa la historia en consola', 'info');
  }
}

// Abrir última historia
function abrirUltimaHistoria() {
  if (!pacienteActual) return;
  
  const historias = historiasClínicas.filter(h => h.pacienteId === pacienteActual.id);
  if (historias.length > 0) {
    verHistoria(historias[historias.length - 1].id);
  } else {
    mostrarToast('⚠️ No hay historias para este paciente', 'warning');
  }
}

// ========== DIAGNÓSTICOS CIE-10 ==========

// Filtrar diagnósticos
function filtrarDiagnosticos(event) {
  const valor = event.target.value.toLowerCase();
  const container = document.getElementById('dx-autocomplete') || crearAutocompleteDx();

  if (!valor) {
    container.style.display = 'none';
    return;
  }

  const resultados = CIE10_DATABASE.filter(d =>
    d.code.toLowerCase().includes(valor) ||
    d.name.toLowerCase().includes(valor)
  ).slice(0, 10);

  if (resultados.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.innerHTML = resultados.map(d => `
    <div class="autocomplete-item" onclick="seleccionarDiagnostico('${d.code}', '${d.name}')">
      <code>${d.code}</code> - ${d.name}
    </div>
  `).join('');

  container.style.display = 'block';
}

// Crear elemento autocomplete
function crearAutocompleteDx() {
  const container = document.createElement('div');
  container.id = 'dx-autocomplete';
  container.className = 'autocomplete-results';
  document.body.appendChild(container);
  return container;
}

// Seleccionar diagnóstico
function seleccionarDiagnostico(codigo, nombre) {
  const input = document.getElementById('dx-input');
  if (input) {
    input.value = `${codigo} - ${nombre}`;
  }
  const container = document.getElementById('dx-autocomplete');
  if (container) {
    container.style.display = 'none';
  }
}

// ========== UTILIDADES ==========

// Toggle gineco-obstétricos
function toggleGinecoObstetricos() {
  const sexo = document.getElementById('np-sexo').value;
  const ginecoSection = document.querySelector('.gineco-obstetricos');
  if (ginecoSection) {
    ginecoSection.style.display = sexo === 'Femenino' ? 'block' : 'none';
  }
}

// Mostrar panel de configuración
function hcMostrarPanelConfiguracion() {
  const mensaje = `
📊 CONFIGURACIÓN DE DATOS

Total de pacientes: ${allPacientes.length}
Total de historias: ${historiasClínicas.length}

Opciones:
1. Descargar copia de seguridad
2. Limpiar datos (⚠️ irreversible)
3. Ver estadísticas
  `.trim();
  
  alert(mensaje);
}

// Eliminar paciente
function hcEliminarPaciente(numDoc) {
  if (!confirm('⚠️ ¿Estás seguro? Esta acción no se puede deshacer.')) {
    return;
  }

  const index = allPacientes.findIndex(p => p.numDoc === numDoc);
  if (index > -1) {
    allPacientes.splice(index, 1);
    
    // Eliminar también sus historias
    historiasClínicas = historiasClínicas.filter(h => h.pacienteId !== allPacientes[index]?.id);
    
    guardarDatos();
    mostrarToast('✅ Paciente eliminado', 'success');
    navegar('pantalla-buscar');
  }
}

// Búsqueda por documento en ficha
function buscarPacientePorDocumentoFicha() {
  const doc = document.getElementById('buscar-doc-ficha').value.trim();
  if (!doc) {
    mostrarToast('⚠️ Ingresa un documento', 'warning');
    return;
  }

  const paciente = allPacientes.find(p => p.numDoc === doc);
  if (paciente) {
    seleccionarPaciente(paciente.id);
    mostrarToast('✅ Paciente encontrado', 'success');
  } else {
    mostrarToast('❌ Paciente no encontrado', 'error');
  }
}

console.log('✅ assets-data.js cargado correctamente');
