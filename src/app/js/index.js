import './base';
import '../css/index.scss';
import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-drawer';
import '@material/mwc-list/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-icon';

document.querySelector('#navigationButton').addEventListener('click', () => {
  document.querySelector('mwc-drawer').open = !document.querySelector('mwc-drawer').open;
});

document.querySelector('#logoutButton').addEventListener('click', () => {
  window.location.href = '/auth/logout';
});
