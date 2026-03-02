let map;
let marcadores = [];

window.initMap = function () {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 21, lng: -94 }
    });

    cargarCampos();
    cargarPozos();
    cargarPuertos();
};


// ================= CAMPOS =================
async function cargarCampos() {

    const res = await fetch("campos.json");
    const campos = await res.json();

    crearMarcadores(campos, "Campo");
}


// ================= POZOS =================
async function cargarPozos() {

    const res = await fetch("pozos.json");
    const pozos = await res.json();

    crearMarcadores(pozos, "Pozo");
}


// ================= CREAR MARCADORES =================
function crearMarcadores(datos, tipo) {

    datos.forEach(item => {

        const marker = new google.maps.Marker({
            position: { lat: item.lat, lng: item.lng },
            map: map,
            title: item.nombre,
            icon: iconoOperador(item.operador)
        });

        marcadores.push(marker);

        const info = new google.maps.InfoWindow({
            content: `
                <h3>${item.nombre}</h3>
                <b>Tipo:</b> ${tipo}<br>
                <b>Operador:</b> ${item.operador}
            `
        });

        marker.addListener("click", () =>
            info.open(map, marker)
        );
    });
}


// ================= PUERTOS =================
function cargarPuertos() {

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
                <b>Operadores:</b> ${puerto.operadores}
            `
        });

        marker.addListener("click", () =>
            info.open(map, marker)
        );
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
