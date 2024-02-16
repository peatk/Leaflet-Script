
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

d3.json(url).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        // layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p> Earthquake Magntitude: ${(feature.properties.mag)}</p>`);
    }

    function getRadius(magnitude) {
        let scaleFactor = 3;
        return magnitude * scaleFactor;
    }
    let earthquakes = L.geoJSON(earthquakeData, {
            pointToLayer: function(feature, coordinates) {
            return L.circleMarker(coordinates, {
                radius: getRadius(feature.properties.mag),
                fillColor: 'red',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}


// Create the base layers.
const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});



function createMap(earthquakes) {
  myMap = L.map('map', {
    center: [
        37, -95
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });
  
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
    };
  
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

