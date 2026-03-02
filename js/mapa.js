// ESTA FUNCION DEBE SER GLOBAL
window.initMap = function () {

  // Coordenadas (Villahermosa ejemplo)
  const ubicacion = {
    lat: 17.9892,
    lng: -92.9475
  };

  // Crear mapa
  const mapa = new google.maps.Map(
    document.getElementById("map"),
    {
      zoom: 14,
      center: ubicacion,
    }
  );

  // Marcador
  new google.maps.Marker({
    position: ubicacion,
    map: mapa,
    title: "Mi ubicación"
  });

};
