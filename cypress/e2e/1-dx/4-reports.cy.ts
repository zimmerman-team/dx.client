/// <reference types="cypress" />

/* TESTS TO COVER

- Create Report - Done
- Edit Report - Done
- Delete Report - Done
- Duplicate Report - Done

*/
//@ts-ignore
const randomId = () => Cypress._.random(0, 1e6);
//@ts-ignore
const reportTestName = `report-testname${randomId()}`;
const chartTestName = `chart-testname${randomId()}`;

describe("Testing reports on DX", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    // restoring login cache
    cy.restoreLocalStorageCache();

    // Navigating to dx home page
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("Can Create report", () => {
    cy.get('[data-cy="home-create-report-button"]').click();

    cy.contains(
      '[data-cy="report-template-card"]',
      "Blank template report"
    ).within(() => {
      cy.get('[data-cy="use-report-template-button"]').click();
    });

    cy.contains("Untitled report", { timeout: 2000 }).should("be.hidden");

    cy.get('[data-cy="skip-tour-button"]').click();

    cy.get('[data-cy="report-sub-header-title-input"]').type(reportTestName);

    cy.get('[data-cy="report-header-block"]').within(() => {
      cy.get('[data-cy="report-header-block-title-input"]').type(
        reportTestName
      );
      cy.get('[data-cy="rich-text-editor-container"]').click();
      cy.get('[data-testid="rich-text-editor"]').type(
        "This is a report on football players"
      );
    });

    cy.intercept(`${apiUrl}/report/*`).as("fetchReport");
    cy.intercept(`${apiUrl}/reports?filter=*`).as("fetchReports");

    cy.intercept("PATCH", `${apiUrl}/report/*`).as("patchReport");

    cy.get('[data-cy="empty-row-frame"]')
      .first()
      .within(() => {
        cy.get('[data-cy="one-by-two-type"]').click({ timeout: 2000 });
      });

    cy.intercept(`${apiUrl}/charts?filter=*`).as("fetchCharts");

    // Drop Text item

    cy.get('[data-cy="report-panel-media-tab"]').click();
    cy.wait(1000);
    cy.get('[data-cy="row-frame-item-drop-zone-0-0"]').scrollIntoView();

    cy.get('[data-cy="report-panel-text-item"]').first().drag();
    cy.get('[data-cy="row-frame-item-drop-zone-0-0"]').drop();

    cy.get("[data-cy=row-frame-0]").within(() => {
      cy.get('[data-testid="rich-text-editor"]')
        .first()
        .type(
          "This is a report on football players who played in a match last year"
        );
    });

    // Drag and drop chart item

    cy.get('[data-cy="report-panel-chart-tab"]').click();
    cy.get('[data-cy="report-panel-chart-tab"]').click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="row-frame-item-drop-zone-0-1"]');

    cy.get('[data-cy="report-panel-chart-item"]').first().drag();
    cy.get('[data-cy="row-frame-item-drop-zone-0-1"]').drop();

    // Drag and drop video item

    cy.intercept(`${apiUrl}/youtube/search**`).as("fetchYoutubeVideos");
    cy.get('[data-cy="add-row-frame-button"]').scrollIntoView().click();

    cy.get('[data-cy="empty-row-frame"]')
      .first()
      .within(() => {
        cy.get('[data-cy="one-by-one-type"]').click({ timeout: 2000 });
      });

    cy.get('[data-cy="report-panel-media-tab"]').click();

    cy.wait("@fetchYoutubeVideos");

    cy.get('[data-cy="report-panel-video-item"]').click();
    cy.get('[data-cy="video-frame"]').first().drag();
    cy.get('[data-cy="row-frame-item-drop-zone-1-0"]').scrollIntoView().drop();

    cy.get('[data-cy="report-video-content"]')
      .scrollIntoView()
      .should("be.visible");

    // Drag and drop image item

    cy.intercept(`${apiUrl}/unsplash/image/search**`).as("fetchUnsplashImages");
    cy.get('[data-cy="add-row-frame-button"]').scrollIntoView().click();

    cy.get('[data-cy="empty-row-frame"]')
      .first()
      .within(() => {
        cy.get('[data-cy="one-by-one-type"]').click({ timeout: 2000 });
      });
    cy.get('[data-cy="report-panel-chart-tab"]').click();
    cy.get('[data-cy="report-panel-chart-tab"]').click();
    cy.get('[data-cy="report-panel-media-tab"]').click();

    cy.wait("@fetchUnsplashImages");

    cy.get('[data-cy="report-panel-image-item"]').click();
    cy.get('[data-cy="image-frame"]').first().drag();
    cy.get('[data-cy="row-frame-item-drop-zone-2-0"]').scrollIntoView().drop();

    cy.get('[data-cy="report-image-content"]')
      .scrollIntoView()
      .should("be.visible");

    // Save the report

    cy.get('[data-cy="save-report-button"]').click();

    cy.wait("@patchReport");

    cy.get('[data-cy="view-report-button"]').click();

    cy.wait("@fetchReport");

    cy.visit("/");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.get('[data-cy="home-reports-tab"]').scrollIntoView().click();

    cy.wait("@fetchReports");

    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");

    cy.contains(reportTestName).should("be.visible");
  });
});

