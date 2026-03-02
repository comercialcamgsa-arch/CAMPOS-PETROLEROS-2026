// =============================
// VARIABLES GLOBALES
// =============================
let map;
let marcadores = [];
let clusterCampos;

// =============================
// INICIALIZAR MAPA
// =============================
window.initMap = function () {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 21, lng: -94 },
        mapTypeId: "roadmap"
    });

    cargarCampos();
    cargarPuertos();
};

// =============================
// CARGAR CAMPOS / POZOS
// =============================
async function cargarCampos() {

    const respuesta = await fetch("campos.json");
    const campos = await respuesta.json();

    const markersCampos = [];

    campos.forEach(campo => {

        const marker = new google.maps.Marker({
            position: { lat: campo.lat, lng: campo.lng },
            title: campo.nombre,
            icon: iconoOperador(campo.operador)
        });

        marker.operador = campo.operador;
        marker.tipo = "campo";

        const info = new google.maps.InfoWindow({
            content: `
                <h3>${campo.nombre}</h3>
                <b>Operador:</b> ${campo.operador}
            `
        });

        marker.addListener("click", () => {
            info.open(map, marker);
        });

        marcadores.push(marker);
        markersCampos.push(marker);
    });

    // ===== CLUSTER AUTOMÁTICO =====
    clusterCampos = new markerClusterer.MarkerClusterer({
        map,
        markers: markersCampos
    });
}

// =============================
// CARGAR PUERTOS
// =============================
function cargarPuertos() {

    puertos.forEach(puerto => {

        const marker = new google.maps.Marker({
            position: { lat: puerto.lat, lng: puerto.lng },
            map: map,
            title: puerto.nombre,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });

        marker.tipo = "puerto";

        const info = new google.maps.InfoWindow({
            content: `
                <h3>${puerto.nombre}</h3>
                <b>Operadores:</b> ${puerto.operadores}
            `
        });

        marker.addListener("click", () => {
            info.open(map, marker);
        });

        marcadores.push(marker);
    });
}

// =============================
// FILTRO POR OPERADOR
// =============================
function filtrarOperadores() {

    const activos = Array.from(
        document.querySelectorAll("#panel input:checked")
    ).map(el => el.value);

    const visibles = [];

    marcadores.forEach(marker => {

        // PUERTOS SIEMPRE VISIBLES
        if (marker.tipo === "puerto") {
            marker.setMap(map);
            return;
        }

        const visible = activos.some(op =>
            marker.operador.includes(op)
        );

        marker.setMap(visible ? map : null);

        if (visible && marker.tipo === "campo") {
            visibles.push(marker);
        }
    });

    // reconstruir cluster
    if (clusterCampos) {
        clusterCampos.clearMarkers();
        clusterCampos.addMarkers(visibles);
    }
}

// =============================
// ICONOS POR OPERADOR
// =============================
function iconoOperador(op) {

    if (op.includes("Pemex"))
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";

    if (op.includes("ENI"))
        return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";

    if (op.includes("Fieldwood"))
        return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";

    if (op.includes("Woodside"))
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

    if (op.includes("Hokchi"))
        return "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";

    if (op.includes("Murphy"))
        return "http://maps.google.com/mapfiles/ms/icons/pink-dot.png";

    return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
}
