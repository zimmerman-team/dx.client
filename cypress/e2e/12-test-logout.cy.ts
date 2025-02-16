/// <reference types="cypress" />

describe("Logout for a test user on DX", () => {
  beforeEach(() => {
    // restore login session
    cy.restoreLocalStorageCache();
    cy.visit("/");
  });

  it("can log out", function () {
    cy.get("[data-cy=navbar-profile-btn]").click();
    cy.contains("Sign Out").should("be.visible");
    cy.get("[data-cy=sign-out-btn]").click();
    cy.contains("Are you sure you want to Sign out?").should("be.visible");
    cy.get("[data-cy=modal-sign-out-btn]").click();
    cy.wait(2000);
    cy.contains("Contact").should("be.visible");
    cy.contains("Sign in").should("be.visible");
  });
});
