/* ============ KROM DIGITAL · Página de precios ============
   PARA EDITAR PRECIOS: busca el servicio en CATEGORIAS y cambia el número.
   Cada servicio: s(nombre, icono, frase, [[precio, qué incluye] x3], extra)
   extra: '' (pago único) · 'mes' (se cobra cada mes) · 'desde' (precio mínimo)
   Los tres precios van en orden: Esencial, Profesional, Élite.
*/
const CONFIG = {
  whatsapp: '523325310977',          // sin + ni espacios
  telefono: '33 2531 0977',
  instagram: '@krom_digital_',
  instagramUrl: 'https://www.instagram.com/krom_digital_/',
  web: 'kromdigital.com.mx'
};
const NIVELES = [
  { id: 'esencial', nombre: 'Esencial' },
  { id: 'profesional', nombre: 'Profesional' },
  { id: 'elite', nombre: 'Élite' }
];
const s = (nombre, icono, frase, niv, extra = '') => ({ nombre, icono, frase, niv, extra });

const CATEGORIAS = [
  { id: 'web', nombre: 'Web y presencia', titulo: 'Web y presencia digital', desc: 'Que tu negocio se vea y se encuentre en internet.', servicios: [
    s('Páginas web', 'gl', 'Tu negocio, abierto 24/7', [[700, '1 página · botón de WhatsApp'], [1000, '5 secciones · SEO básico'], [1200, 'A la medida · animaciones']]),
    s('Tienda en línea', 'sp', 'Vende desde el celular', [[1000, '20 productos · pedido por WhatsApp'], [2000, '100 productos · pagos en línea'], [3500, 'Panel de pedidos · cupones']]),
    s('Catálogos digitales', 'gr', 'Tus productos, siempre a la mano', [[200, 'Hasta 20 productos'], [300, '100 productos · buscador'], [400, 'Editable por ti']]),
    s('Menús digitales con QR', 'qr', 'Del QR al platillo', [[400, 'Hasta 30 platillos'], [700, 'Fotos · pedido por WhatsApp'], [1000, 'Editable · pedidos por mesa']])
  ]},
  { id: 'sistemas', nombre: 'Sistemas y apps', titulo: 'Sistemas y aplicaciones', desc: 'Herramientas para trabajar mejor y atender más rápido.', servicios: [
    s('Aplicaciones', 'ph', 'Tu negocio en el bolsillo del cliente', [[1500, 'App informativa'], [2500, 'Registro y perfil de usuarios'], [4000, 'A la medida · panel de administración']]),
    s('Paneles de control e insumos', 'pn', 'Control total de tu inventario', [[1200, 'Inventario básico'], [1500, 'Alertas y reportes'], [3000, 'Usuarios, permisos y gráficas']]),
    s('Punto de venta sencillo', 'pv', 'Cobra y lleva tus ventas', [[1500, 'Ventas y productos'], [2800, 'Inventario y corte de caja'], [4000, 'Sucursales y tickets']]),
    s('Citas y reservas', 'cl', 'Tu agenda llena, sin llamadas', [[800, 'Formulario con aviso a WhatsApp'], [1000, 'Agenda y recordatorios'], [2000, 'Varios empleados y pagos']])
  ]},
  { id: 'marketing', nombre: 'Marketing y marca', titulo: 'Marketing y marca', desc: 'Que te conozcan, te recuerden y te elijan.', servicios: [
    s('Control de marketing', 'mg', 'Campaña con inicio y fin', [[500, '1 semana · 5 videos + 5 flyers'], [1000, '2 semanas · 10 videos + 10 flyers'], [1800, '4 semanas · 20 + 20 y reporte']]),
    s('Gestión de redes sociales', 'sh', 'Tus redes activas todo el mes', [[500, '8 publicaciones · 1 red'], [900, '12 publicaciones · 2 redes'], [1600, 'Todas las redes · reporte']], 'mes'),
    s('Logotipo e identidad de marca', 'pe', 'Una marca que se reconoce', [[300, 'Logotipo y archivos'], [700, 'Colores, tipografías y 3 usos'], [1500, 'Manual de marca y papelería']]),
    s('Tarjeta de presentación digital', 'tj', 'Tu contacto en un solo toque', [[200, 'Enlace y código QR'], [350, 'Servicios y galería'], [600, 'Para todo tu equipo']])
  ]},
  { id: 'contenido', nombre: 'Contenido y producción', titulo: 'Contenido y producción', desc: 'Foto, video y gráficos que se ven profesionales.', servicios: [
    s('Edición de video', 'vd', 'Videos que detienen el scroll', [[150, '1 video corto'], [450, '4 videos · subtítulos'], [1200, 'Paquete mensual · guion']]),
    s('Cámara profesional', 'cm', 'Foto y video con calidad real', [[600, 'Sesión corta'], [1200, 'Medio día · foto y video'], [2500, 'Producción completa']]),
    s('Animación de logo y gráficos', 'sk', 'Tu marca en movimiento', [[200, 'Logo animado de 5 s'], [450, 'Intro y cierre para tus videos'], [900, 'Paquete de gráficos']]),
    s('Impresiones y lonas', 'lo', 'Que tu local se vea desde la calle', [[250, '1 pieza · tarjetas o flyers'], [800, 'Lona con diseño desde cero'], [2000, 'Paquete para todo el local']], 'desde')
  ]}
];

