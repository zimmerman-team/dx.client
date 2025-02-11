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
    cy.get("input").first().type("test user");
    cy.wait("@userProfile");
    cy.get("body").find('[data-cy="contact-form-alert"]').should("be.visible");
    cy.contains('[data-cy="profile-tab"]', "settings").click();
    cy.contains('[data-cy="profile-tab"]', "profile").click();
    cy.get("test user");
  });

  it("should select all invoices", () => {
    cy.contains('[data-cy="profile-tab"]', "billing").click();
    cy.get('[data-cy="checkAllInvoice"]').click();
    cy.get('[data-cy="checkInvoice"]').each(($el, index) => {
      cy.wrap($el).should("be.checked"); // Example: Click each element
    });
  });
});
