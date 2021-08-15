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
    '@/assets/scss/_style.scss'
  ],

  serverMiddleware: [
    { path: '/api', handler: '~/api/server.js' },
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/axios.js'},
    { src: '~/plugins/localStorage.js'},
    { src: '~/plugins/util.js'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    '@nuxtjs/auth',
    "@nuxtjs/svg",
    "@nuxtjs/style-resources"
  ],

  styleResources: {
    scss: [
      '@/assets/scss/_variable.scss' // 読みませたいscssファイルを指定します。
    ]
  },

  auth: {
    redirect: {
      login: '/',   // 未ログイン時に認証ルートへアクセスした際のリダイレクトURL
      logout: '/',  // ログアウト時のリダイレクトURL
      callback: false,   // Oauth認証等で必要となる コールバックルート
      home: '/home',         // ログイン後のリダイレクトURL
    },
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
  build: {
    'socket.io-client': 'socket.io-client',
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.devtool = 'eval-source-map' // <-- ここを足す
      }
    },
  },

  router: {
    middleware: 'redirect'
  },

  watchers: {
    webpack: {
      poll: true
    }
  }
}
