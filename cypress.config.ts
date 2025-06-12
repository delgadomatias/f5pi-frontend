import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportHeight: 720,
    viewportWidth: 1280,
    env: {
      USERNAME: 'matias',
      PASSWORD: 'matiasdelgado',
    },
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
