import './base';
import '../css/login.scss';
import '@material/mwc-button';

document.onload = () => {
  document.querySelector('#loginButton').addEventListener('click', () => {
    window.location.href = '/auth/github';
  });
};
