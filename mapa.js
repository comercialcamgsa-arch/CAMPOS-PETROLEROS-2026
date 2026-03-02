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
        center:{lat:21,lng:-94},
        zoom:6,
        mapTypeId:"hybrid"
    });

    infoWindow = new google.maps.InfoWindow();

    cargarCampos();
};

// =====================
// ICONOS POR OPERADOR
// =====================
function obtenerIcono(operador){

    const colores={
        "Pemex":"red",
        "ENI":"green",
        "Fieldwood":"purple",
        "Woodside":"orange",
        "Hokchi":"yellow"
    };

    const color=colores[operador] || "blue";

    return {
        url:`https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
    };
}

// =====================
// CARGAR CAMPOS
// =====================
async function cargarCampos(){

    const res=await fetch("campos.json");
    const campos=await res.json();

    const markersCluster=[];

    campos.forEach(campo=>{

        const marker=new google.maps.Marker({
            position:{lat:campo.lat,lng:campo.lng},
            title:campo.nombre,
            icon:obtenerIcono(campo.operador),
            map:map
        });

        marker.operador=campo.operador;

        marker.addListener("click",()=>{
            infoWindow.setContent(`
                <strong>${campo.nombre}</strong><br>
                Operador: ${campo.operador}
            `);
            infoWindow.open(map,marker);
        });

        marcadores.push(marker);
        markersCluster.push(marker);

        bounds.extend(marker.getPosition());

        agregarAlPanel(campo,marker);
    });

    cluster=new markerClusterer.MarkerClusterer({
        map,
        markers:markersCluster
    });

    map.fitBounds(bounds);
}

// =====================
// PANEL LATERAL
// =====================
function agregarAlPanel(campo,marker){

    const lista=document.getElementById("listaCampos");

    const item=document.createElement("li");
    item.textContent=campo.nombre;

    item.addEventListener("click",()=>{

        map.panTo(marker.getPosition());
        map.setZoom(9);

        infoWindow.setContent(`
            <strong>${campo.nombre}</strong><br>
            Operador: ${campo.operador}
        `);

        infoWindow.open(map,marker);
    });

    lista.appendChild(item);
}

// =====================
// BUSCADOR
// =====================
document.addEventListener("input",e=>{

    if(e.target.id!=="buscador") return;

    const texto=e.target.value.toLowerCase();

    document.querySelectorAll("#listaCampos li")
    .forEach(li=>{
        li.style.display=
            li.textContent.toLowerCase().includes(texto)
            ?"block":"none";
    });
});

// =====================
// PANEL COLAPSABLE
// =====================
document.addEventListener("click",e=>{

    if(e.target.id!=="togglePanel") return;

    document.getElementById("panel")
    .classList.toggle("panel-cerrado");
});
