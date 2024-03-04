/// <reference types="cypress" />

/* TESTS TO COVER

- Create Report - Done
- Edit Report - Done
- Delete Report - Done
- Duplicate Report - Done

*/

describe("Testing reports on DX", () => {
  const apiUrl = Cypress.env("api_url");
  const baseUrl = Cypress.env("base_url");
  beforeEach(() => {
    // restoring login cache
    cy.restoreLocalStorageCache();

    // Navigating to dx home page
    cy.visit(baseUrl);

    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("Create report", () => {
    cy.get('[data-cy="appbar-create-report/login"]').click();

    cy.contains(
      '[data-cy="report-template-card"]',
      "Blank template report"
    ).within(() => {
      cy.get('[data-cy="use-report-template-button"]').click();
    });

    cy.contains("Untitled report", { timeout: 2000 }).should("be.hidden");

    cy.get('[data-cy="report-sub-header-title-input"]').type(
      "Football Players Report"
    );

    cy.get('[data-cy="report-header-block"]').within(() => {
      cy.get('[data-cy="report-header-block-title-input"]').type(
        "The football players report"
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

    // Drop Element

    // cy.get('[data-cy="report-panel-elements-tab"]').click();

    // cy.get('[data-cy="report-panel-rowFrame-item"]')
    //   .first()
    //   .drag('[data-cy="report-row-placeholder"]');

    // Drop Text item

    // cy.get('[data-cy="report-panel-media-tab"]').click();
    // cy.wait(1000);
    // cy.get('[data-cy="row-frame-item-drop-zone-0-0"]').scrollIntoView();

    // cy.get('[data-cy="report-panel-text-item"]')
    //   .first()
    //   .drag('[data-cy="row-frame-item-drop-zone-0-0"]');

    // Drag and drop chart item

    cy.get('[data-cy="report-panel-chart-tab"]').click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="row-frame-item-drop-zone-0-1"]').scrollIntoView();

    cy.get('[data-cy="report-panel-chart-item"]')
      .first()
      .drag('[data-cy="row-frame-item-drop-zone-0-1"]');

    cy.get('[data-cy="row-frame-item-drop-zone-0-0"]').scrollIntoView();

    cy.get('[data-cy="report-panel-chart-item"]')
      .eq(1)
      .drag('[data-cy="row-frame-item-drop-zone-0-0"]');

    cy.get('[data-cy="save-report-button"]').click();

    cy.wait("@patchReport");

    cy.get('[data-cy="view-report-button"]').click();

    cy.wait("@fetchReport");

    cy.visit(baseUrl);
    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.get('[data-cy="home-reports-tab"]').scrollIntoView().click();

    cy.wait("@fetchReports");

    cy.contains("Football Players Report").should("be.visible");
  });
});

describe("Edit, duplicate and delete report", () => {
  const apiUrl = Cypress.env("api_url");
  const baseUrl = Cypress.env("base_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit(baseUrl);

    cy.get('[data-cy="cookie-btn"]').click();

    cy.intercept(`${apiUrl}/reports?filter=*`).as("fetchReports");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();
    cy.get('[data-cy="home-reports-tab"]').scrollIntoView().click();

    cy.wait("@fetchReports");
  });

  it("Edit report", () => {
    cy.contains('[data-cy="report-grid-item"]', "Football Players Report")
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

    cy.visit(baseUrl);
    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.get('[data-cy="home-reports-tab"]').scrollIntoView().click();

    cy.wait("@fetchReports");

    cy.contains("Football Players Report - Edited").should("be.visible");
  });

  it("Duplicate report", () => {
    cy.contains(
      '[data-cy="report-grid-item"]',
      "Football Players Report - Edited"
    )
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="report-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="report-grid-item-duplicate-btn"]').click();

    cy.wait("@fetchReports");

    cy.get('[data-cy="report-grid-item"]')
      .contains("Football Players Report - Edited (Copy)")
      .should("be.visible");
  });

  it("Delete report", () => {
    cy.intercept("DELETE", `${apiUrl}/report/*`).as("deleteReport");

    cy.contains(
      '[data-cy="report-grid-item"]',
      "Football Players Report - Edited (Copy)"
    )
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="report-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="report-grid-item-delete-btn"]').click();

    cy.get('[data-cy="delete-report-item-form"]').within(() => {
      cy.get('[data-cy="delete-report-item-input"]').type("DELETE {enter}");
    });

    cy.wait("@deleteReport");

    cy.wait("@fetchReports");

    cy.get('[data-cy="report-grid-item"]')
      .contains("Football Players Report - Edited (Copy)")
      .should("not.exist");

    // Delete the edited report
    cy.contains(
      '[data-cy="report-grid-item"]',
      "Football Players Report - Edited"
    )
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="report-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="report-grid-item-delete-btn"]').click();

    cy.get('[data-cy="delete-report-item-form"]').within(() => {
      cy.get('[data-cy="delete-report-item-input"]').type("DELETE {enter}");
    });

    cy.wait("@deleteReport");

    cy.wait("@fetchReports");

    cy.get('[data-cy="report-grid-item"]')
      .contains("Football Players Report - Edited")
      .should("not.exist");
  });
});
