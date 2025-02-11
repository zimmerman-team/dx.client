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
    cy.intercept("GET", `${apiUrl}/users/plan-data`).as("planData");

    cy.visit("/");

    cy.wait("@planData");

    cy.get('[data-cy="cookie-btn"]').click();

    cy.intercept("GET", `${apiUrl}/datasets?**`).as("getDatasets");
    cy.get('[data-cy="home-create-chart-button"]').click();
    cy.wait("@getDatasets");

    cy.intercept("GET", `${apiUrl}/chart/sample-data/*`).as("getDataset");

    cy.contains('[data-cy="dataset-grid-item"]', "Soccer Players")
      .first()
      .click();

    cy.wait("@getDataset");

    cy.contains("Please select a dataset");

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
    cy.get('[data-cy="chart-type-item"]').contains("Bar Chart").first().click();

    cy.get('[data-cy="chart-type-preview"]')
      .contains("Bar Chart")
      .should("be.visible");

    cy.intercept(`${apiUrl}/chart`).as("saveChart");
    cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");
    cy.intercept("GET", `${apiUrl}/chart/*`).as("getChart2");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart");

    cy.location("pathname").should("include", "/mapping");
    cy.wait("@saveChart2");
    cy.wait("@getDataset");
    cy.wait("@planData");

    cy.get('[data-cy="story-sub-header-title-input"]').type(
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

    //test for filtering
    cy.get('[data-cy="filter-group"]').first().click();
    cy.get('input[name="search-input"]').type("test");
    cy.wait(2000);
    cy.get('input[name="search-input"]').type("{selectall}{backspace}");
    cy.get('[data-cy="select-all-filters-checkbox"]').click();
    cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
      cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
    });
    cy.get('[data-cy="select-all-filters-checkbox"]').click();
    cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
      cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
    });
    cy.get('[data-cy="filter-option-checkbox"]').first().click();
    cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
    cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
    cy.contains("button", "Apply").click();

    cy.wait("@renderChart");
    cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
    cy.wait("@renderChart");

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

  //   it("Can create a Line Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Line Chart").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Line Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");
  //     cy.wait("@saveChart2");
  //     cy.wait("@getDataset");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "X Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Y Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Pie Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Pie Chart").click();
  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Pie Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");
  //     cy.wait("@saveChart2");
  //     cy.wait("@getDataset");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Category").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Value").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Scatter Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Scatter Chart").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Scatter Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");
  //     cy.wait("@saveChart2");
  //     cy.wait("@getDataset");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "X Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Y Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });
  //   it("Can create a Geo Map", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Geo map").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Geo map")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");
  //     cy.wait("@saveChart2");
  //     cy.wait("@getDataset");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Country").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Size").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(2).click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Sankey Diagram", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Sankey Diagram").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Sankey Diagram")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Steps").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Steps").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(3).click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Size").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(4).click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Multi-Set Bar chart", () => {
  //     cy.get('[data-cy="chart-type-item"]')
  //       .contains("Multi-set Bar chart")
  //       .click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Multi-set Bar chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");
  //     cy.wait("@saveChart2");
  //     cy.wait("@getDataset");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );

  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Bars").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(1).click();
  //       }
  //     );

  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Sizes").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );
  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.wait("@renderChart");

  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Sizes").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(3).click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Stacked Bar Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Stacked Bar Chart").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Stacked Bar Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");
  //     cy.wait("@saveChart2");
  //     cy.wait("@getDataset");
  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );

  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Bars").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(1).click();
  //       }
  //     );

  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Sizes").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );
  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.wait("@renderChart");

  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Sizes").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(3).click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Line Stacked Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]')
  //       .contains("Line Stacked Chart")
  //       .click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Line Stacked Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "X Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Y Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Tree Map", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Tree Map").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Tree Map")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains(
  //       '[data-cy="nonstatic-dimension-container"]',
  //       "Hierarchy"
  //     ).within(() => {
  //       cy.get('[data-cy="chart-dimension-select"]').first().click();
  //       cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //     });
  //     cy.contains(
  //       '[data-cy="nonstatic-dimension-container"]',
  //       "Hierarchy"
  //     ).within(() => {
  //       cy.get('[data-cy="chart-dimension-select"]').first().click();
  //       cy.get('[data-cy="chart-dimension-mapping-item"]').eq(3).click();
  //     });

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Size").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(4).click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Sunburst Diagram", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Sunburst Diagram").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Sunburst Diagram")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains(
  //       '[data-cy="nonstatic-dimension-container"]',
  //       "Hierarchy"
  //     ).within(() => {
  //       cy.get('[data-cy="chart-dimension-select"]').first().click();
  //       cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //     });
  //     cy.contains(
  //       '[data-cy="nonstatic-dimension-container"]',
  //       "Hierarchy"
  //     ).within(() => {
  //       cy.get('[data-cy="chart-dimension-select"]').first().click();
  //       cy.get('[data-cy="chart-dimension-mapping-item"]').eq(3).click();
  //     });

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Size").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(4).click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });
  //   it("Can create a Circular Network Graph", () => {
  //     cy.get('[data-cy="chart-type-item"]')
  //       .contains("Circular Network Graph")
  //       .click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Circular Network Graph")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Node").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Links").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(3).click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a  Network Graph", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Network Graph").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Network Graph")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Node").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Links").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(3).click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Graph GL Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Graph GL Chart").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Graph GL Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Node").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Links").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(3).click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Big number", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Big number").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Big number")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Metric").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(2).click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.contains(
  //       '[data-cy="static-dimension-container"]',
  //       "Main KPI Metric"
  //     ).within(() => {
  //       cy.get("textarea").type("test");
  //     });

  //     cy.wait("@renderChart");

  //     cy.contains('[data-cy="static-dimension-container"]', "Header").within(
  //       () => {
  //         cy.get("textarea").type("test header");
  //       }
  //     );
  //     cy.wait("@renderChart");

  //     cy.contains('[data-cy="static-dimension-container"]', "Sub Header").within(
  //       () => {
  //         cy.get("textarea").type("Sub Header");
  //       }
  //     );
  //     cy.wait("@renderChart");

  //     cy.contains(
  //       '[data-cy="static-dimension-container"]',
  //       "Unit Of Measurement"
  //     ).within(() => {
  //       cy.get("textarea").type("Unit Of Measurement");
  //     });

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Circle Packing Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]')
  //       .contains("Circle Packing Chart")
  //       .click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Circle Packing Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains(
  //       '[data-cy="nonstatic-dimension-container"]',
  //       "Hierarchy"
  //     ).within(() => {
  //       cy.get('[data-cy="chart-dimension-select"]').first().click();
  //       cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //     });
  //     cy.contains(
  //       '[data-cy="nonstatic-dimension-container"]',
  //       "Hierarchy"
  //     ).within(() => {
  //       cy.get('[data-cy="chart-dimension-select"]').first().click();
  //       cy.get('[data-cy="chart-dimension-mapping-item"]').eq(3).click();
  //     });

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Size").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(4).click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Heatmap Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Heatmap Chart").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Heatmap Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "X Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Y Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });
  //   it("Can create a Bubble Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Bubble Chart").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Bubble Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "X Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Y Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });

  //   it("Can create a Radar Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]').contains("Radar Chart").click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Radar Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");
  //     cy.wait("@saveChart2");
  //     cy.wait("@getDataset");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains(
  //       '[data-cy="nonstatic-dimension-container"]',
  //       "Dimensions"
  //     ).within(() => {
  //       cy.get('[data-cy="chart-dimension-select"]').first().click();
  //       cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //     });
  //     cy.contains(
  //       '[data-cy="nonstatic-dimension-container"]',
  //       "Dimensions"
  //     ).within(() => {
  //       cy.get('[data-cy="chart-dimension-select"]').first().click();
  //       cy.get('[data-cy="chart-dimension-mapping-item"]').eq(3).click();
  //     });
  //     cy.contains(
  //       '[data-cy="nonstatic-dimension-container"]',
  //       "Dimensions"
  //     ).within(() => {
  //       cy.get('[data-cy="chart-dimension-select"]').first().click();
  //       cy.get('[data-cy="chart-dimension-mapping-item"]').eq(2).click();
  //     });
  //     cy.wait("@renderChart");

  //     // cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Category").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').eq(4).click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });
  //   it("Can create a Area Time Axis Chart", () => {
  //     cy.get('[data-cy="chart-type-item"]')
  //       .contains("Area Time Axis Chart")
  //       .click();

  //     cy.get('[data-cy="chart-type-preview"]')
  //       .contains("Area Time Axis Chart")
  //       .should("be.visible");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname2}`
  //     );
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "X Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();
  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");
  //     cy.contains('[data-cy="nonstatic-dimension-container"]', "Y Axis").within(
  //       () => {
  //         cy.get('[data-cy="chart-dimension-select"]').first().click();

  //         cy.get('[data-cy="chart-dimension-mapping-item"]').first().click();
  //       }
  //     );

  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     //test for filtering
  //     cy.get('[data-cy="filter-group"]').first().click();
  //     cy.get('input[name="search-input"]').type("test");
  //     cy.wait(2000);
  //     cy.get('input[name="search-input"]').type("{selectall}{backspace}");
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("be.checked");
  //     });
  //     cy.get('[data-cy="select-all-filters-checkbox"]').click();
  //     cy.get('[data-cy="filter-option-checkbox"]').each(($el, index) => {
  //       cy.wrap($el).find('input[type="checkbox"]').should("not.be.checked");
  //     });
  //     cy.get('[data-cy="filter-option-checkbox"]').first().click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(1).click();
  //     cy.get('[data-cy="filter-option-checkbox"]').eq(2).click();
  //     cy.contains("button", "Apply").click();

  //     cy.wait("@renderChart");
  //     cy.get('[data-cy="reset-filters"]').scrollIntoView().click();
  //     cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.get('[data-cy="chart-grid-item"]')
  //       .contains(testname2)
  //       .should("be.visible");
  //   });
  // });

  // describe("Testing Ai chart creation", () => {
  //   const apiUrl = Cypress.env("api_url");

  //   beforeEach(() => {
  //     cy.restoreLocalStorageCache();
  //     cy.intercept("GET", `${apiUrl}/users/plan-data`).as("planData");

  //     cy.visit("/");

  //     cy.wait("@planData");

  //     cy.get('[data-cy="cookie-btn"]').click();
  //     cy.intercept("GET", `${apiUrl}/datasets?**`).as("getDatasets");
  //     cy.get('[data-cy="home-create-chart-button"]').click();
  //     cy.wait("@getDatasets");

  //     cy.intercept("GET", `${apiUrl}/chart/sample-data/*`).as("getDataset");

  //     cy.contains('[data-cy="dataset-grid-item"]', "Grossing Movies")
  //       .first()
  //       .click();

  //     cy.wait("@getDataset");

  //     cy.contains("Please select a dataset");

  //     cy.get('[data-cy="toolbox-selected-dataset"]')
  //       .contains("Grossing Movies")
  //       .should("be.visible");

  //     cy.intercept("GET", `${apiUrl}/chart-types/ai-suggestions?id=*`).as(
  //       "aiSuggestion"
  //     );

  //     cy.get('[data-cy="toolbox-chart-next"]').click();
  //   });

  //   it("Can create a chart with AI", () => {
  //     cy.wait("@aiSuggestion");

  //     cy.get('[data-cy="ai-agent-switch"]').should("be.checked");

  //     cy.intercept(`${apiUrl}/chart`).as("saveChart");
  //     cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");
  //     cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart");

  //     cy.get('[data-cy="ai-suggestion-icon"]').filter(":visible").eq(0).click();

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart");
  //     cy.wait("@renderChart");

  //     cy.location("pathname").should("include", "/mapping");

  //     cy.get('[data-cy="story-sub-header-title-input"]').type(
  //       `{selectall}{backspace}${testname3}`
  //     );

  //     cy.get('[data-cy="common-chart-container"]').should("be.visible");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     // cy.wait("@renderChart");

  //     cy.get('[data-cy="toolbox-chart-next"]').click();

  //     cy.wait("@saveChart2");

  //     cy.visit("/");

  //     cy.intercept("GET", `${apiUrl}/charts*`).as("fetchCharts");

  //     cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

  //     cy.wait("@fetchCharts");

  //     cy.contains('[data-cy="chart-grid-item"]', `${testname3}`)
  //       .first()
  //       .scrollIntoView()
  //       .within(() => {
  //         cy.get('[data-cy="chart-grid-item-ai-icon"]').should("be.visible");
  //       });
  //   });
});

describe("Edit, duplicate and delete chart", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.intercept("GET", `${apiUrl}/users/plan-data`).as("planData");

    cy.visit("/");

    cy.wait("@planData");

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
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${testname1}`
    );
    cy.wait("@fetchCharts");

    cy.contains('[data-cy="chart-grid-item"]', `${testname1} (Copy)`)
      .scrollIntoView()
      .should("be.visible");
  });

  it("Can Delete a chart", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
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
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
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
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
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
