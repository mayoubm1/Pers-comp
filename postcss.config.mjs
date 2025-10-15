/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
import { createServerComponentClient } from '';
    | ^
  3 | import { cookies } from 'next/headers';
  4 | import { redirect } from 'next/navigation';
  5 |