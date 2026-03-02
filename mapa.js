let map;
let infoWindow;
let marcadores = [];
let cluster;
let bounds;

// =====================
// INICIAR MAPA
// =====================
window.initMap = function () {

    bounds = new google.maps.LatLngBounds();

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 21, lng: -94 },
        zoom: 6,
        mapTypeId: "hybrid"
    });

    infoWindow = new google.maps.InfoWindow();

    cargarCampos();
};

// =====================
// ICONOS POR OPERADOR
// =====================
function obtenerIcono(operador) {

    const colores = {
        "Pemex": "red",
        "ENI": "green",
        "Fieldwood": "purple",
        "Woodside": "orange",
        "Hokchi": "yellow"
    };

    const color = colores[operador] || "blue";

    return {
        url: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
    };
}

// =====================
// CARGAR CAMPOS
// =====================
async function cargarCampos() {

    const res = await fetch("campos.json");
    const campos = await res.json();

    const markersCluster = [];

    campos.forEach(campo => {

        const marker = new google.maps.Marker({
            position: { lat: campo.lat, lng: campo.lng },
            title: campo.nombre,
            icon: obtenerIcono(campo.operador),
            map: map
        });

        marker.operador = campo.operador;
        marker.nombre = campo.nombre;
        marker.aceite = campo.aceite_bpd || 0;
        marker.gas = campo.gas_mmpcd || 0;

        marker.addListener("click", () => {
            infoWindow.setContent(`
                <strong>${campo.nombre}</strong><br>
                Operador: ${campo.operador}<br>
                🛢 Aceite: ${marker.aceite.toLocaleString()} bpd<br>
                🔥 Gas: ${marker.gas.toLocaleString()} mmpcd
            `);
            infoWindow.open(map, marker);
        });

        marcadores.push(marker);
        markersCluster.push(marker);
        bounds.extend(marker.getPosition());
    });

    cluster = new markerClusterer.MarkerClusterer({
        map,
        markers: markersCluster
    });

    map.fitBounds(bounds);

    actualizarTodo();
}

// =====================
// OBTENER OPERADORES ACTIVOS
// =====================
function obtenerOperadoresActivos() {

    const checkboxes = document.querySelectorAll('#filtros input[type="checkbox"]');
    const activos = [];

    checkboxes.forEach(cb => {
        if (cb.checked) activos.push(cb.value);
    });

    return activos;
}

// =====================
// ACTUALIZAR PANEL + DASHBOARD
// =====================
function actualizarTodo() {

    const lista = document.getElementById("listaCampos");
    lista.innerHTML = "";

    const operadoresActivos = obtenerOperadoresActivos();

    let totalCampos = 0;
    let totalAceite = 0;
    let totalGas = 0;

    const nuevosMarkers = [];
    const nuevosBounds = new google.maps.LatLngBounds();

    marcadores.forEach(marker => {

        if (operadoresActivos.includes(marker.operador)) {

            marker.setVisible(true);
            nuevosMarkers.push(marker);
            nuevosBounds.extend(marker.getPosition());

            totalCampos++;
            totalAceite += marker.aceite;
            totalGas += marker.gas;

            const item = document.createElement("li");
            item.textContent = marker.nombre;

            item.addEventListener("click", () => {
                map.panTo(marker.getPosition());
                map.setZoom(9);

                infoWindow.setContent(`
                    <strong>${marker.nombre}</strong><br>
                    Operador: ${marker.operador}<br>
                    🛢 Aceite: ${marker.aceite.toLocaleString()} bpd<br>
                    🔥 Gas: ${marker.gas.toLocaleString()} mmpcd
                `);

                infoWindow.open(map, marker);
            });

            lista.appendChild(item);

        } else {
            marker.setVisible(false);
        }

    });

    cluster.clearMarkers();
    cluster.addMarkers(nuevosMarkers);

    if (nuevosMarkers.length > 0) {
        map.fitBounds(nuevosBounds);
    }

    // ACTUALIZAR DASHBOARD
    document.getElementById("totalCampos").textContent = totalCampos;
    document.getElementById("totalAceite").textContent = totalAceite.toLocaleString();
    document.getElementById("totalGas").textContent = totalGas.toLocaleString();
}

// =====================
// FILTROS
// =====================
document.addEventListener("change", function (e) {
    if (e.target.closest("#filtros")) {
        actualizarTodo();
    }
});

// =====================
// BUSCADOR
// =====================
document.addEventListener("input", e => {

    if (e.target.id !== "buscador") return;

    const texto = e.target.value.toLowerCase();

    document.querySelectorAll("#listaCampos li")
        .forEach(li => {
            li.style.display =
                li.textContent.toLowerCase().includes(texto)
                    ? "block" : "none";
        });
});

// =====================
// PANEL COLAPSABLE
// =====================
document.addEventListener("click", e => {

    if (e.target.id !== "togglePanel") return;

    document.getElementById("panel")
        .classList.toggle("panel-cerrado");
});
