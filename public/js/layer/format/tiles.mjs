import _xyz from '../../_xyz.mjs';

import L from 'leaflet';

export default function(){

  const layer = this;
  layer.loaded = false;

  // Set locale to check whether locale is still current when data is returned from backend.
  const locale = _xyz.locale;

  if (layer.display) {

    // Augment request with token if proxied through backend.
    // Otherwise requests will be sent directly to the URI and may not pass through the XYZ backend.  
    let uri = layer.URI.indexOf('provider') > 0 ?
      _xyz.host + '/proxy/image?uri=' + layer.URI + '&token=' + _xyz.token :
      layer.URI;
 
    // Assign the tile layer to the layer L object and add to map.
    layer.L = L.tileLayer(uri, {
      updateWhenIdle: true,
      pane: layer.key
    }).addTo(_xyz.map).on('load', () => { _xyz.layers.check(layer); });
    //   if (locale === _xyz.locale) _xyz.layers.check(layer);
    // });
  }

}