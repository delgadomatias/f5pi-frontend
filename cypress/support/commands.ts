Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('getInputByFormControlName', (name) => {
  return cy.get(`input[formControlName="${name}"]`);
});
