/// <reference types="cypress" />

/* TESTS TO COVER

- Create Bar Chart - Done
- Create Line Chart - Done
- Edit Chart - Done
- Delete Chart - Done
- Duplicate Chart - Done

*/

describe("Testing create chart on DX", () => {
  const apiUrl = Cypress.env("api_url");
  const baseUrl = Cypress.env("base_url");
  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit(baseUrl);

    cy.get('[data-cy="cookie-btn"]').click();

    cy.get('[data-cy="create-report-dropdown"]').click();
    cy.intercept("GET", `${apiUrl}/datasets?filter=*`).as("getDatasets");
    cy.get('[data-cy="appbar-create-chart"]').click();
    cy.wait("@getDatasets");

    cy.intercept("GET", `${apiUrl}/chart/sample-data/*`).as("getDataset");

    cy.contains('[data-cy="dataset-grid-item"]', "Soccer Players")
      .first()
      .click();

    cy.wait("@getDataset");

    cy.contains("Please select data from Dx");

    cy.get('[data-cy="toolbox-selected-dataset"]')
      .contains("Soccer Players")
      .should("be.visible");

    cy.get('[data-cy="toolbox-chart-next"]').click();
  });

  it("Create Bar Chart", () => {
    cy.get('[data-cy="chart-type-item"]').contains("Bar chart").click();

    cy.get('[data-cy="chart-type-preview"]')
      .contains("Bar chart")
      .should("be.visible");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.contains('[data-cy="nonstatic-dimension-container"]', "Bars").within(
      () => {
        cy.get('[data-cy="chart-dimension-select"]').click();
      }
    );

    cy.intercept(`${apiUrl}/chart/new/render`).as("renderChart");

    cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();

    cy.wait("@renderChart");

    cy.get('[data-cy="common-chart-container"]').should("be.visible");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@renderChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@renderChart");

    cy.intercept(`${apiUrl}/chart`).as("saveChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart");

    cy.visit(baseUrl);

    cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="chart-grid-item-echartsBarchart"]')
      .contains("Soccer Players")
      .should("be.visible");
  });

  it("Create Line Chart", () => {
    cy.get('[data-cy="chart-type-item"]').contains("Line chart").click();

    cy.get('[data-cy="chart-type-preview"]')
      .contains("Line chart")
      .should("be.visible");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.contains('[data-cy="nonstatic-dimension-container"]', "X Axis").within(
      () => {
        cy.get('[data-cy="chart-dimension-select"]').click();
      }
    );

    cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();

    cy.contains('[data-cy="nonstatic-dimension-container"]', "Y Axis").within(
      () => {
        cy.get('[data-cy="chart-dimension-select"]').click();
      }
    );

    cy.intercept(`${apiUrl}/chart/new/render`).as("renderChart");

    cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();

    cy.wait("@renderChart");

    cy.get('[data-cy="common-chart-container"]').should("be.visible");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@renderChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@renderChart");

    cy.intercept(`${apiUrl}/chart`).as("saveChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart");

    cy.visit(baseUrl);

    cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="chart-grid-item-echartsLinechart"]')
      .contains("Soccer Players")
      .should("be.visible");
  });
});

describe("Edit, duplicate and delete chart", () => {
  const apiUrl = Cypress.env("api_url");
  const baseUrl = Cypress.env("base_url");
  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit(baseUrl);

    cy.get('[data-cy="cookie-btn"]').click();

    cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.wait("@fetchCharts");
  });

  it("Edit chart", () => {
    cy.contains('[data-cy="chart-grid-item-echartsBarchart"]', "Soccer Players")
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="chart-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/chart/*`).as("renderChart");
    cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart2");

    cy.get('[data-cy="chart-grid-item-edit-btn"]').click();

    cy.wait("@renderChart");
    cy.wait("@renderChart2");

    cy.get('[data-cy="chart-toolbox-mapping-tab"]')
      .invoke("attr", "disabled", false)
      .trigger("mouseover")
      .click();

    cy.wait("@renderChart2");

    cy.get('[data-cy="chart-toolbox-mapping-tab"]').click();

    cy.contains('[data-cy="nonstatic-dimension-container"]', "Bars").within(
      () => {
        cy.get('[data-cy="chart-dimension-select"]').click();
      }
    );

    cy.get('[data-cy="chart-dimension-mapping-item"]').eq(2).click();

    cy.wait("@renderChart2");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@renderChart2");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@renderChart2");

    cy.intercept(`${apiUrl}/chart/*`).as("saveChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart");
  });

  it("Duplicate chart", () => {
    cy.contains('[data-cy="chart-grid-item-echartsBarchart"]', "Soccer Players")
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="chart-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="chart-grid-item-duplicate-btn"]').click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="chart-grid-item-echartsBarchart"]')
      .contains("Soccer Players (Copy)")
      .should("be.visible");
  });

  it("Delete chart", () => {
    cy.contains(
      '[data-cy="chart-grid-item-echartsBarchart"]',
      "Soccer Players (Copy)"
    )
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="chart-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="chart-grid-item-delete-btn"]').click();
    cy.intercept("DELETE", `${apiUrl}/chart/*`).as("deleteChart");

    cy.get('[data-cy="delete-chart-item-form"]').within(() => {
      cy.get('[data-cy="delete-chart-item-input"]').type("DELETE {enter}");
    });

    cy.wait("@deleteChart");

    cy.wait("@fetchCharts");

    cy.get('[data-cy="chart-grid-item-echartsBarchart"]')
      .contains("Soccer Players (Copy)")
      .should("not.exist");
  });
});
