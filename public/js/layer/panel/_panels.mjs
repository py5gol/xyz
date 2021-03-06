import panel_filters from './filters/_filters.mjs';

import panel_style from './style/_styles.mjs';

import panel_draw from './draw.mjs';

import panel_grid from './grid.mjs';

import panel_cluster from './cluster.mjs';

import panel_table from './table.mjs';

export default (_xyz, layer) => {

  // Create layer dashboard.
  layer.dashboard = _xyz.utils.createElement({
    tag: 'div',
    options: {
      className: 'dashboard'
    }
  });

  // Add meta info to dashboard.
  if (layer.meta) _xyz.utils.createElement({
    tag: 'p',
    options: {
      className: 'meta',
      innerHTML: layer.meta
    },
    appendTo: layer.dashboard
  });

  // Add draw panel to dashboard.
  if (layer.edit) panel_draw(_xyz, layer);

  // Add draw panel to dashboard.
  if (layer.tableview) panel_table(_xyz, layer);

  // Add cluster panel to dashboard.
  if (layer.format === 'cluster') panel_cluster(_xyz, layer);

  // Add grid panel to dashboard.
  if (layer.format === 'grid') panel_grid(_xyz, layer);

  // Add filters panel.
  if (layer.infoj && layer.infoj.some(entry => entry.filter)) panel_filters(_xyz, layer);


  // Add styles panel.
  panel_style(_xyz, layer);


  // Add dashboard if it contains panel.
  if (layer.dashboard.children.length > 0) {

    layer.header.classList.add('pane_shadow');
    layer.drawer.classList.add('expandable');

    // Expander control for layer drawer.
    layer.header.addEventListener('click', () => {
      _xyz.utils.toggleExpanderParent({
        expandable: layer.drawer,
        accordeon: true,
        scrolly: _xyz.desktop && _xyz.desktop.listviews,
      });
    });

    // Append dashboard to layer drawer.
    layer.drawer.appendChild(layer.dashboard);

    // Add icon which allows to expand / collapse dashboard.
    _xyz.utils.createElement({
      tag: 'i',
      options: {
        className: 'material-icons cursor noselect btn_header expander',
        title: 'Toggle layer dashboard'
      },
      appendTo: layer.header,
      eventListener: {
        event: 'click',
        funct: e => {
          e.stopPropagation();
          _xyz.utils.toggleExpanderParent({
            expandable: layer.drawer,
            scrolly: _xyz.desktop && _xyz.desktop.listviews,
          });
        }
      }
    });
  }
};