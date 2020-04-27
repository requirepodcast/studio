import './base';
import '../css/index.scss';
import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-drawer';
import '@material/mwc-list/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-icon';

window.onload = () => {
  document.querySelector('#navigationButton').onclick = () => {
    document.querySelector('mwc-drawer').open = !document.querySelector('mwc-drawer').open;
  };

  document.querySelector('#logoutButton').onclick = () => {
    window.location.href = '/auth/logout';
  };
};
