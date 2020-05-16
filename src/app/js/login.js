import './base';
import '../css/login.scss';
import '@material/mwc-button';

document.querySelector('#loginButton').onclick = () => {
  window.location.href = '/auth/github';
};
