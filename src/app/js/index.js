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
import '@material/mwc-textfield';
import '@material/mwc-textarea';
import { MDCSelect } from '@material/select';

const inputFileSelect = new MDCSelect(document.querySelector('.mdc-select'));

import('socket.io-client').then(({ default: io }) => {
  const renderLogs = document.querySelector('.renderLogs');
  const socket = io('/', { query: { token: Cookies.get('auth') } });

  socket.on('status', ({ isRendering }) => {
    renderLogs.innerHTML = isRendering ? '' : 'not currently rendering';
  });

  socket.on('start', e => {
    renderLogs.innerHTML = 'render logs start <br><br>' + e + '<br>';
    document.querySelector('#startButton').setAttribute('disabled', 'disabled');
    getOutputFiles();
  });

  socket.on('progress', e => {
    renderLogs.innerHTML += e + '<br>';
    renderLogs.scrollTop = renderLogs.scrollHeight;
    renderLogs.scrollLeft = renderLogs.scrollWidth;
    document.querySelector('#startButton').setAttribute('disabled', 'disabled');
  });

  socket.on('error', err => {
    renderLogs.innerHTML += err + '<br>';
    renderLogs.scrollTop = renderLogs.scrollHeight;
    renderLogs.scrollLeft = renderLogs.scrollWidth;
    document.querySelector('#startButton').removeAttribute('disabled');
  });

  socket.on('finish', e => {
    renderLogs.innerHTML += e + '<br>';
    renderLogs.scrollTop = renderLogs.scrollHeight;
    renderLogs.scrollLeft = renderLogs.scrollWidth;
    document.querySelector('#startButton').removeAttribute('disabled');
  });
});

function getAudioFiles() {
  import('axios').then(({ default: axios }) => {
    axios.get('/api/v1/audio').then(({ data }) => {
      const dataTable = document.querySelector('.mdc-data-table__content');
      const filesList = document.querySelector('.filesToRender');

      dataTable.innerHTML = '';
      filesList.innerHTML = '';

      const blankListItem = document.createElement('li');
      blankListItem.setAttribute('class', 'mdc-list-item mdc-list-item--selected');
      blankListItem.setAttribute('data-value', '');
      blankListItem.setAttribute('aria-selected', 'true');
      filesList.appendChild(blankListItem);

      for (const file of data) {
        // Table
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

        // Files to render
        const listItem = document.createElement('li');
        listItem.setAttribute('class', 'mdc-list-item');
        listItem.setAttribute('data-value', file.name);

        const listItemLabel = document.createElement('span');
        listItemLabel.textContent = file.name;

        listItem.appendChild(listItemLabel);
        filesList.appendChild(listItem);
      }
    });
  });
}

getAudioFiles();

function getOutputFiles() {
  import('axios').then(({ default: axios }) => {
    axios.get('/api/v1/output').then(({ data }) => {
      const outputList = document.querySelector('.outputFiles');
      for (const file of data) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${file}" target="_blank">${file.replace(
          '/static/output/',
          '',
        )}</a>`;
        outputList.appendChild(listItem);
      }
    });
  });
}

getOutputFiles();

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

document.querySelector('#startButton').onclick = () => {
  const inputFile = inputFileSelect.value;
  const episodeTitle = document.querySelector('#episodeTitle').value;
  const outputFile = document.querySelector('#outputFile').value;

  axios
    .post('/api/v1/renderer/start', { title: episodeTitle, audioFile: inputFile, outputFile })
    .then(res => console.log(res));
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
