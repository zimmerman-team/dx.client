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
      cy.contains("a", "Why Dataxplorer").click();
    });
  });

  it("Displays the buttons that link to the correct pages", () => {
    cy.contains("button", "CREATE STORY").first().click();

    cy.location("pathname").should("include", "/story/new/initial");

    cy.visit("/why-dataxplorer");

    cy.contains("button", "EXPLORE STORIES").click();

    cy.location("pathname").should("include", "/");

    cy.visit("/why-dataxplorer");

    cy.contains("a", "CREATE STORY").scrollIntoView().click();

    cy.location("pathname").should("include", "/story/new/initial");

    cy.visit("/why-dataxplorer");

    cy.contains("a", "Contact sales").scrollIntoView().click();

    cy.location("pathname").should("include", "/contact");
  });
});

describe("Testing the Why dataxplorer page logged out", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();
    cy.get('[data-cy="app-bar"]').within(() => {
      cy.contains("a", "Why Dataxplorer").click();
    });
  });

  it("Displays the buttons that link to the correct pages", () => {
    cy.get('[data-cy="google-button"]').click();

    cy.origin("https://accounts.google.com", () => {
      cy.location("hostname").should("include", "accounts.google.com");
    });

    cy.visit("/why-dataxplorer");

    cy.get('[data-cy="linkedin-button"]').click();
    cy.origin("https://www.linkedin.com", () => {
      cy.location("hostname").should("include", "www.linkedin.com");
    });
    cy.visit("/why-dataxplorer");
    cy.get('[data-cy="microsoft-button"]').click();
    cy.origin("https://login.live.com", () => {
      cy.location("hostname").should("include", "login.live.com");
    });
  });
});
