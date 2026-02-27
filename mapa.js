map.data.loadGeoJson('geojson/mapa_pozos_puertos.geojson', null, function(features) {
    allFeatures = features;
    updateMap();
});
