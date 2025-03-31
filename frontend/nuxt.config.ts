// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  alias: {
    '@stores': './stores'
  },
  modules: [
    '@privyid/persona',
    '@privyid/persona-icon',
    '@pinia/nuxt', // add this if not already present
  ],
  css    : ['~/assets/css/tailwind.css'], 
  postcss: {
    plugins: {
      'postcss-hexrgba'       : {}, 
      'tailwindcss/nesting'   : {}, 
      'tailwindcss'           : {}, 
      'postcss-lighten-darken': {}, 
      'autoprefixer'          : {}, 
    },
  },
  plugins: ['~/plugins/socket.io.client.ts'],
  watchers: {
    webpack: {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay before rebuilding
      ignored: /node_modules/, // Ignore node_modules to reduce the number of watched files
    },
    chokidar: {
      usePolling: true,
      interval: 1000, // Check for changes every second
    }
  },
  runtimeConfig: {
    public: {
      apiBase: '/api',
      targetApi: 'http://localhost:8888',
    }
  },
})
