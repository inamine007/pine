export default function({ $axios, store, $auth }) {
  $axios.onRequest(config => {
    if (store.$auth.loggedIn) config.headers.common['Authorization'] = store.$auth.getToken('local');
    config.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    config.headers.common['Accept'] = 'application/json';
  });

  $axios.onResponse(response => {
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return Promise.resolve(response);
  })

  $axios.onError(error => {
    if (store.$auth.loggedIn) {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        return $axios.$post('api/auth/token', {
          token: localStorage.getItem('refreshToken')
        }).then(res => {
          store.$auth.setUserToken(res.token);
          $axios.setToken(res.token, 'Bearer');
          originalRequest.headers.Authorization = 'Bearer ' + res.token;
          return $axios.request(originalRequest);
        }).catch(err => {
          console.log(err);
        });
      }

      // リフレッシュトークンの有効期限が切れている場合はログイン画面に戻す
      if (error.response.status === 500 && (
        error.response.data.message === 'Token has expired and can no longer be refreshed' ||
        error.response.data.message === 'The token has been blacklisted'
      )) {
        // $router.push({name: 'admin-login'})
      }
    }
    return Promise.reject(error.response);
  });
}