/* Íconos (trazos SVG en cuadrícula de 16×16) */
const ICONOS = {
  gl: '<circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2.2 2 2.2 10 0 12M8 2c-2.2 2-2.2 10 0 12"/>',
  sp: '<path d="M2.5 5.5h11l-1 8h-9zM5.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5"/>',
  gr: '<rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/>',
  qr: '<rect x="2" y="2" width="4.5" height="4.5"/><rect x="9.5" y="2" width="4.5" height="4.5"/><rect x="2" y="9.5" width="4.5" height="4.5"/><path d="M9.5 9.5h2v2M14 9.5v1M9.5 14h2M13 13h1v1"/>',
  ph: '<rect x="4" y="1.5" width="8" height="13" rx="1.6"/><path d="M7 12.5h2"/>',
  pn: '<rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6h12M6 6v7.5"/>',
  pv: '<rect x="3" y="1.5" width="10" height="13" rx="1.2"/><path d="M5.5 4.5h5M5.5 8h1M8 8h1M5.5 11h1M8 11h1"/>',
  cl: '<rect x="2" y="3" width="12" height="11" rx="1.2"/><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3"/>',
  mg: '<path d="M2 6.5v3h3l6 3.5V3L5 6.5zM12.8 6.3c1 .8 1 2.6 0 3.4"/>',
  sh: '<circle cx="4" cy="8" r="1.8"/><circle cx="12" cy="3.8" r="1.8"/><circle cx="12" cy="12.2" r="1.8"/><path d="M5.6 7.1l4.8-2.4M5.6 8.9l4.8 2.4"/>',
  pe: '<path d="M3 13l1-3.5L11.5 2l2.5 2.5-7.5 7.5zM10 3.5L12.5 6"/>',
  tj: '<rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/><circle cx="5.5" cy="7.3" r="1.4"/><path d="M8.5 7h4M8.5 9.5h3"/>',
  vd: '<rect x="1.5" y="3.5" width="9" height="9" rx="1.5"/><path d="M10.5 7l4-2.2v6.4l-4-2.2z"/>',
  cm: '<path d="M2 5h2.5l1-1.8h5L11.5 5H14v8H2z"/><circle cx="8" cy="8.8" r="2.4"/>',
  sk: '<path d="M8 1.5l1.6 4.2 4.2 1.6-4.2 1.6L8 13.5l-1.6-4.6L2.2 7.3l4.2-1.6z"/>',
  lo: '<path d="M3 2v12M13 2v12M3 3.5h10v7H3z"/>'
};

/* ---------- utilidades ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const wa = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
const fmt = (n, extra) =>
  (extra === 'desde' ? '<small>desde </small>' : '') + '$' + n.toLocaleString('es-MX') + (extra === 'mes' ? '<small>/mes</small>' : '');
function toast(txt) {
  const t = $('#toast'); t.textContent = txt; t.classList.add('show');
  clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- catálogo ---------- */
