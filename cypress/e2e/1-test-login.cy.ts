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
    cy.contains("Welcome").should("be.visible");
  });
  // it("can log out", function () {
  //   cy.get("[data-cy=navbar-profile-btn").click();
  //   cy.contains("Sign Out").should("be.visible");
  //   cy.get("[data-cy=sign-out-btn").click();
  //   cy.contains("Are you sure you want to Sign out?").should("be.visible");
  //   cy.get("[data-cy=modal-sign-out-btn]").click();
  //   cy.wait(2000);
  //   cy.contains("Contact").should("be.visible");
  //   cy.contains("Sign in").should("be.visible");
  // });
});
