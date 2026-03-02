// =============================
// VARIABLES GLOBALES
// =============================
let map;
let marcadores = [];

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
// CARGAR CAMPOS PETROLEROS
// =============================
async function cargarCampos() {

    try {

        const respuesta = await fetch("campos.json");
        const campos = await respuesta.json();

        campos.forEach(campo => {

            const marker = new google.maps.Marker({
                position: {
                    lat: Number(campo.lat),
                    lng: Number(campo.lng)
                },
                map: map,
                title: campo.nombre,
                icon: iconoOperador(campo.operador)
            });

            // guardar operador para futuros filtros
            marker.operador = campo.operador;
            marcadores.push(marker);

            const info = new google.maps.InfoWindow({
                content: `
                    <h3>${campo.nombre}</h3>
                    <b>Operador:</b> ${campo.operador}
                `
            });

            marker.addListener("click", () => {
                info.open(map, marker);
            });
        });

    } catch (error) {
        console.error("Error cargando campos:", error);
    }
}

// =============================
// CARGAR PUERTOS
// =============================
async function cargarPuertos() {

    try {

        const respuesta = await fetch("puertos.json");
        const puertos = await respuesta.json();

        puertos.forEach(puerto => {

           marker.addListener("click", () => {
    info.open(map, marker);
));
                position: {
                    lat: Number(puerto.lat),
                    lng: Number(puerto.lng)
                },
                map: map,
                title: puerto.nombre,
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });

            const info = new google.maps.InfoWindow({
                content: `
                    <h3>${puerto.nombre}</h3>
                    <p><b>Operadores:</b> ${puerto.operadores}</p>
                `
            });

            marker.addListener("click", () => {
                info.open(map, marker);
            });
        });

    } catch (error) {
        console.error("Error cargando puertos:", error);
    }
}

// =============================
// ICONOS SEGÚN OPERADOR
// =============================
function iconoOperador(op) {

    if (!op) return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

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

    return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
}
