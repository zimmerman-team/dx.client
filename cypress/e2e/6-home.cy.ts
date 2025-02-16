describe("Home page tests", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("Can go to explore stories page and create story from the about page", () => {
    cy.get('[data-cy="nav-about"]').click();
    cy.wait(2000);
    cy.location("pathname").should("include", "/about");
    cy.get('[data-cy="empower-block-explore-stories-link"]').click();
    cy.wait(2000);
    cy.location("pathname").should("include", "/");
    cy.get('[data-cy="nav-about"]').click();
    cy.wait(2000);

    cy.get('[data-cy="empower-block-create-story-link"]').click();
    cy.wait(2000);
    cy.location("pathname").should("include", "/story/new/initial");

    cy.visit("/");

    cy.get('[data-cy="app-bar"]').within(() => {
      cy.contains("a", "Library").click();
      cy.location("pathname").should("include", "/");
    });

    cy.visit("/");

    cy.get('[data-cy="app-bar"]').within(() => {
      cy.contains("a", "Why Dataxplorer").click();
      cy.location("pathname").should("include", "/why-dataxplorer");
    });

    cy.visit("/");

    cy.get('[data-cy="app-bar"]').within(() => {
      cy.contains("a", "About").click();
      cy.location("pathname").should("include", "/about");
    });

    cy.visit("/");

    cy.get('[data-cy="app-bar"]').within(() => {
      cy.contains("a", "Partners").click();
      cy.location("pathname").should("include", "/partners");
    });

    cy.visit("/");

    cy.get('[data-cy="app-bar"]').within(() => {
      cy.contains("a", "Contact").click();
      cy.location("pathname").should("include", "/contact");
    });

    cy.visit("/");

    cy.get('[data-cy="app-bar"]').within(() => {
      cy.contains("a", "Pricing").click();
      cy.location("pathname").should("include", "/pricing");
    });
  });
});
