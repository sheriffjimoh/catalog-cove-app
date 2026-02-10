import axios from 'axios';

axios.defaults.withCredentials = true;
axios.get("/sanctum/csrf-cookie");
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
