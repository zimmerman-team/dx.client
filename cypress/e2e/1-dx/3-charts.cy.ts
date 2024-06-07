/// <reference types="cypress" />

/* TESTS TO COVER

- Create Bar Chart - Done
- Create Line Chart - Done
- Edit Chart - Done
- Delete Chart - Done
- Duplicate Chart - Done

*/
//@ts-ignore
const randomId = () => Cypress._.random(0, 1e6);
//@ts-ignore
const testname1 = `testname${randomId()}`;
const testname2 = `testname${randomId()}`;
const testname3 = `testname${randomId()}`;

describe("Testing create chart on DX", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();

    cy.intercept("GET", `${apiUrl}/datasets?filter=*`).as("getDatasets");
    cy.get('[data-cy="home-create-chart-button"]').click();
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

    cy.intercept("GET", `${apiUrl}/chart-types/ai-suggestions?id=*`).as(
      "aiSuggestion"
    );

    cy.get('[data-cy="toolbox-chart-next"]').click();
    cy.wait("@aiSuggestion");
    cy.get('[data-cy="ai-agent-switch"]').should("be.checked");
    cy.get('[data-cy="ai-agent-switch"]').click();
    cy.wait(4000);
    cy.get('[data-cy="ai-agent-switch"]').should("not.be.checked");
  });

  it("Can create a bar chart", () => {
    cy.get('[data-cy="chart-type-item"]').contains("Bar chart").click();

    cy.get('[data-cy="chart-type-preview"]')
      .contains("Bar chart")
      .should("be.visible");

    cy.intercept(`${apiUrl}/chart`).as("saveChart");
    cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart");

    cy.location("pathname").should("include", "/mapping");

    cy.get('[data-cy="report-sub-header-title-input"]').type(
      `{selectall}{backspace}${testname1}`
    );

    cy.contains('[data-cy="nonstatic-dimension-container"]', "Bars").within(
      () => {
        cy.get('[data-cy="chart-dimension-select"]').click();
      }
    );

    cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");

    cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();

    cy.wait("@renderChart");

    cy.get('[data-cy="common-chart-container"]').should("be.visible");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    // cy.wait("@renderChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    // cy.wait("@renderChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart2");

    cy.visit("/");

    cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="chart-grid-item"]')
      .contains(testname1)
      .should("be.visible");
  });

  it("Can create a Line Chart", () => {
    cy.get('[data-cy="chart-type-item"]').contains("Line chart").click();

    cy.get('[data-cy="chart-type-preview"]')
      .contains("Line chart")
      .should("be.visible");

    cy.intercept(`${apiUrl}/chart`).as("saveChart");
    cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart");

    cy.location("pathname").should("include", "/mapping");

    cy.get('[data-cy="report-sub-header-title-input"]').type(
      `{selectall}{backspace}${testname2}`
    );
    cy.contains('[data-cy="nonstatic-dimension-container"]', "X Axis").within(
      () => {
        cy.get('[data-cy="chart-dimension-select"]').first().click();
        cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
      }
    );

    cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
    cy.contains('[data-cy="nonstatic-dimension-container"]', "Y Axis").within(
      () => {
        cy.get('[data-cy="chart-dimension-select"]').first().click();

        cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
      }
    );

    cy.wait("@renderChart");

    cy.get('[data-cy="common-chart-container"]').should("be.visible");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    // cy.wait("@renderChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    // cy.wait("@renderChart");

    cy.intercept(`${apiUrl}/chart`).as("saveChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart2");

    cy.visit("/");

    cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="chart-grid-item"]')
      .contains(testname2)
      .should("be.visible");
  });
});

