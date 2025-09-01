import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["firebase/app", "firebase/firestore"],
    exclude: ["lucide-react"], // agar tu exclude rakhna chahta hai
  },
  build: {
    commonjsOptions: {
      include: [/firebase/, /node_modules/],
    },
  },
})
