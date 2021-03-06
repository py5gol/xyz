import group from './group.mjs';

import streetview from './streetview.mjs';

import images from './images/_images.mjs';

import geometry from './geometry.mjs';

import log from './log.mjs';

import table from './table.mjs';

import edit from './edit/_edit.mjs';

export default (_xyz, record) => {

  // Add table element to record drawer.
  // info fields will be added to this table.
  record.table = _xyz.utils.createElement({
    tag: 'table',
    options: {
      className: 'infojTable'
    },
    style: {
      cellPadding: '0',
      cellSpacing: '0',
      borderBottom: '1px solid ' + record.color
    },
    appendTo: record.drawer
  });

  record.update = () => {

    if(record.location.geometries.additional) { 
      record.location.geometries.additional.map(geom => {
        _xyz.map.removeLayer(geom);
      });
    } else {
      record.location.geometries.additional = [];
    }

    record.table.innerHTML = '';

    // Adds layer to beginning of infoj array.
    record.location.infoj.unshift({
      'label': 'Layer',
      'value': _xyz.layers.list[record.location.layer].name,
      'type': 'text',
      'inline': true
    });

    // Adds layer group to beginning of infoj array.
    if (_xyz.layers.list[record.location.layer].group) record.location.infoj.unshift({
      'label': 'Group',
      'value': _xyz.layers.list[record.location.layer].group,
      'type': 'text',
      'inline': true
    });

    // Assign location object to hold info groups.
    record.location.infogroups = {};

    // Iterate through info fields to fill displayValue property
    // This must come before the adding-to-table loop so displayValues for all group members are already existent when groups are created!
    Object.values(record.location.infoj).forEach(entry => {

      // Determine the user-friendly string representation of the value
      entry.displayValue =
      entry.type === 'numeric' ? parseFloat(entry.value).toLocaleString('en-GB', { maximumFractionDigits: 2 }) :
        entry.type === 'integer' ? parseInt(entry.value).toLocaleString('en-GB', { maximumFractionDigits: 0 }) :
          entry.type === 'date' ? _xyz.utils.formatDate(entry.value) :
            entry.type === 'datetime' ? _xyz.utils.formatDateTime(entry.value) :
              entry.value;
    
      // Add pre- or postfix if specified
      if(entry.prefix)  entry.displayValue = entry.prefix + entry.displayValue;
      if(entry.postfix) entry.displayValue = entry.displayValue + entry.postfix;
    });
    
    // Iterate through info fields and add to info table.
    Object.values(record.location.infoj).forEach(entry => {

      // Create a new table row for the entry.
      if (!entry.group) entry.row = _xyz.utils.createElement({
        tag: 'tr',
        options: {
          className: 'lv-' + (entry.level || 0)
        },
        appendTo: record.table
      });

      // Create a new info group.
      if (entry.type === 'group') return group(_xyz, record, entry);

      // Create entry.row inside previously created group.
      if (entry.group && record.location.infogroups[entry.group]) entry.row = _xyz.utils.createElement({
        tag: 'tr',
        options: {
          className: 'lv-' + (entry.level || 0)
        },
        appendTo: record.location.infogroups[entry.group].table
      });

      // Create new table cell for the entry label and append to table.
      let _label;
      if (entry.label) {_label = _xyz.utils.createElement({
        tag: 'td',
        options: {
          className: 'label lv-' + (entry.level || 0),
          textContent: entry.label,
          title: entry.title || null
        },
        appendTo: entry.row
      });
      }

      // Finish entry creation if entry has not type.
      if(entry.type === 'label') return;

      // Create streetview control.
      if (entry.type === 'streetview') return streetview(_xyz, record, entry);

      // If input is images create image control and return from object.map function.
      if (entry.type === 'images') return images(_xyz, record, entry);

      // Create log control.
      if (entry.type === 'log') return log(_xyz, record, entry);

      // Create log control.
      if (entry.type === 'table') return table(_xyz, record, entry);

      // Create geometry control.
      if (entry.type === 'geometry') return geometry(_xyz, record, entry);    

      // Remove empty row which is not editable.
      if (!entry.edit && !entry.value) return entry.row.remove();

      // Create val table cell in a new line.
      if (!entry.inline && !(entry.type === 'integer' ^ entry.type === 'numeric' ^ entry.type === 'date')) {

        if(_label) _label.colSpan = '2';
        // Create new row and append to table.
        entry.row = _xyz.utils.createElement({
          tag: 'tr',
          appendTo: record.table
        });

        // Create val table cell with colSpan 2 in the new row to span full width.
        entry.val = _xyz.utils.createElement({
          tag: 'td',
          options: {
            className: 'val',
            colSpan: '2'
          },
          appendTo: entry.row
        });

        // Else create val table cell inline.
      } else {

      // Append val table cell to the same row as the label table cell.
        entry.val = _xyz.utils.createElement({
          tag: 'td',
          options: {
            className: 'val num'
          },
          appendTo: entry.row
        });

      }

      // Create controls for editable fields.
      if (entry.edit && !entry.fieldfx) return edit(_xyz, record, entry);

      if (entry.type === 'html') {
        // Directly set the HTML if raw HTML was specified
        return entry.val.innerHTML = entry.value;
      } else {
        // otherwise use the displayValue
        return entry.val.textContent = entry.displayValue;
      }

    });

    // Hide group if empty
    Object.values(record.location.infoj).map(entry => {
      if(!entry.group) return;
      if(!record.location.infogroups[entry.group].table.innerHTML) record.location.infogroups[entry.group].table.parentNode.style.display = 'none';
    });

  };

  record.update();
  
};