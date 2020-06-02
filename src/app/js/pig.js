import './base';
import '../styles/pig.scss';

import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-textarea';
import axios from 'axios';

function getImages() {
  axios.get('/api/v1/pig').then(({ data }) => {
    document.querySelector('.images').innerHTML = '';
    data.episodes.map(episode => {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('class', 'pigEpisodeCard');

      const title = document.createElement('h3');
      title.textContent = episode.episodeTitle;

      const ig = document.createElement('img');
      ig.setAttribute('src', episode.ig);
      ig.setAttribute('class', 'pigImage');

      const tw = document.createElement('img');
      tw.setAttribute('src', episode.tw);
      tw.setAttribute('class', 'pigImage');

      const deleteButton = document.createElement('mwc-button');
      deleteButton.setAttribute('label', 'Delete');
      deleteButton.setAttribute('raised', 'raised');
      deleteButton.setAttribute('dense', 'dense');
      deleteButton.setAttribute('icon', 'delete');
      deleteButton.addEventListener('click', () => {
        axios.delete('/api/v1/pig', { data: { episode: episode.episodeTitle } }).then(() => {
          getImages();
        });
      });

      wrapper.appendChild(title);
      wrapper.appendChild(ig);
      wrapper.appendChild(tw);
      wrapper.appendChild(deleteButton);

      document.querySelector('.images').appendChild(wrapper);
    });
  });
}

getImages();

document.querySelector('#generate').addEventListener('click', () => {
  const title = document.querySelector('#title').value;
  const description = document.querySelector('#description').value;

  axios.post('/api/v1/pig', { title, description }).then(() => setTimeout(() => getImages(), 1000));
});
