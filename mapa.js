let map;
let marcadores = [];
let markersCampos = [];
let markersPuertos = [];
let clusterCampos;
let bounds;

// ===============================
// INICIALIZAR MAPA
// ===============================
window.initMap = function () {

    bounds = new google.maps.LatLngBounds();

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 21, lng: -94 },
        mapTypeId: "roadmap"
    });

    cargarCampos();
    cargarPuertos();
};

// ===============================
// CARGAR CAMPOS
// ===============================
async function cargarCampos() {

    const response = await fetch("campos.json");
    const data = await response.json();

    data.forEach(campo => {

        const marker = new google.maps.Marker({
            position: {
                lat: campo.lat,
                lng: campo.lng
            },
            title: campo.nombre,
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }
        });

        marker.operador = campo.operador;
        marker.setMap(map);

        marcadores.push(marker);
        markersCampos.push(marker);

        bounds.extend(marker.getPosition());
    });

    clusterCampos = new markerClusterer.MarkerClusterer({
        map,
        markers: markersCampos
    });
}

// ===============================
// CARGAR PUERTOS
// ===============================
async function cargarPuertos() {

    try {
        const response = await fetch("puertos.json");
        const data = await response.json();

        data.forEach(puerto => {

            const marker = new google.maps.Marker({
                position: {
                    lat: puerto.lat,
                    lng: puerto.lng
                },
                title: puerto.nombre,
                icon: {
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                },
                map: map
            });

            markersPuertos.push(marker);

            bounds.extend(marker.getPosition());
        });

        // 🔥 AUTO ZOOM GENERAL
        map.fitBounds(bounds);

    } catch (error) {
        console.warn("No se encontró puertos.json (no es obligatorio)");
    }
}

// ===============================
// FILTRO POR OPERADOR + AUTO ZOOM
// ===============================
function filtrarOperador() {

    const operadorSeleccionado =
        document.getElementById("operador").value;

    const boundsFiltro = new google.maps.LatLngBounds();
    let visibles = 0;

    markersCampos.forEach(marker => {

        if (
            operadorSeleccionado === "todos" ||
            marker.operador === operadorSeleccionado
        ) {
            marker.setVisible(true);
            boundsFiltro.extend(marker.getPosition());
            visibles++;
        } else {
            marker.setVisible(false);
        }
    });

    // 🔥 ZOOM AUTOMÁTICO SOLO SI HAY RESULTADOS
    if (visibles > 0) {
        map.fitBounds(boundsFiltro);
    }
}
