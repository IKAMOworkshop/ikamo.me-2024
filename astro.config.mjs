import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [glsl()],
    },
});