function tarjeta(sv, ci, si) {
  const tiers = sv.niv.map(([precio, incluye], i) => {
    const n = NIVELES[i];
    return `<button type="button" class="tier t-${n.id}" data-c="${ci}" data-s="${si}" data-n="${i}" aria-haspopup="dialog" aria-label="${sv.nombre}, nivel ${n.nombre}: ver detalle y cotizar">
      <span class="tl">${n.nombre}</span><strong>${fmt(precio, sv.extra)}</strong><span class="td">${incluye}</span><span class="go">Lo quiero →</span></button>`;
  }).join('');
  return `<article class="svc"><div class="sh"><div class="ico"><svg viewBox="0 0 16 16">${ICONOS[sv.icono]}</svg></div>
    <div><h3>${sv.nombre}</h3><p>${sv.frase}</p></div></div><div class="tiers">${tiers}</div></article>`;
}
function categoria(c) {
  const ci = CATEGORIAS.indexOf(c);
  return `<section class="cat" id="${c.id}"><div class="cat-head"><h2>${c.titulo}</h2><p>${c.desc}</p></div>${c.servicios.map((sv, si) => tarjeta(sv, ci, si)).join('')}</section>`;
}
/* ---------- ventana de confirmación (evita abrir WhatsApp por error) ---------- */
const dlg = $('#confirm');
let ultimoBoton = null;
function abrirConfirmacion(btn) {
  const sv = CATEGORIAS[+btn.dataset.c].servicios[+btn.dataset.s], i = +btn.dataset.n;
  const [precio, incluye] = sv.niv[i], n = NIVELES[i];
  const txt = (sv.extra === 'desde' ? 'desde ' : '') + '$' + precio.toLocaleString('es-MX') + (sv.extra === 'mes' ? '/mes' : '');
  const url = wa(`Hola Krom Digital, me interesa el servicio de ${sv.nombre} en nivel ${n.nombre} (${txt}).`);
  if (typeof dlg.showModal !== 'function') { window.open(url, '_blank', 'noopener'); return; }
  $('#c-level').textContent = 'Nivel ' + n.nombre;
  $('#c-title').textContent = sv.nombre;
  $('#c-price').innerHTML = fmt(precio, sv.extra);
  $('#c-inc').textContent = incluye;
  $('#c-go').href = url;
  ultimoBoton = btn;
  dlg.showModal();
}
$('#catalog').addEventListener('click', e => { const b = e.target.closest('.tier'); if (b) abrirConfirmacion(b); });
$('#c-cancel').addEventListener('click', () => dlg.close());
$('#c-go').addEventListener('click', () => setTimeout(() => dlg.close(), 200));
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });   // clic en el fondo = cerrar
dlg.addEventListener('close', () => { if (ultimoBoton) ultimoBoton.focus({ preventScroll: true }); });

let activa = 'todos';
function mostrar(id, actualizarHash = true) {
  activa = id;
  const lista = id === 'todos' ? CATEGORIAS : CATEGORIAS.filter(c => c.id === id);
  $('#catalog').innerHTML = lista.map(categoria).join('');
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.id === id));
  if (actualizarHash) history.replaceState(null, '', id === 'todos' ? location.pathname + location.search : '#' + id);
  observar();
}
function observar() {
  const cards = document.querySelectorAll('.svc');
  if (!('IntersectionObserver' in window)) { cards.forEach(c => c.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  cards.forEach(c => io.observe(c));
}
function pestañas() {
  const tabs = [{ id: 'todos', nombre: 'Todos' }, ...CATEGORIAS];
  $('#tabs').innerHTML = tabs.map(t => `<button class="tab" role="tab" data-id="${t.id}" aria-selected="false">${t.nombre}</button>`).join('');
  $('#tabs').addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b) return;
    mostrar(b.dataset.id);
    $('.tabs-bar').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
const desdeHash = () => { const h = location.hash.slice(1); return CATEGORIAS.some(c => c.id === h) ? h : 'todos'; };

/* ---------- tema, compartir y contacto ---------- */
$('#theme').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('krom-theme', next); } catch (e) {}
  document.querySelector('meta[name="theme-color"]').content = next === 'dark' ? '#141518' : '#f4f1ea';
});
$('#share').addEventListener('click', async () => {
  const data = { title: 'Servicios y precios · Krom Digital', text: 'Mira los servicios y precios de Krom Digital', url: location.href };
  try {
    if (navigator.share) { await navigator.share(data); return; }
    await navigator.clipboard.writeText(location.href); toast('Enlace copiado');
  } catch (e) { if (e.name !== 'AbortError') toast('Copia el enlace desde la barra del navegador'); }
});
document.querySelectorAll('[data-wa]').forEach(a => a.href = wa(a.dataset.wa));
$('#contact').innerHTML =
  `WhatsApp: <a href="${wa('Hola Krom Digital')}" target="_blank" rel="noopener">${CONFIG.telefono}</a><br>` +
  `Instagram: <a href="${CONFIG.instagramUrl}" target="_blank" rel="noopener">${CONFIG.instagram}</a><br>` +
  `Web: <a href="https://${CONFIG.web}">${CONFIG.web}</a>`;

/* ---------- inicio ---------- */
pestañas();
mostrar(desdeHash(), false);
addEventListener('hashchange', () => { const id = desdeHash(); if (id !== activa) mostrar(id, false); });