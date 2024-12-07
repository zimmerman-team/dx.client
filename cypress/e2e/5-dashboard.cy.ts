/// <reference types="cypress" />

describe("Dashboard", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    cy.intercept("GET", `${apiUrl}/assets**`).as("fetchAssets");
    cy.intercept("GET", `${apiUrl}/datasets?filter=*`).as("fetchDatasets");
    cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");
    cy.intercept(`${apiUrl}/stories?filter=*`).as("fetchStories");

    cy.restoreLocalStorageCache();
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("Can view all asset types on the dashboard", () => {
    cy.get('[data-cy="home-all-tab"]').scrollIntoView().click();
    cy.wait("@fetchAssets");
    cy.get('[data-cy="dataset-grid-item"]').should("be.visible");
    cy.get('[data-cy="story-grid-item"]').should("be.visible");
    cy.get('[data-cy="dataset-grid-item"]').should("be.visible");
  });

  it("Can filter datasets by category", () => {
    cy.get('[data-cy="home-data-tab"]').scrollIntoView().click();
    cy.wait("@fetchDatasets");

    cy.contains('[data-cy="dataset-category-button"]', "Social").click();
    cy.wait("@fetchDatasets");

    cy.get('[data-cy="dataset-grid-item"]').should(
      "have.length.greaterThan",
      0
    );
  });
  it("Can get to assets from the table view", () => {
    cy.get('[data-cy="home-all-tab"]').scrollIntoView().click();
    cy.wait("@fetchAssets");

    cy.get('[data-cy="home-table-view-button"]').click();

    cy.get('[data-cy="homepage-table"]').within(() => {
      cy.get('[data-cy="table-row-chart"]').first().click();
    });

    cy.location("pathname").should("include", "/chart/");
    cy.visit("/");

    cy.get('[data-cy="home-data-tab"]').scrollIntoView().click();
    cy.wait("@fetchDatasets");

    cy.get('[data-cy="homepage-table"]').within(() => {
      cy.get('[data-cy="table-row-dataset"]').first().click();
    });

    cy.location("pathname").should("include", "/dataset/");

    cy.visit("/");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();
    cy.wait("@fetchCharts");

    cy.get('[data-cy="homepage-table"]').within(() => {
      cy.get('[data-cy="table-row-chart"]').first().click();
    });

    cy.location("pathname").should("include", "/chart/");

    cy.visit("/");

    cy.get('[data-cy="home-stories-tab"]').scrollIntoView().click();
    cy.wait("@fetchStories");

    cy.get('[data-cy="homepage-table"]').within(() => {
      cy.get('[data-cy="table-row-story"]').first().click();
    });

    cy.location("pathname").should("include", "/story/");

    cy.visit("/");
  });
});
