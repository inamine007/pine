export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'pine',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  serverMiddleware: [
    { path: '/api', handler: '~/api/server.js' },
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/axios.js'},
    { src: '~/plugins/localStorage.js'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    '@nuxtjs/auth'
  ],

  auth: {
    //strategiesの中身に認証ロジックを書いていく
    strategies: {
      //localという認証方法を使う場合
      local: {
        //axiosでアクセスする際の設定
        endpoints: {
          login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
          refresh: { url: '/api/auth/token', method: 'post', propertyName: 'token' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/users/me', method: 'get', propertyName: 'data' }
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: [
    'socket.io-client'
  ],

  watchers: {
    webpack: {
      poll: true
    }
  }
}
