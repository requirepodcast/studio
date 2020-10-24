import './base';
import '../styles/shortener.scss'

import '@material/mwc-textfield';
import '@material/mwc-button';

import isURL from 'validator/es/lib/isURL';

function getLinks() {
  return import('axios').then(({ default: axios }) => {
    return axios.get('/api/v1/shortener').then(({data}) => {
      const dataTable = document.querySelector('.mdc-data-table__content');

      dataTable.innerHTML = '';

      for (const link of data) {
        const row = document.createElement('tr');
        row.setAttribute('class', 'mdc-data-table__row');

        const linkSlug = document.createElement('td');
        linkSlug.setAttribute('class', 'mdc-data-table__cell');
        linkSlug.textContent = link.slug;

        const linkDest = document.createElement('td');
        linkDest.setAttribute('class', 'mdc-data-table__cell');

        const linkDestLink = document.createElement('a')
        linkDestLink.setAttribute('href', link.destination)
        linkDestLink.textContent = link.destination;

        linkDest.appendChild(linkDestLink)

        row.appendChild(linkSlug);
        row.appendChild(linkDest);

        dataTable.appendChild(row);
      }
    })
  })
}

document.querySelector('#create').addEventListener('click', () => {
  const slug = document.querySelector('#slug').value;
  const destination = document.querySelector('#dest').value;

  if (slug !== '' && isURL(destination)) {
    import('axios').then(({default: axios}) => {
      axios.post('/api/v1/shortener', { slug, destination }).then(() => {
        getLinks().then(() => {
          document.querySelector('#slug').value = "";
          document.querySelector('#dest').value = "";
        });
      })
    })
  }
})

getLinks()