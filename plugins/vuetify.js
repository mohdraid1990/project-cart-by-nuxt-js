import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#6366F1',    // Indigo
            secondary: '#EC4899',  // Pink
            accent: '#8B5CF6',     // Purple
            error: '#EF4444',      // Red
            info: '#3B82F6',       // Blue
            success: '#10B981',    // Green
            warning: '#F59E0B',    // Amber
          },
        },
      },
    }
  })

  nuxtApp.vueApp.use(vuetify)
})