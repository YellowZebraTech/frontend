import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  base: "/frontend/",

  plugins: [react(), tailwindcss()]
 // server: { //
  //  port: 5175,//
  //  host: '0.0.0.0', //
  //  strictPort: true // Evita cambio automático de puerto
  //}
})
