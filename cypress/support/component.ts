import { mount } from 'cypress/angular';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      getInputByFormControlName(name: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('mount', mount);
