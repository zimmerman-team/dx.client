/// <reference types="cypress" />

describe("testing user profile", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/");
    cy.contains("Accept").click();
    cy.get("[data-cy=navbar-profile-btn").click();
  });
  it("should test profile actions", () => {
    cy.intercept(`${apiUrl}/users/update-profile`).as("updateProfile");
    cy.get("input").first().type("{selectall}{backspace}test user");
    cy.get("body").click(0, 0);
    cy.wait("@updateProfile");

    cy.contains('[data-cy="profile-tab"]', "settings").click();
    cy.contains('[data-cy="profile-tab"]', "profile").click();
    cy.get("input").first().should("have.value", "test user");
  });

  it("should select all invoices", () => {
    cy.intercept(`${apiUrl}/stripe/invoices/**`).as("fetchInvoices");
    cy.contains('[data-cy="profile-tab"]', "billing").click();
    cy.wait("@fetchInvoices");
    cy.get('[data-cy="checkAllInvoice"]').click();
    cy.get('[data-cy="check-invoice"]').each(($el, index) => {
      cy.wrap($el).should("have.class", "Mui-checked"); // Example: Click each element
    });
  });
});
