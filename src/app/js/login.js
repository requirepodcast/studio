import '@webcomponents/webcomponentsjs/webcomponents-loader.js';
import '../styles/login.scss';

import '@material/mwc-button';

document.querySelector('#loginButton').onclick = () => {
  window.location.href = '/auth/github';
};
