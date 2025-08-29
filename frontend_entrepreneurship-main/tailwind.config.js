/** @type {import('tailwindcss').Config} */
export default {
  // Asegúrate de que esta ruta sea correcta para tu proyecto
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // === PALETA DE COLORES ===
      // Tailwind generará clases como `bg-primary-500`, que a su vez usarán
      // las variables CSS que definiremos en nuestro archivo CSS.
      colors: {
        primary: {
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
        },
        secondary: {
          50: "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-secondary-400)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
        },
        accent: {
          50: "var(--color-accent-50)",
          100: "var(--color-accent-100)",
          200: "var(--color-accent-200)",
          300: "var(--color-accent-300)",
          400: "var(--color-accent-400)",
          500: "var(--color-accent-500)",
          600: "var(--color-accent-600)",
          700: "var(--color-accent-700)",
          800: "var(--color-accent-800)",
          900: "var(--color-accent-900)",
        },
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          // Nota: El HTML original usa neutral-600, 700, 800, 900. Los añadí.
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          dark: "var(--color-success-dark)",
        },
        error: {
          light: "var(--color-error-light)",
          DEFAULT: "var(--color-error)",
          dark: "var(--color-error-dark)",
        },
        'module-blue': '#4285F4', // Un azul vibrante para 'En progreso'
        'module-gray': '#B0B0B0', // Un gris claro para 'Bloqueado'
        'module-line': '#C0C0C0', // Un gris un poco más claro para las líneas
        'icon-lock': '#F9A825',  // Un tono ámbar/naranja para el candado
        'icon-progress': '#E94235', // Un rojo para el ícono de progreso
        'page-bg-start': '#F4F6FA', // Inicio del degradado del fondo
        'page-bg-end': '#E6E9F7',   // Fin del degradado del fondo
      },

      // === TIPOGRAFÍA ===
      fontFamily: {
        brand: ["var(--font-family-brand)", "sans-serif"], // Añadido fallback
      },

      // === BORDES Y SOMBRAS ===
      borderRadius: {
        brand: "var(--border-radius-brand)",
      },
      boxShadow: {
        "brand-md": "var(--shadow-md)",
        "brand-lg": "var(--shadow-lg)",
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
