/// <reference types="cypress" />

describe("Testing the Partners page logged in", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();
    cy.get('[data-cy="app-bar"]').within(() => {
      cy.contains("a", "Partners").click();
    });
  });

  it("Can switch between the different tabs", () => {
    cy.get('[data-cy="partners-tabs"]').within(() => {
      cy.contains("About").click();
    });

    cy.get('[data-cy="partners-view"]')
      .first()
      .within(() => {
        cy.contains("The Global Fund Data Explorer").should("be.visible");

        cy.contains("a", "Visit the Global Fund Data Explorer")
          .invoke("removeAttr", "target")
          .click();

        cy.origin("https://data.theglobalfund.org", () => {
          cy.location("hostname").should("eq", "data.theglobalfund.org");
        });
      });

    cy.visit("/partners");

    cy.get('[data-cy="partners-tabs"]').within(() => {
      cy.contains("Grants").click();
    });

    cy.get('[data-cy="partners-view"]')
      .eq(1)
      .within(() => {
        cy.contains("Grant Implementation Period").should("be.visible");

        cy.contains("a", "LiveView").invoke("removeAttr", "target").click();

        cy.origin("https://data.theglobalfund.org", () => {
          cy.location("hostname").should("eq", "data.theglobalfund.org");
          cy.location("pathname").should("include", "/location");
        });
      });

    cy.visit("/partners");

    cy.get('[data-cy="partners-tabs"]').within(() => {
      cy.contains("Budgets").click();
    });

    cy.get('[data-cy="partners-view"]')
      .eq(2)
      .within(() => {
        cy.contains("Grant Budgeting").should("be.visible");

        cy.contains("a", "LiveView").invoke("removeAttr", "target").click();

        cy.origin("https://data.theglobalfund.org", () => {
          cy.location("hostname").should("eq", "data.theglobalfund.org");
          cy.location("pathname").should("include", "/geography");
        });
      });

    cy.visit("/partners");

    cy.get('[data-cy="partners-tabs"]').within(() => {
      cy.contains("Performance").click();
    });

    cy.get('[data-cy="partners-view"]')
      .eq(3)
      .within(() => {
        cy.contains("Targets & results").should("be.visible");

        cy.contains("a", "LiveView").invoke("removeAttr", "target").click();

        cy.origin("https://data.theglobalfund.org", () => {
          cy.location("hostname").should("eq", "data.theglobalfund.org");
          cy.location("pathname").should("include", "/targets-results");
        });
      });
  });
});
