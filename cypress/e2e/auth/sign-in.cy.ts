const BAD_CREDENTIALS_ERROR_MESSAGE = 'Username or password incorrect';

describe('Sign In', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('SIGN_IN_URL'));
  });

  it('Should show an alert with error message when credentials are invalid', () => {
    cy.getInputByFormControlName('username').type('username');
    cy.getInputByFormControlName('password').type('wrongpassword');
    cy.dataCy('sign-in-btn').click();

    cy.contains(BAD_CREDENTIALS_ERROR_MESSAGE).should('be.visible');
  });

  it('Should redirect to home page when credentials are valid', () => {
    const {
      USER: { USERNAME, PASSWORD },
    } = Cypress.env();

    cy.getInputByFormControlName('username').type(USERNAME);
    cy.getInputByFormControlName('password').type(PASSWORD);
    cy.dataCy('sign-in-btn').click();

    cy.location('pathname').should('eq', '/');
  });
});
