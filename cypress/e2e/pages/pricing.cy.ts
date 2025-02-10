/// <reference types="cypress" />

describe("Testing the Why dataxplorer page logged in", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    // cy.setGoogleAccessToken();

    cy.intercept("GET", `${apiUrl}/users/plan-data`).as("planData");

    cy.visit("/");

    cy.wait("@planData");

    cy.get('[data-cy="cookie-btn"]').click();
    cy.get('[data-cy="app-bar"]').within(() => {
      cy.contains("a", "Pricing").click();
    });
  });

  it("Displays the displaysthe current plan", () => {
    cy.get('[data-cy="plan-card"]').should("have.length", 4);
    cy.get('[data-cy="plan-card"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="plan-button"]').contains("Current Plan");
      });
  });

  it("Shows the billing page and settings", () => {
    cy.visit("/user-management/billing");

    cy.contains("button", "RENEW PLAN").click();

    cy.origin("https://billing.stripe.com", () => {
      cy.location("origin").should("include", "https://billing.stripe.com");
    });

    cy.visit("/user-management/billing");

    cy.contains("button", "UPGRADE PLAN").click();

    cy.origin("https://billing.stripe.com", () => {
      cy.location("origin").should("include", "https://billing.stripe.com");
    });

    cy.visit("/user-management/billing");

    cy.contains("button", "CANCEL PLAN").click();

    cy.origin("https://billing.stripe.com", () => {
      cy.location("origin").should("include", "https://billing.stripe.com");
    });

    cy.visit("/user-management/billing");

    cy.contains("button", "CHANGE PAYMENT METHOD").click();

    cy.origin("https://billing.stripe.com", () => {
      cy.location("origin").should("include", "https://billing.stripe.com");
    });

    cy.visit("/user-management/billing");

    cy.contains("button", "CHANGE BILLING INFO").click();

    cy.origin("https://billing.stripe.com", () => {
      cy.location("origin").should("include", "https://billing.stripe.com");
    });

    cy.visit("/user-management/billing");
  });
});
