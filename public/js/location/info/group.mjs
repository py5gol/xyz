import _xyz from '../../_xyz.mjs';

import chart from './chart.mjs';

export default (record, group) => {

  record.location.infogroups[group.label] = group;

  group.td = _xyz.utils.createElement({
    tag: 'td',
    options: {
      colSpan: '2'
    },
    appendTo: group.row
  });

  group.div = _xyz.utils.createElement({
    tag: 'div',
    options: {
      classList: 'table-section expandable'
    },
    appendTo: group.td
  });

  group.header = _xyz.utils.createElement({
    tag: 'div',
    options: {
      className: 'btn_subtext cursor noselect'
    },
    style: {
      textAlign: 'left',
      fontStyle: 'italic'
    },
    appendTo: group.div,
    eventListener: {
      event: 'click',
      funct: e => {
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent({
          expandable: group.div,
          accordeon: true,
          scrolly: document.querySelector('.mod_container > .scrolly')
        });
      }
    }
  });

  // Add label to group header.
  _xyz.utils.createElement({
    tag: 'span',
    options: {
      textContent: group.label
    },
    appendTo: group.header
  });

  // Add expander to group header.
  _xyz.utils.createElement({
    tag: 'i',
    options: {
      className: 'material-icons cursor noselect btn_header t-expander',
      title: 'Show section'
    },
    appendTo: group.header,
    eventListener: {
      event: 'click',
      funct: e => {
        e.stopPropagation();
        _xyz.utils.toggleExpanderParent({
          expandable: group.div,
          scrolly: document.querySelector('.mod_container > .scrolly')
        });
      }
    }
  });

  // Add chart control to group header.
  if (group.chart) _xyz.utils.createElement({
    tag: 'i',
    options: {
      className: 'material-icons cursor noselect btn_header',
      title: 'Show graph',
      textContent: 'bar_chart'
    },
    appendTo: group.header,
    eventListener: {
      event: 'click',
      funct: e => {
        e.stopPropagation();
        group.fields = record.location.infoj.filter(entry => entry.group === group.label);
        chart(group);
      }
    }
  });

  group.table = _xyz.utils.createElement({
    tag: 'table',
    style: {
      cellPadding: '0',
      cellSpacing: '0',
      width: '95%'
    },
    appendTo: group.div
  });

};