describe("Edit, duplicate and delete report", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();

    cy.intercept(`${apiUrl}/reports?filter=*`).as("fetchReports");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();
    cy.get('[data-cy="home-reports-tab"]').scrollIntoView().click();

    cy.wait("@fetchReports");
  });

  it("Can Edit a report", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");
    cy.contains('[data-cy="report-grid-item"]', reportTestName)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="report-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/report/*`).as("fetchReport");
    cy.intercept("PATCH", `${apiUrl}/report/*`).as("patchReport");

    cy.get('[data-cy="report-grid-item-edit-btn"]').click();

    cy.wait("@fetchReport");

    cy.get('[data-cy="report-sub-header-title-input"]').type(" - Edited");

    cy.get('[data-cy="report-header-block"]').within(() => {
      cy.get('[data-cy="report-header-block-title-input"]').type(" - Edited");
      cy.get('[data-cy="rich-text-editor-container"]').click();
      cy.get('[data-testid="rich-text-editor"]').type(" - Edited");
    });

    cy.get('[data-cy="save-report-button"]').click();

    cy.wait("@patchReport");

    cy.get('[data-cy="view-report-button"]').click();

    cy.wait("@fetchReport");

    cy.visit("/");
    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.get('[data-cy="home-reports-tab"]').scrollIntoView().click();

    cy.wait("@fetchReports");

    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");

    cy.contains(`${reportTestName} - Edited`).should("be.visible");
  });

  it("Can drag and drop rows in a report", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");

    cy.contains('[data-cy="report-grid-item"]', `${reportTestName} - Edited`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="report-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/report/*`).as("fetchReport");

    cy.get('[data-cy="report-grid-item-edit-btn"]').click();

    cy.wait("@fetchReport");

    cy.get('[data-cy="row-frame-container-0"]').within(() => {
      cy.get('[data-cy="row-frame-handle"]').drag();
    });
    cy.get('[data-cy="report-row-placeholder"]').eq(2).scrollIntoView().drop();
  });

  it("Can Duplicate a report", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");

    cy.contains('[data-cy="report-grid-item"]', `${reportTestName} - Edited`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="report-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="report-grid-item-duplicate-btn"]').click();

    cy.wait("@fetchReports");

    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");

    cy.get('[data-cy="report-grid-item"]')
      .contains(`${reportTestName} - Edited (Copy)`)
      .should("be.visible");
  });

  it("Can Create a chart from a report", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");

    cy.contains(
      '[data-cy="report-grid-item"]',
      `${reportTestName} - Edited (Copy)`
    )
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="report-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/report/*`).as("fetchReport");

    cy.get('[data-cy="report-grid-item-edit-btn"]').click();

    cy.wait("@fetchReport");

    cy.intercept("GET", `${apiUrl}/datasets?filter=*`).as("getDatasets");
    cy.get('[data-cy="report-panel-create-chart-card"]').click();
    cy.wait("@getDatasets");
    cy.intercept("GET", `${apiUrl}/chart/sample-data/*`).as("getDataset");

    cy.contains('[data-cy="dataset-grid-item"]', "Grossing Movies")
      .first()
      .click();

    cy.wait("@getDataset");

    cy.contains("Please select a dataset");

    cy.get('[data-cy="toolbox-selected-dataset"]')
      .contains("Grossing Movies")
      .should("be.visible");

    cy.intercept("GET", `${apiUrl}/chart-types/ai-suggestions?id=*`).as(
      "aiSuggestion"
    );

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@aiSuggestion");
    cy.get('[data-cy="ai-agent-switch"]').scrollIntoView();
    cy.get('[data-cy="ai-agent-switch"]').should("be.checked");
    cy.get('[data-cy="ai-agent-switch"]').click();

    cy.wait(4000);
    cy.get('[data-cy="ai-agent-switch"]').should("not.be.checked");

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
      `{selectall}{backspace}${chartTestName}`
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

    cy.intercept(`${apiUrl}/charts?filter=*`).as("fetchCharts");

    cy.get('[data-cy="back-to-report-button"]').click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="report-panel-chart-search-input"]').type(chartTestName);
    cy.wait("@fetchCharts");

    cy.contains('[data-cy="report-panel-chart-item"]', chartTestName).should(
      "be.visible"
    );
  });

  it("Can edit a chart from a report", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");

    cy.contains(
      '[data-cy="report-grid-item"]',
      `${reportTestName} - Edited (Copy)`
    )
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="report-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/report/*`).as("fetchReport");

    cy.get('[data-cy="report-grid-item-edit-btn"]').click();

    cy.wait("@fetchReport");

    cy.intercept(`${apiUrl}/chart/*`).as("renderChart");
    cy.intercept(`${apiUrl}/chart/*/render`).as("renderChart2");

    cy.get('[data-cy="row-frame-chart-item-0-1"]')
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-cy="edit-chart-button"]').click();
      });

    cy.wait("@renderChart");
    cy.wait("@renderChart2");

    cy.get('[data-cy="chart-toolbox-mapping-tab"]')
      .invoke("attr", "disabled", false)
      .trigger("mouseover")
      .click();

    cy.get('[data-cy="chart-toolbox-mapping-tab"]').click();

    cy.location("pathname").should("include", "/mapping");
    cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

    cy.get('[data-cy="report-sub-header-title-input"]').type(
      `{selectall}{backspace}${chartTestName}-Edited`
    );

    cy.get('[data-cy="nonstatic-dimension-container"]')
      .first()
      .within(() => {
        cy.get('[data-cy="chart-dimension-mapping-item"]').click();
      });

    cy.get('[data-cy="chart-dimension-mapping-item"]').eq(2).click();

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

    cy.intercept(`${apiUrl}/charts?filter=*`).as("fetchCharts");

    cy.get('[data-cy="back-to-report-button"]').click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="report-panel-chart-search-input"]').type(
      `${chartTestName}-Edited`
    );
    cy.wait("@fetchCharts");

    cy.contains(
      '[data-cy="report-panel-chart-item"]',
      `${chartTestName}-Edited`
    ).should("be.visible");
  });

  it("Can delete a report", () => {
    cy.intercept("DELETE", `${apiUrl}/report/*`).as("deleteReport");

    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");

    cy.contains(
      '[data-cy="report-grid-item"]',
      `${reportTestName} - Edited (Copy)`
    )
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="report-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="report-grid-item-delete-btn"]').click();

    cy.get('[data-cy="delete-report-item-form"]').within(() => {
      cy.get('[data-cy="delete-report-item-input"]').type("DELETE{enter}");
    });

    cy.wait("@deleteReport");

    cy.wait("@fetchReports");

    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");

    cy.get('[data-cy="report-grid-item"]')
      .contains(`${reportTestName} - Edited (Copy)`)
      .should("not.exist");

    // Delete the edited report

    cy.contains('[data-cy="report-grid-item"]', `${reportTestName} - Edited`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="report-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="report-grid-item-delete-btn"]').click();

    cy.get('[data-cy="delete-report-item-form"]').within(() => {
      cy.get('[data-cy="delete-report-item-input"]').type("DELETE{enter}");
    });

    cy.wait("@deleteReport");

    cy.wait("@fetchReports");

    cy.get("[data-cy=home-search-button]").click();
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${reportTestName}`
    );

    cy.wait("@fetchReports");

    cy.contains(`${reportTestName} - Edited`).should("not.exist");
  });
});
