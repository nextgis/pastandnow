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
      fields: 'city',
    }
  );
  const cities = [];
  features.forEach((x) => {
    const city = x.fields.city;
    if (city && cities.indexOf(city) === -1) {
      cities.push(city);
    }
  });
  fs.writeFile(out, JSON.stringify(cities), () =>
    console.log('Data write in `' + out + '` file')
  );
}

getCities().catch((er) => {
  console.log(er);
});
