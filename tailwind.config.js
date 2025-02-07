/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require("tailwindcss/colors");
module.exports = {
  // important: true,
   darkMode: 'class',
   content: [
       "./src/**/*.{vue,js,ts,jsx,tsx}",
       "./node_modules/golden-logic-ui/**/*.{vue,js,ts,jsx,tsx}",
     ],
 theme: {
  screens: {
    'xs': '0px',
    ...defaultTheme.screens,
  },

   extend: {

       colors: {
        current: 'currentColor',
        transparent: 'transparent',
        white: '#FFFFFF',
        black: '#1C2434',
        body: '#64748B',
        bodydark: '#AEB7C0',
        bodydark1: '#DEE4EE',
        bodydark2: '#8A99AF',

        graydark: '#333A48',
        'boxdark-2': '#1A222C',
        strokedark: '#2E3A47',
        'form-strokedark': '#3d4d60',
        primary:'var(--theme-color)',
        primaryDark:'var(--theme-dark-color)',
        frontend:'var(--theme-color)',
        frontenddark:'var(--theme-dark-color)',
        boxdark: '#24303F',
        bodydark: '#AEB7C0',
        meta: '#313D4A',

       },
   },
 },
 safelist: [
   'border-red-400',
   'border-green-400',
   'border-gray-400'
 ],
 plugins: [],
}

