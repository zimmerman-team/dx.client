describe("Home page tests", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("Can go to explore reports page and create report from the about page", () => {
    cy.get('[data-cy="nav-about"]').click();
    cy.wait(2000);
    cy.location("pathname").should("include", "/about");
    cy.get('[data-cy="empower-block-explore-reports-link"]').click();
    cy.wait(2000);
    cy.location("pathname").should("include", "/explore");
    cy.get('[data-cy="nav-about"]').click();
    cy.wait(2000);

    cy.get('[data-cy="empower-block-create-report-link"]').click();
    cy.wait(2000);
    cy.location("pathname").should("include", "/report/new/initial");
  });
});
