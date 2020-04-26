import './base';
import '../css/index.scss';
import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-drawer';

document.querySelector('#navigationButton').addEventListener('click', () => {
  document.querySelector('mwc-drawer').open = !document.querySelector('mwc-drawer').open;
});
