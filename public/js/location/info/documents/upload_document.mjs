import delete_document from './delete_document.mjs';

export default (_xyz, record, entry, doc, public_id, blob) => {

  let xhr = new XMLHttpRequest();

  let type = blob.split(',')[0] + ',';

  xhr.open('POST', _xyz.host + '/api/location/edit/documents/upload?' + _xyz.utils.paramString({
    dbs: record.location.dbs,
    table: record.location.table,
    field: entry.field,
    qID: record.location.qID,
    id: record.location.id,
    type: type,
    public_id: encodeURIComponent(public_id),
    token: _xyz.token
  }));

  xhr.setRequestHeader('Content-Type', 'application/octet-stream');

  xhr.onload = e => {
    if (e.target.status !== 200) return console.log('document_upload failed');

    const json = JSON.parse(e.target.responseText);

    doc.style.opacity = 1;
    doc.childNodes[0].id = json.doc_id;
    //doc.childNodes[0].textContent = decodeURIComponent(json.doc_id.split('/').pop());
    doc.childNodes[0].textContent = json.doc_id;
    doc.childNodes[0].href = json.doc_url;

    // add delete control
    _xyz.utils.createElement({
      tag: 'span',
      options: {
        title: 'Delete document',
        className: 'btn_del',
        innerHTML: '<i class="material-icons">clear</i>'
      },
      appendTo: doc,
      eventListener: {
        event: 'click',
        funct: e => {
          e.target.remove();
          delete_document(_xyz, record, entry, doc);
        }
      }
    });

  };

  xhr.send(blob);

};