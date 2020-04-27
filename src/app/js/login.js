import './base';
import '../css/login.scss';
import '@material/mwc-button';

window.onload = () => {
  document.querySelector('#loginButton').onclick = () => {
    window.location.href = '/auth/github';
  };
};
