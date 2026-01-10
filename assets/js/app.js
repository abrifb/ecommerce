// =======================
// FORMATO CLP
// =======================
const formatoCLP = new Intl.NumberFormat('es-CL');

// =======================
// CATÁLOGO
// =======================
const catalogo = [
  { id: 1, nombre: "Chaqueta Bomber Azul", precio: 39990, imagen: "./assets/img/productos/chaqueta1-listadoproductos.jpg", descuentoAplicado: false},
  { id: 2, nombre: "Chaqueta Cuero Cuello Alto", precio: 59990, imagen: "./assets/img/productos/chaqueta2-listadoproductos.jpg", descuentoAplicado: false },
  { id: 3, nombre: "Pantalón Corte Ancho Gris", precio: 49990, imagen: "./assets/img/productos/pantalon-listadoproductos.jpg", descuentoAplicado: false },
  { id: 4, nombre: "Polera Estampado Moto", precio: 19990, imagen: "./assets/img/productos/polera-listadoproductos.jpg", descuentoAplicado: false },
  { id: 5, nombre: "Sudadera Lineas Blanca", precio: 35990, imagen: "./assets/img/productos/sudadera-listadoproductos.jpg", descuentoAplicado: false },
  { id: 6, nombre: "Zapatillas Gamuza Beige", precio: 39990, imagen: "./assets/img/productos/zapatilla1-listadoproductos.jpg", descuentoAplicado: false },
  { id: 7, nombre: "Zapatillas Cuero Negras", precio: 59990, imagen: "./assets/img/productos/zapatilla2-listadoproductos.jpg", descuentoAplicado: false },
  { id: 8, nombre: "Bolso Cuero Negro", precio: 69990, imagen: "./assets/img/productos/bolso-listadoproductos.jpg", descuentoAplicado: false },

];

// =======================
// CARRITO
// =======================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =======================
// AUTENTICACIÓN
// =======================
// =======================
// AUTH
// =======================
const PASSWORD_MAESTRA = "1234";
let usuarioLogueado = false;

function mostrarModal(tipo) {
  const modal = new bootstrap.Modal(
    document.getElementById("modalAuth")
  );
  modal.show();
}

function handleLogin() {
  const usuario = document.getElementById("inputUsuario").value;
  const password = document.getElementById("inputPassword").value;
  iniciarSesion(usuario, password);
}

function iniciarSesion(usuario, password) {
  const mensaje = document.getElementById("mensajeAuth");

  if (password === PASSWORD_MAESTRA) {
    usuarioLogueado = true;
    localStorage.setItem("usuarioLogueado", "true");

    console.log("Usuario logueado:", usuario);

    mensaje.classList.remove("text-danger");
    mensaje.classList.add("text-success");
    mensaje.textContent = "Inicio de sesión exitoso";

     actualizarAuthUI();

    setTimeout(() => {
      bootstrap.Modal.getInstance(
        document.getElementById("modalAuth")
      ).hide();
    }, 800);
  } else {
    mensaje.textContent = "Contraseña incorrecta";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  usuarioLogueado = localStorage.getItem("usuarioLogueado") === "true";
  actualizarAuthUI(); 
});

function cerrarSesion() {
  usuarioLogueado = false;
  localStorage.removeItem("usuarioLogueado");

  console.log("Sesión cerrada");

  actualizarAuthUI();
}
function actualizarAuthUI() {
  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  if (usuarioLogueado) {
    authArea.innerHTML = `
      <button 
        class="btn btn-outline-danger me-2"
        onclick="cerrarSesion()"
        aria-label="Cerrar sesión"
        title="Cerrar sesión">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    `;
  } else {
    authArea.innerHTML = `
      <button 
        class="btn btn-outline-dark me-2"
        onclick="mostrarModal('login')"
        aria-label="Iniciar sesión"
        title="Iniciar sesión">
        <i class="bi bi-person-circle"></i>
      </button>
    `;
  }
}



// =======================
// FUNCIONES CARRITO
// =======================
function agregarProducto(idProducto) {
  const prod = catalogo.find(p => p.id === idProducto);

  if (prod) {
    carrito.push({ ...prod });
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(`${prod.nombre} agregado al carrito`);
    
    renderizarCarrito();
  }
}


function quitarProducto(idProducto) {
  const index = carrito.findIndex(p => p.id === idProducto);
  if (index !== -1) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
  }
}

function aplicarDescuento(codigo) {
  if (codigo === "DESC15") {
    carrito.forEach(p => p.descuentoAplicado = true);
    return 0.85;
  }

  carrito.forEach(p => p.descuentoAplicado = false);
  return 1;
}

function calcularTotal() {
  const codigo = document.getElementById("codigoDescuento")?.value;
  const factor = aplicarDescuento(codigo);
  const subtotal = carrito.reduce((acc, p) => acc + p.precio, 0);
  return Math.round(subtotal * factor);
}

function renderizarCarrito() {
  const tbody = document.getElementById("tbodyCarrito");
  if (!tbody) return;

  tbody.innerHTML = "";

  carrito.forEach(prod => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${formatoCLP.format(prod.precio)}</td>
      <td>
        <button class="btn btn-danger btn-sm"
                onclick="quitarProducto(${prod.id})">
          Quitar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("total").textContent =
    formatoCLP.format(calcularTotal());
}

// =======================
// RENDER PRODUCTOS
// =======================
function renderizarProductos() {
  const contenedor = document.getElementById("listadoProductos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  catalogo.forEach(prod => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-3 p-2";

    col.innerHTML = `
      <div class="card h-100">
        <a href="producto.html?id=${prod.id}" class="text-decoration-none text-dark">
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body text-center">
            <p class="small text-uppercase">${prod.nombre}</p>
            <p class="fw-bold">${formatoCLP.format(prod.precio)}</p>
          </div>
        </a>
        <div class="card-footer bg-white border-0 text-center">
          <button class="btn btn-outline-dark btn-sm"
                  onclick="agregarProducto(${prod.id})">
            Agregar
          </button>
        </div>
      </div>
    `;

    contenedor.appendChild(col);
  });
}


function aplicarCodigo() {
  renderizarCarrito();
}

function cargarProductoDetalle() {
  const params = new URLSearchParams(window.location.search);
  const idProducto = Number(params.get("id"));

  if (!idProducto) return;

  const producto = catalogo.find(p => p.id === idProducto);
  if (!producto) return;

  document.getElementById("imgProducto").src = producto.imagen;
  document.getElementById("imgProducto").alt = producto.nombre;
  document.getElementById("nombreProducto").textContent = producto.nombre;
  document.getElementById("precioProducto").textContent =
    formatoCLP.format(producto.precio);

  document
    .getElementById("btnAgregarProducto")
    .addEventListener("click", () => agregarProducto(producto.id));
}


// =======================
document.addEventListener("DOMContentLoaded", () => {
  renderizarProductos();
  renderizarCarrito();
  cargarProductoDetalle();
});
