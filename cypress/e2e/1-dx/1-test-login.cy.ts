/// <reference types="cypress" />

describe("Login for a test user on DX", () => {
  const baseUrl = Cypress.env("base_url");
  beforeEach(() => {
    cy.login();
    cy.saveLocalStorageCache();
    cy.visit(baseUrl);
    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("checks login", function () {
    cy.contains("CREATE REPORT").should("be.visible");
  });
});
