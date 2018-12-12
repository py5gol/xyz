import _xyz from '../../_xyz.mjs';

_xyz.getWorkspace = next => {

  // XHR to retrieve workspace from host backend.
  const xhr = new XMLHttpRequest();
  xhr.open('GET', _xyz.host + '/workspace/get?token=' + _xyz.token);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = 'json';
  xhr.onload = e => {

    if (e.target.status !== 200) return console.error('Failed to retrieve workspace from XYZ host!');

    // Assign workspace to _xyz.
    _xyz.ws = e.target.response;

    // Filter invalid locales
    _xyz.ws.locales = Object.keys(_xyz.ws.locales)
      .filter(key => key.indexOf('__') === -1)
      .reduce((obj, key) => {
        obj[key] = _xyz.ws.locales[key];
        return obj;
      }, {});

    next();

  };

  xhr.send();

};