const fs = require('fs');
const NgwConnector = require('@nextgis/ngw-connector');
const config = require('../config.json');

const connector = new NgwConnector({ baseUrl: config.baseUrl });
const out = './src/cities.json';

async function getCities() {
  const features = await connector.get(
    'feature_layer.feature.collection',
    null,
    {
      id: config.ngwMarkerLayerId,
      fields: 'city'
    }
  );
  const cities = [];
  features.forEach((x) => {
    let city_ = x.fields.city;
    if (city_) {
      city_ = city_.split(';').map(y => y.trim());
      city_.forEach(y => {
        if (y && cities.indexOf(y) === -1) {
          cities.push(y);
        }
      });
    }
  })
  fs.writeFile(out, JSON.stringify(cities), () =>
    console.log('Data write in `' + out + '` file')
  );
}

getCities().catch(er => {
  console.log(er);
});
