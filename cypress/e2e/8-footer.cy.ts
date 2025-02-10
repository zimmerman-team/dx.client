/// <reference types="cypress" />

describe("Testing the footer links logged in", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.visit("/pricing");
    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("Displays the footer links", () => {
    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("Email: contact@dataxplorer.org");

      cy.contains("Keizersgracht 520H");
      cy.contains("1017 EK Amsterdam");
      cy.contains("The Netherlands");
    });
    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("a", "Explore").click();
      cy.location("pathname").should("include", "/");
    });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("a", "Why Dataxplorer").click();
      cy.location("pathname").should("include", "/why-dataxplorer");
    });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("a", "About").click();
      cy.location("pathname").should("include", "/about");
    });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("a", "Partners").click();
      cy.location("pathname").should("include", "/partners");
    });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("a", "Contact").click();
      cy.location("pathname").should("include", "/contact");
    });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("a", "Pricing").click();
      cy.location("pathname").should("include", "/pricing");
    });

    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("a", "Privacy").invoke("removeAttr", "target").click();
    });

    cy.origin("https://drive.google.com", () => {
      cy.location("hostname").should("include", "drive.google.com");
    });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("a", "Terms and conditions")
        .invoke("removeAttr", "target")
        .click();
    });

    cy.origin("https://drive.google.com", () => {
      cy.location("origin").should("include", "https://drive.google.com");
    });
  });
});
