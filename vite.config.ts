import { defineConfig } from 'vite';

// Relative URLs work at username.github.io AND username.github.io/repository/.
export default defineConfig({ base: './', build: { target: 'es2022' } });