describe("Testing Ai chart creation", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();
    cy.intercept("GET", `${apiUrl}/datasets?filter=*`).as("getDatasets");
    cy.get('[data-cy="home-create-chart-button"]').click();
    cy.wait("@getDatasets");

    cy.intercept("GET", `${apiUrl}/chart/sample-data/*`).as("getDataset");

    cy.contains('[data-cy="dataset-grid-item"]', "Grossing Movies")
      .first()
      .click();

    cy.wait("@getDataset");

    cy.contains("Please select data from Dx");

    cy.get('[data-cy="toolbox-selected-dataset"]')
      .contains("Grossing Movies")
      .should("be.visible");

    cy.intercept("GET", `${apiUrl}/chart-types/ai-suggestions?id=*`).as(
      "aiSuggestion"
    );

    cy.get('[data-cy="toolbox-chart-next"]').click();
  });

  it("Can create a chart with AI", () => {
    cy.wait("@aiSuggestion");

    cy.get('[data-cy="ai-agent-switch"]').should("be.checked");

    cy.intercept(`${apiUrl}/chart`).as("saveChart");
    cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");
    cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");

    cy.get('[data-cy="ai-suggestion-icon"]').filter(":visible").eq(0).click();

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart");
    cy.wait("@renderChart");

    cy.location("pathname").should("include", "/mapping");

    cy.get('[data-cy="report-sub-header-title-input"]').type(
      `{selectall}{backspace}${testname3}`
    );

    cy.get('[data-cy="common-chart-container"]').should("be.visible");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    // cy.wait("@renderChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    // cy.wait("@renderChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart2");

    cy.visit("/");

    cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.wait("@fetchCharts");

    cy.contains('[data-cy="chart-grid-item"]', `${testname3}`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="chart-grid-item-ai-icon"]').should("be.visible");
      });
  });
});

describe("Edit, duplicate and delete chart", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();

    cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.wait("@fetchCharts");
  });

  it("Can Edit a chart", () => {
    cy.contains('[data-cy="chart-grid-item"]', testname1)
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

    cy.get('[data-cy="chart-toolbox-mapping-tab"]').click();

    cy.contains('[data-cy="nonstatic-dimension-container"]', "Bars").within(
      () => {
        cy.get('[data-cy="chart-dimension-mapping-item"]').click();
      }
    );

    cy.get('[data-cy="chart-dimension-mapping-item"]').eq(2).click();

    cy.wait("@renderChart2");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    // cy.wait("@renderChart2");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    // cy.wait("@renderChart2");

    cy.intercept(`${apiUrl}/chart/*`).as("saveChart");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart");
  });

  it("Can Duplicate a chart", () => {
    cy.intercept(`${apiUrl}/chart/duplicate/*`).as("duplicateChart");

    cy.contains('[data-cy="chart-grid-item"]', testname1)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="chart-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="chart-grid-item-duplicate-btn"]').click();
    cy.wait("@duplicateChart");

    cy.wait("@fetchCharts");

    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=home-search-input]").type(
      `{selectall}{backspace}${testname1}`
    );
    cy.wait("@fetchCharts");

    cy.contains('[data-cy="chart-grid-item"]', `${testname1} (Copy)`)
      .scrollIntoView()
      .should("be.visible");
  });

  it("Can Delete a chart", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=home-search-input]").type(
      `{selectall}{backspace}${testname1}`
    );
    cy.wait("@fetchCharts");
    cy.contains('[data-cy="chart-grid-item"]', `${testname1} (Copy)`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="chart-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="chart-grid-item-delete-btn"]').click();
    cy.intercept("DELETE", `${apiUrl}/chart/*`).as("deleteChart");

    cy.get('[data-cy="delete-chart-item-form"]').within(() => {
      cy.get('[data-cy="delete-chart-item-input"]').type("DELETE{enter}");
    });

    cy.wait("@deleteChart");

    cy.wait("@fetchCharts");

    // cy.get('[data-cy="chart-grid-item"]')
    //   .contains("Soccer Players (Copy)")
    //   .should("not.exist");

    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=home-search-input]").type(
      `{selectall}{backspace}${testname2}`
    );
    cy.wait("@fetchCharts");

    cy.contains('[data-cy="chart-grid-item"]', `${testname2}`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="chart-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="chart-grid-item-delete-btn"]').click();
    cy.intercept("DELETE", `${apiUrl}/chart/*`).as("deleteChart");

    cy.get('[data-cy="delete-chart-item-form"]').within(() => {
      cy.get('[data-cy="delete-chart-item-input"]').type("DELETE{enter}");
    });

    cy.wait("@deleteChart");

    cy.wait("@fetchCharts");

    // cy.get('[data-cy="chart-grid-item"]')
    //   .contains("Soccer Players (Copy)")
    //   .should("not.exist");

    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=home-search-input]").type(
      `{selectall}{backspace}${testname3}`
    );
    cy.wait("@fetchCharts");

    cy.contains('[data-cy="chart-grid-item"]', `${testname3}`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="chart-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="chart-grid-item-delete-btn"]').click();
    cy.intercept("DELETE", `${apiUrl}/chart/*`).as("deleteChart");

    cy.get('[data-cy="delete-chart-item-form"]').within(() => {
      cy.get('[data-cy="delete-chart-item-input"]').type("DELETE{enter}");
    });

    cy.wait("@deleteChart");

    cy.wait("@fetchCharts");
  });
});
