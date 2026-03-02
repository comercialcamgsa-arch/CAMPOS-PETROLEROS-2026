const contenedor = document.getElementById("listaPozos");
const filtro = document.getElementById("filtroOperador");

function mostrarPozos(lista) {
  contenedor.innerHTML = "";

  lista.forEach(pozo => {
    const div = document.createElement("div");

    div.className = "pozo";
    div.innerHTML = `
      <h3>${pozo.nombre}</h3>
      <p><b>Operador:</b> ${pozo.operador}</p>
      <p><b>Campo:</b> ${pozo.campo}</p>
      <p><b>Ubicación:</b> ${pozo.estado}</p>
    `;

    contenedor.appendChild(div);
  });
}
filtro.addEventListener("change", () => {
  const operador = filtro.value;

  if (operador === "todos") {
    mostrarPozos(pozos);
  } else {
    const filtrados = pozos.filter(
      p => p.operador === operador
    );
    mostrarPozos(filtrados);
  }
});

// Mostrar todos al iniciar
mostrarPozos(pozos);
