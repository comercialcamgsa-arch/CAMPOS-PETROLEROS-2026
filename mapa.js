let map;
let marcadores = [];

window.initMap = function () {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 21, lng: -94 }
    });

    cargarCampos();
    cargarPuertos();
};

// ================= CAMPOS =================
async function cargarCampos() {

    const respuesta = await fetch("campos.json");
    const campos = await respuesta.json();

    campos.forEach(campo => {

        const marker = new google.maps.Marker({
            position: { lat: campo.lat, lng: campo.lng },
            map: map,
            title: campo.nombre,
            icon: iconoOperador(campo.operador)
        });

        marker.operador = campo.operador;
        marcadores.push(marker);

        const info = new google.maps.InfoWindow({
            content: `
                <h3>${campo.nombre}</h3>
                <b>Operador:</b> ${campo.operador}
            `
        });

        marker.addListener("click", () => info.open(map, marker));
    });
}

// ================= ICONOS =================
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

    return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
}

// ================= PUERTOS =================
function cargarPuertos() {

    if (typeof puertos === "undefined") {
        console.warn("puertos.js no cargó");
        return;
    }

    puertos.forEach(puerto => {

        const marker = new google.maps.Marker({
            position: { lat: puerto.lat, lng: puerto.lng },
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
}
