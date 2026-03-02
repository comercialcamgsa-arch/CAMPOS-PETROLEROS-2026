function initMap() {

  const ubicacion = { lat: 17.9892, lng: -92.9475 };

  const mapa = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: ubicacion,
  });

  new google.maps.Marker({
    position: ubicacion,
    map: mapa,
  });
}
