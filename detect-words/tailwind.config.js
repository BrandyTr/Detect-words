/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx,html}',
    ],
    theme: {
        extend: {
            colors: {
                'primary-darkBlue': 'var(--color-primary-darkBlue)',
                'primary-lightestBlue': 'var(--color-primary-lightestBlue)',
                'primary-lightBlue': 'var(--color-primary-lightBlue)',
                white: 'var(--color-white)',
                beggie: 'var(--color-beggie)',
                gray: 'var(--color-gray)',
                beggieDark: 'var(--color-beggieDark)',
            },
            boxShadow: {
                'btn-shadow': 'var(--btn-shadow)',
            },
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
            }
        },
    },
    plugins: []
}