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
import '@material/mwc-button';

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

document.querySelector('#fileUploadButton').onclick = () => {
  const fileUpload = document.querySelector('#fileUpload');
  fileUpload.click();

  fileUpload.addEventListener('change', () => {
    const formData = new FormData();
    formData.append('audio', fileUpload.files[0]);
    axios.post('/api/v1/audio/upload', formData).then(getAudioFiles);
  });
};

import('socket.io-client').then(({ default: io }) => {
  const socket = io('/', { query: { token: Cookies.get('auth') } });

  socket.on('status', ({ isRendering }) => {
    console.log(isRendering);
  });
});

function getAudioFiles() {
  import('axios').then(({ default: axios }) => {
    axios.get('/api/v1/audio').then(({ data }) => {
      const dataTable = document.querySelector('.mdc-data-table__content');
      dataTable.innerHTML = '';
      for (const file of data) {
        const row = document.createElement('tr');
        row.setAttribute('class', 'mdc-data-table__row');

        const fileName = document.createElement('td');
        fileName.setAttribute('class', 'mdc-data-table__cell');
        fileName.textContent = file.name;

        const fileSize = document.createElement('td');
        fileSize.setAttribute('class', 'mdc-data-table__cell');
        fileSize.textContent = file.size;

        row.appendChild(fileName);
        row.appendChild(fileSize);

        dataTable.appendChild(row);
      }
    });
  });
}

getAudioFiles();
