let map;
let infoWindow;
let operadorActivo = "";

window.initMap = function(){

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 21, lng: -94 },
        zoom: 6,
        mapTypeId: "roadmap"
    });

    infoWindow = new google.maps.InfoWindow();

    cargarDatos();
};

function colorOperador(operador){

    const colores={
        "Pemex":"#d32f2f",
        "ENI":"#2e7d32",
        "Fieldwood":"#6a1b9a",
        "Woodside":"#ef6c00",
        "Hokchi":"#f9a825"
    };

    return colores[operador] || "#1565c0";
}

async function cargarDatos(){

    const res = await fetch("campos.geojson");
    const geojson = await res.json();

    map.data.addGeoJson(geojson);

    map.data.setStyle(estiloPoligono);

    map.data.addListener("mouseover", mostrarInfo);
    map.data.addListener("mouseout", () => infoWindow.close());

    actualizarVista();
}

function estiloPoligono(feature){

    const operador = feature.getProperty("operador");

    if(operadorActivo && operador !== operadorActivo){
        return { visible:false };
    }

    return {
        fillColor: colorOperador(operador),
        strokeColor: "#333",
        strokeWeight: 1,
        fillOpacity: 0.6
    };
}

function mostrarInfo(event){

    const nombre = event.feature.getProperty("nombre");
    const operador = event.feature.getProperty("operador");
    const aceite = event.feature.getProperty("aceite_bpd");
    const gas = event.feature.getProperty("gas_mmpcd");

    infoWindow.setContent(`
        <strong>${nombre}</strong><br>
        Operador: ${operador}<br>
        Aceite: ${aceite.toLocaleString()} bpd<br>
        Gas: ${gas.toLocaleString()} mmpcd
    `);

    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
}

function actualizarVista(){

    let totalCampos = 0;
    let totalAceite = 0;
    let totalGas = 0;

    const lista = document.getElementById("listaCampos");
    lista.innerHTML = "";

    map.data.forEach(feature => {

        const operador = feature.getProperty("operador");

        if(!operadorActivo || operador === operadorActivo){

            totalCampos++;
            totalAceite += feature.getProperty("aceite_bpd");
            totalGas += feature.getProperty("gas_mmpcd");

            const li = document.createElement("li");
            li.textContent = feature.getProperty("nombre");
            lista.appendChild(li);
        }
    });

    document.getElementById("kpiCampos").textContent = totalCampos;
    document.getElementById("kpiAceite").textContent = totalAceite.toLocaleString();
    document.getElementById("kpiGas").textContent = totalGas.toLocaleString();

    map.data.setStyle(estiloPoligono);
}

document.getElementById("operadorSelect")
.addEventListener("change", function(){

    operadorActivo = this.value;
    actualizarVista();
});
