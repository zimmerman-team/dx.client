/// <reference types="cypress" />

describe("Login for a test user on DX", () => {
  beforeEach(() => {
    cy.login();
    cy.saveLocalStorageCache();
    cy.visit("http://localhost:3000");
    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("checks login", function () {
    cy.contains("CREATE REPORT").should("be.visible");
  });
});
