import axios from 'axios';
import Cookies from 'js-cookie';

import './base';
import '../styles/renderer.scss';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-textarea';
import '@material/mwc-linear-progress';
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
    getOutputFiles();
  });

  socket.on('finish', e => {
    renderLogs.innerHTML += e + '<br>';
    renderLogs.scrollTop = renderLogs.scrollHeight;
    renderLogs.scrollLeft = renderLogs.scrollWidth;
    document.querySelector('#startButton').removeAttribute('disabled');
    getOutputFiles();
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
      outputList.innerHTML = '';
      for (const file of data) {
        const listItem = document.createElement('li');

        const fileLink = document.createElement('a');
        fileLink.setAttribute('href', file);
        fileLink.setAttribute('target', '_blank');
        fileLink.textContent = file;

        const deleteFile = document.createElement('a');
        deleteFile.setAttribute('href', '#');
        deleteFile.setAttribute('style', 'color: red');
        deleteFile.addEventListener('click', () => {
          axios.delete('/api/v1/output', { data: { file: file.replace('/static/renderer/', '') } });
          getOutputFiles();
        });
        deleteFile.textContent = 'Delete';

        listItem.appendChild(fileLink);
        listItem.innerHTML += ' ';
        listItem.appendChild(deleteFile);

        outputList.appendChild(listItem);
      }
    });
  });
}

getOutputFiles();

document.querySelector('#startButton').onclick = () => {
  const inputFile = inputFileSelect.value;
  const episodeTitle = document.querySelector('#episodeTitle').value;
  const outputFile = document.querySelector('#outputFile').value;

  axios.post('/api/v1/renderer', { title: episodeTitle, audioFile: inputFile, outputFile });
};

document.querySelector('#fileUploadButton').onclick = () => {
  const fileUpload = document.querySelector('#fileUpload');
  fileUpload.click();

  fileUpload.addEventListener('change', () => {
    const formData = new FormData();
    formData.append('audio', fileUpload.files[0]);

    const progressOverlay = document.createElement('div');
    progressOverlay.setAttribute('class', 'uploadProgressOverlay');
    const progressWrapper = document.createElement('div');
    progressWrapper.setAttribute('class', 'uploadProgressWrapper');
    const progress = document.createElement('mwc-linear-progress');
    progress.setAttribute('progress', '0');

    progressWrapper.appendChild(progress);
    progressOverlay.appendChild(progressWrapper);
    document.body.appendChild(progressOverlay);

    axios
      .put('/api/v1/audio/upload', formData, {
        onUploadProgress: e => {
          progress.setAttribute('progress', (e.loaded / e.total).toString());
        },
      })
      .then(() => {
        document.body.removeChild(progressOverlay);
        getAudioFiles();
      })
      .catch(() => {
        document.body.removeChild(progressOverlay);
        alert('Error while uploading file');
      });
  });
};
