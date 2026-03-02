
let map;

function initMap() {

    // Centro del Golfo de México
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 21.0, lng: -94.0 }
    });

    // ===== CAMPOS PETROLEROS =====
    campos.forEach(campo => {

        const marker = new google.maps.Marker({
            position: { lat: campo.lat, lng: campo.lng },
            map: map,
            title: campo.nombre,
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        });

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


    // ===== PUERTOS =====
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

        marker.addListener("click", () => {
            info.open(map, marker);
        });
    });
}
