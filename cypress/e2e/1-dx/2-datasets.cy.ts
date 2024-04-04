/// <reference types="cypress" />

/* TESTS TO COVER

- Local Upload Dataset - Done
- External Search Upload Dataset - Done
- Google Drive Upload Dataset - Can't be tested for now - Google login doesn't work on test controlled environments

- Edit Dataset - Done
- Delete Dataset - Done
- Duplicate Dataset - Done

*/

describe("Testing connecting data on DX", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.setGoogleAccessToken();

    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();

    cy.get('[data-cy="create-report-dropdown"]').click();
    cy.get('[data-cy="appbar-connect-data"]').click();
  });

  it("External search upload", () => {
    cy.intercept(`${apiUrl}/external-sources/search-limited?q=*`).as(
      "getDefaultData"
    );
    cy.get('[data-cy="external-search-button"]').click();

    cy.wait("@getDefaultData").then((interception) => {
      cy.get('[data-cy="external-search-card"]').should(
        "have.length.greaterThan",
        1
      );
    });

    cy.get('[data-cy="open-search-button"]').click();
    cy.intercept(`${apiUrl}/external-sources/search-limited?q=Youth*`).as(
      "getDefaultData2"
    );
    cy.get('[data-cy="filter-search-input"]').type("Youth");

    cy.wait("@getDefaultData2").then((interception) => {
      cy.get('[data-cy="external-search-card"]').should(
        "have.length.greaterThan",
        1
      );
    });

    cy.intercept(`${apiUrl}/external-sources/download`).as("downloadData");
    cy.get('[data-cy="external-search-card"]')
      .first()
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-cy="import-to-dx-button"]').click();
      });
    cy.wait("@downloadData");

    cy.get('[data-cy="dataset-metadata-title"]').type(
      "{selectall}{backspace} External Dataset"
    );
    cy.get('[data-cy="dataset-metadata-description"]').type(
      "{selectall}{backspace} External Dataset"
    );
    cy.get('[data-cy="dataset-metadata-source"]').type(
      "{selectall}{backspace} Rawgraphs"
    );
    cy.get('[data-cy="dataset-metadata-link"]').type(
      "{selectall}{backspace} Not available"
    );
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept(`${apiUrl}/datasets`).as("submitData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@submitData");
    cy.contains("External Dataset").should("be.visible");
  });

  it("Google Drive Upload", () => {
    cy.intercept(
      "https://www.googleapis.com/drive/v3/files/1ZMtAYFviJrhITddRe7ulDNGCL5F0Rur7?alt=media"
    ).as("googleDrivePicker");

    // Assuming your application has a function that's called when a file is selected from the picker
    cy.visit("/dataset/new/upload");
    cy.window().then((win) => {
      // Manually trigger the callback function with mock data
      const mockFileData = {
        id: "1ZMtAYFviJrhITddRe7ulDNGCL5F0Rur7",
        name: "WineQT.csv",
        kind: "drive#file",
        mimeType: "text/csv",
        type: "file",
        // Add any other properties your callback function expects
      };
      // Assuming your callback function is named "handlePickerSelection"
      // @ts-ignore
      win.handleGoogleDriveFilePicker(
        mockFileData,
        localStorage.getItem("google_access_token")
      );
    });
    cy.wait(`@googleDrivePicker`);

    cy.get('[data-cy="dataset-metadata-title"]').type("Wine Tasting");

    cy.get('[data-cy="dataset-metadata-description"]').type("Wine Tasting");
    cy.get('[data-cy="dataset-metadata-source"]').type("Rawgraphs");
    cy.get('[data-cy="dataset-metadata-link"]').type("Not available");
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept(`${apiUrl}/datasets`).as("submitData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@submitData");
    cy.contains("Wine Tasting").should("be.visible");
  });

  it("Local Upload", () => {
    cy.get('[data-cy="local-upload-input"]').as("fileInput");
    cy.fixture("football-players.csv").then((fileContent) => {
      cy.get("@fileInput").attachFile({
        fileContent: fileContent.toString(),
        fileName: "football-players.csv",
        mimeType: "text/csv",
      });
    });
    cy.get('[data-cy="dataset-metadata-title"]').type("Football Players");
    cy.get('[data-cy="dataset-metadata-description"]').type(
      "Football Players Data"
    );
    cy.get('[data-cy="dataset-metadata-source"]').type("Rawgraphs");
    cy.get('[data-cy="dataset-metadata-link"]').type("Not available");
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept(`${apiUrl}/datasets`).as("submitData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@submitData");
    cy.contains("Football Players").should("be.visible");
  });
});

