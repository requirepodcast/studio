import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-drawer';
import '@material/mwc-list/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-icon';

document.querySelector('#navigationButton').onclick = () => {
  document.querySelector('mwc-drawer').open = !document.querySelector('mwc-drawer').open;
};

document.querySelector('#logoutButton').onclick = () => {
  window.location.href = '/auth/logout';
};
