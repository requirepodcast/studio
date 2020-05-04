import axios from 'axios';
import Cookies from 'js-cookie';

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

  document.querySelector('#restartButton').onclick = () => {
    if (confirm('Are you sure to restart the server?')) {
      axios.post('/api/v1/server/shutdown').then(() => {
        alert('Server is restarting... Wait a few seconds, and try to refresh the page');
      });
    }
  };

  import('socket.io-client').then(({ default: io }) => {
    const socket = io('/', { query: { token: Cookies.get('auth') } });

    socket.on('status', ({ isRendering }) => {
      console.log(isRendering);
    });
  });
};
