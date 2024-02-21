
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

d3.json(url).then(function (data) {
    createFeatures(data.features);
});

// create function for the popups
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
      let time = new Date(feature.properties.time);
      let formattedTime = (`${time.toLocaleDateString()}: ${time.toLocaleTimeString()}`)
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
      <p> Earthquake Magntitude: ${(feature.properties.mag)}</p>
      <p>Depth: ${feature.geometry.coordinates[2]} meters</p>
      <p>Date & Time:${formattedTime}</p>`);
    }

    function getRadius(magnitude) {
        let baseRadius = 1.30;
        return baseRadius *Math.pow(1.75, magnitude);
        // return magnitude * scaleFactor;
        // let scaleFactor = 3.5;
        // return magnitude * scaleFactor;
    }
    let earthquakes = L.geoJSON(earthquakeData, {
            pointToLayer: function(feature, coordinates) {
              let fillColor;
              // let mag = feature.properties.mag;
              // if(mag >= 5) {
              //   fillColor = '#f95738';
              // } else if (mag >= 4.0 && mag < 5.0) {
              //   fillColor = '#ee964b';
              // } else if (mag >= 3.0 && mag < 4.0) {
              //   fillColor = '#f4d35e';  
              // } else if (mag >= 2.0 && mag < 3.0) {
              //   fillColor = '#faf0ca';
              // } else {
              //   fillColor = '#0d3b66';
              // }

              let depth = feature.geometry.coordinates[2];
              if(depth >= 90) {
                fillColor = '#f95738';
              } else if (depth >= 70.0 && depth < 90.0) {
                fillColor = '#ee964b';
              } else if (depth >= 50.0 && depth < 70.0) {
                fillColor = '#f4d35e';  
              } else if (depth >= 30.0 && depth < 50.0) {
                fillColor = '#faf0ca';
              } else if (depth >= 10.0 && depth < 30.0) {
                fillColor = '#0d3b66';
              } else if (depth >= -10.0 && depth < 10.0) {
                fillColor = '#d9d9d9';  
              }  else {
                fillColor = '#ffffff';
              }
              
              return L.circleMarker(coordinates, {
                radius: getRadius(feature.properties.mag),
                fillColor: fillColor,
                color: '#000',
                weight: 1,
                opacity: 0.75,
                fillOpacity: 0.75
            });
        },
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}

const legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [-10, 10, 30, 50, 70, 90];
    let depthColors = [
      '#f95738',
      '#ee964b',
      '#f4d35e',
      '#faf0ca',
      '#0d3b66',
      '#0d3b66'
    ];

    for (let i = 0; i < depths.length; i++) {
      console.log(depthColors[i]);
      div.innerHTML +=
          '<i style="background:' + depthColors[i] + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
          }
          return div;
};

// function getColor(depth) {
//     if (depth >= 90) {
//         return '#f95738';
//     } else if (depth >= 70) {
//         return '#ee964b';
//     } else if (depth >= 50) {
//         return '#f4d35e';
//     } else if (depth >= 30) {
//         return '#faf0ca';
//     } else if (depth >= 10) {
//         return '#0d3b66';
//     } else {
//       return '#0d3b66';
//     // } else {
//     //     return '#ffffff';
//     }
// };


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

  legend.addTo(myMap);
}