describe("Edit, Delete and Duplicate Dataset", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/");
    cy.get('[data-cy="cookie-btn"]').click();

    cy.intercept("GET", `${apiUrl}/datasets?filter=*`).as("fetchDatasets");

    cy.get('[data-cy="home-data-tab"]').scrollIntoView().click();

    cy.wait("@fetchDatasets");
  });

  it("Edit Dataset", () => {
    cy.contains('[data-cy="dataset-grid-item"]', "Football Players")
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
      });
    cy.intercept("GET", `${apiUrl}/datasets/*`).as("fetchDataset");
    cy.get('[data-cy="dataset-grid-item-edit-btn"]').click();

    cy.wait("@fetchDataset");

    cy.get('[data-cy="dataset-metadata-title"]').type(
      "{selectall}{backspace} Soccer Players"
    );
    cy.get('[data-cy="dataset-metadata-description"]').type(
      "{selectall}{backspace} Soccer"
    );
    cy.get('[data-cy="dataset-metadata-source"]').type(
      "{selectall}{backspace} Rawgraphs"
    );
    cy.get('[data-cy="dataset-metadata-link"]').type(
      "{selectall}{backspace} Not available"
    );
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept("PATCH", `${apiUrl}/datasets/*`).as("editData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@editData");

    cy.wait("@fetchDatasets");
    cy.contains("Soccer Players").scrollIntoView().should("be.visible");
  });

  it("Duplicate dataset", () => {
    cy.contains('[data-cy="dataset-grid-item"]', "Soccer Players")
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="dataset-grid-item-duplicate-btn"]').click();

    cy.wait("@fetchDatasets");

    cy.get('[data-cy="dataset-grid-item"]')
      .contains("Soccer Players (Copy)")
      .scrollIntoView()
      .should("be.visible");
  });

  it("Delete dataset", () => {
    cy.contains('[data-cy="dataset-grid-item"]', "Soccer Players (Copy)")
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="dataset-grid-item-delete-btn"]').click();
    cy.intercept("DELETE", `${apiUrl}/datasets/*`).as("deleteDataset");

    cy.get('[data-cy="delete-dataset-item-form"]').within(() => {
      cy.get('[data-cy="delete-dataset-item-input"]').type("DELETE {enter}");
    });

    cy.wait("@deleteDataset");

    cy.wait("@fetchDatasets");

    cy.get('[data-cy="dataset-grid-item"]')
      .contains("Soccer Players (Copy)")
      .should("not.exist");

    cy.contains('[data-cy="dataset-grid-item"]', "Wine Tasting")
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="dataset-grid-item-delete-btn"]').click();
    cy.intercept("DELETE", `${apiUrl}/datasets/*`).as("deleteDataset");

    cy.get('[data-cy="delete-dataset-item-form"]').within(() => {
      cy.get('[data-cy="delete-dataset-item-input"]').type("DELETE {enter}");
    });

    cy.wait("@deleteDataset");

    cy.wait("@fetchDatasets");

    cy.get('[data-cy="dataset-grid-item"]')
      .contains("Wine Tasting")
      .should("not.exist");

    cy.contains('[data-cy="dataset-grid-item"]', "External Dataset")
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="dataset-grid-item-delete-btn"]').click();
    cy.intercept("DELETE", `${apiUrl}/datasets/*`).as("deleteDataset");

    cy.get('[data-cy="delete-dataset-item-form"]').within(() => {
      cy.get('[data-cy="delete-dataset-item-input"]').type("DELETE {enter}");
    });

    cy.wait("@deleteDataset");

    cy.wait("@fetchDatasets");

    cy.get('[data-cy="dataset-grid-item"]')
      .contains("External Dataset")
      .should("not.exist");
  });
});
