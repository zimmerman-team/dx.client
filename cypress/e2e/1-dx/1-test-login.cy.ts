/// <reference types="cypress" />

describe("Login for a test user on DX", () => {
  beforeEach(() => {
    // cy.login();
    cy.loginToAuth0(
      Cypress.env("auth0_username"),
      Cypress.env("auth0_password")
    );
    cy.saveLocalStorageCache();
    cy.visit("/");
    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("Is Logged in", function () {
    cy.contains("CREATE REPORT").should("be.visible");
  });
});
