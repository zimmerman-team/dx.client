/// <reference types="cypress" />

/* TESTS TO COVER

- Create Story - Done
- Edit Story - Done
- Delete Story - Done
- Duplicate Story - Done

*/
//@ts-ignore
const randomId = () => Cypress._.random(0, 1e6);
//@ts-ignore
const storyTestName = `story-testname${randomId()}`;
const chartTestName = `chart-testname${randomId()}`;

describe("Testing stories on DX", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    // restoring login cache
    cy.restoreLocalStorageCache();

    // Navigating to dx home page
    cy.intercept("GET", `${apiUrl}/users/plan-data`).as("planData");

    cy.visit("/");

    cy.wait("@planData");

    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("Can Create story", () => {
    cy.get('[data-cy="home-create-story-button"]').click();

    cy.contains(
      '[data-cy="story-template-card"]',
      "Blank template story"
    ).within(() => {
      cy.get('[data-cy="use-story-template-button"]').click();
    });
    cy.wait(2000);
    // cy.contains("Untitled story", { timeout: 2000 }).should("be.hidden");

    cy.get('[data-cy="skip-tour-button"]').click();

    cy.get('[data-cy="story-sub-header-title-input"]').type(storyTestName);

    //remove header
    cy.get('[data-cy="story-header-block"]').click();
    cy.get('[data-cy="delete-header-button"]').click();

    //drag and drop header block
    cy.get('[data-cy="story-panel-elements-tab"]').click();
    cy.wait(1000);

    cy.get('[data-cy="story-panel-header-item"]').first().drag();
    cy.get('[data-cy="header-drop-area"]').drop();

    //fill header inputs
    cy.get('[data-cy="story-header-block"]').within(() => {
      cy.get('[data-testid="heading-rich-text-editor"]').type(storyTestName);
      cy.get('[data-cy="description-rich-text-editor-container"]').click();
      cy.get('[data-testid="description-rich-text-editor"]').type(
        "This is a story on football players"
      );
    });
    //edit report header colors
    cy.get('[data-cy="edit-header-button"]').click();
    cy.get('[data-cy="color-label-Background color"]').within(() => {
      cy.get('[data-cy="color-picker"]').click();
      cy.get('[data-cy="sketch-picker"]').within(() => {
        cy.get("input").first().type("{selectall}{backspace}#245B9A");
      });
    });
    cy.get('[data-cy="color-label-Background color"]').click();

    cy.get('[data-cy="color-label-Title color"]').within(() => {
      cy.get('[data-cy="color-picker"]').click();
      cy.get('[data-cy="sketch-picker"]').within(() => {
        cy.get("input").first().type("{selectall}{backspace}#D8B5B5");
      });
    });
    cy.get('[data-cy="color-label-Title color"]').click();

    cy.get('[data-cy="color-label-Description color"]').within(() => {
      cy.get('[data-cy="color-picker"]').click();
      cy.get('[data-cy="sketch-picker"]').within(() => {
        cy.get("input").first().type("{selectall}{backspace}#D8B5B5");
      });
    });
    cy.get('[data-cy="color-label-Description color"]').click();

    //close edit header panel
    cy.get('[data-cy="edit-header-panel-close"]').click();

    cy.intercept(`${apiUrl}/story/*`).as("fetchStory");
    cy.intercept(`${apiUrl}/stories?filter=*`).as("fetchStories");

    cy.intercept("PATCH", `${apiUrl}/story/*`).as("patchStory");

    cy.get('[data-cy="empty-row-frame"]')
      .first()
      .within(() => {
        cy.get('[data-cy="one-by-two-type"]').click({ timeout: 2000 });
      });

    cy.intercept(`${apiUrl}/charts?filter=*`).as("fetchCharts");

    // Drop Text item

    cy.get('[data-cy="story-panel-media-tab"]').click();
    cy.wait(1000);
    cy.get('[data-cy="row-frame-item-drop-zone-0-0"]').scrollIntoView();

    cy.get('[data-cy="story-panel-text-item"]').first().drag();
    cy.get('[data-cy="row-frame-item-drop-zone-0-0"]').drop();

    cy.get("[data-cy=row-frame-0]").within(() => {
      cy.get('[data-testid="story-rich-text-editor"]')
        .first()
        .type(
          "This is a story on football players who played in a match last year"
        );
    });

    // Drag and drop chart item

    cy.get('[data-cy="story-panel-chart-tab"]').click();
    cy.get('[data-cy="story-panel-chart-tab"]').click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="row-frame-item-drop-zone-0-1"]');

    cy.get('[data-cy="story-panel-chart-item"]').first().drag();
    cy.get('[data-cy="row-frame-item-drop-zone-0-1"]').drop();

    // Drag and drop video item

    cy.intercept(`${apiUrl}/youtube/search**`).as("fetchYoutubeVideos");
    cy.get('[data-cy="add-row-frame-button"]').scrollIntoView().click();

    cy.get('[data-cy="empty-row-frame"]')
      .first()
      .within(() => {
        cy.get('[data-cy="one-by-one-type"]').click({ timeout: 2000 });
      });

    cy.get('[data-cy="story-panel-media-tab"]').click();

    cy.wait("@fetchYoutubeVideos");

    cy.get('[data-cy="story-panel-video-item"]').click();
    cy.get('[data-cy="video-frame"]').first().drag();
    cy.get('[data-cy="row-frame-item-drop-zone-1-0"]').scrollIntoView().drop();

    cy.get('[data-cy="story-video-content"]')
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
    cy.get('[data-cy="story-panel-chart-tab"]').click();
    cy.get('[data-cy="story-panel-chart-tab"]').click();
    cy.get('[data-cy="story-panel-media-tab"]').click();

    cy.wait("@fetchUnsplashImages");

    cy.get('[data-cy="story-panel-image-item"]').click();
    cy.get('[data-cy="image-frame"]').first().drag();
    cy.get('[data-cy="row-frame-item-drop-zone-2-0"]').scrollIntoView().drop();

    cy.get('[data-cy="story-image-content"]')
      .scrollIntoView()
      .should("be.visible");

    //add dividers
    cy.get('[data-cy="story-panel-elements-tab"]').click();
    cy.wait(1000);

    cy.get('[data-cy="story-panel-divider-item"]').first().drag();
    cy.get('[data-cy="story-row-placeholder-0"]').scrollIntoView();
    cy.get('[data-cy="story-row-placeholder-0"]').drop();

    //drag and drop row frame
    cy.get('[data-cy="story-panel-rowFrame-item"]').first().drag();
    cy.get('[data-cy="story-row-placeholder-1"]').scrollIntoView();
    cy.get('[data-cy="story-row-placeholder-1"]').drop();
    cy.get('[data-cy="empty-row-frame"]')

      .first()
      .within(() => {
        cy.get('[data-cy="one-by-two-type"]').click({ timeout: 2000 });
      });
    cy.get('[data-cy="story-panel-chart-tab"]').click();
    cy.wait("@fetchCharts");
    cy.get('[data-cy="story-panel-chart-search-input"]').type("chart-testName");
    cy.wait("@fetchCharts");
    cy.get('[data-cy="row-frame-item-drop-zone-1-0"]');
    cy.get('[data-cy="story-panel-chart-item"]').eq(2).drag();
    cy.get('[data-cy="row-frame-item-drop-zone-1-0"]').drop();

    // Save the story
    cy.get('[data-cy="save-story-button"]').click();

    cy.wait("@patchStory");

    cy.get('[data-cy="view-story-button"]').click();

    cy.wait("@fetchStory");

    cy.visit("/");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.get('[data-cy="home-stories-tab"]').scrollIntoView().click();

    cy.wait("@fetchStories");

    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.contains(storyTestName).should("be.visible");
  });
});

describe("Edit, duplicate and delete story", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.intercept("GET", `${apiUrl}/users/plan-data`).as("planData");

    cy.visit("/");

    cy.wait("@planData");

    cy.get('[data-cy="cookie-btn"]').click();

    cy.intercept(`${apiUrl}/stories?filter=*`).as("fetchStories");

    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();
    cy.get('[data-cy="home-stories-tab"]').scrollIntoView().click();

    cy.wait("@fetchStories");
  });

  it("Can Edit a story", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");
    cy.contains('[data-cy="story-grid-item"]', storyTestName)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="story-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/story/*`).as("fetchStory");
    cy.intercept("PATCH", `${apiUrl}/story/*`).as("patchStory");

    cy.get('[data-cy="story-grid-item-edit-btn"]').click();

    cy.wait("@fetchStory");

    cy.get('[data-cy="story-sub-header-title-input"]').type(" - Edited");

    cy.get('[data-cy="story-header-block"]').within(() => {
      cy.get('[data-testid="heading-rich-text-editor"]').type(" - Edited");
      cy.get('[data-cy="description-rich-text-editor-container"]').click();
      cy.get('[data-testid="description-rich-text-editor"]').type(" - Edited");
    });

    cy.get('[data-cy="save-story-button"]').click();

    cy.wait("@patchStory");

    cy.get('[data-cy="view-story-button"]').click();

    cy.wait("@fetchStory");

    cy.visit("/");
    cy.get('[data-cy="home-charts-tab"]').scrollIntoView().click();

    cy.get('[data-cy="home-stories-tab"]').scrollIntoView().click();

    cy.wait("@fetchStories");

    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.contains(`${storyTestName} - Edited`).should("be.visible");
  });

  it("Can edit a chart from a story", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.contains('[data-cy="story-grid-item"]', `${storyTestName} - Edited`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="story-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/story/*`).as("fetchStory");

    cy.get('[data-cy="story-grid-item-edit-btn"]').click();

    cy.wait("@fetchStory");

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

    cy.get('[data-cy="story-sub-header-title-input"]').type(
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

    cy.intercept(`${apiUrl}/charts?filter=*`).as("fetchCharts");

    cy.wait("@saveChart2");

    // cy.get('[data-cy="back-to-story-button"]').click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="story-panel-chart-search-input"]').type(
      `${chartTestName}-Edited`
    );
    cy.wait("@fetchCharts");

    cy.contains(
      '[data-cy="story-panel-chart-item"]',
      `${chartTestName}-Edited`
    ).should("be.visible");
  });

  it("Can delete an item from a box in a row", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.contains('[data-cy="story-grid-item"]', `${storyTestName} - Edited`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="story-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/story/*`).as("fetchStory");

    cy.get('[data-cy="story-grid-item-edit-btn"]').click();

    cy.wait("@fetchStory");

    cy.get('[data-cy="row-frame-item-drop-zone-0-0"]').should("have.length", 0);

    cy.get('[data-cy="row-frame-text-item"]')
      .first()
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-cy="delete-item-button"]').click();
      });

    cy.get('[data-cy="row-frame-item-drop-zone-0-0"]').should("have.length", 1);
  });

  it("Can Duplicate a story", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.contains('[data-cy="story-grid-item"]', `${storyTestName} - Edited`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="story-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="story-grid-item-duplicate-btn"]').click();

    cy.wait("@fetchStories");

    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.get('[data-cy="story-grid-item"]')
      .contains(`${storyTestName} - Edited (Copy)`)
      .should("be.visible");
  });

  it("Can Create a chart from a story", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.contains(
      '[data-cy="story-grid-item"]',
      `${storyTestName} - Edited (Copy)`
    )
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="story-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/story/*`).as("fetchStory");

    cy.get('[data-cy="story-grid-item-edit-btn"]').click();

    cy.wait("@fetchStory");

    cy.intercept("GET", `${apiUrl}/datasets?**`).as("getDatasets");
    cy.get('[data-cy="story-panel-create-chart-card"]').click();
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

    cy.get('[data-cy="chart-type-item"]').contains("Bar Chart").first().click();

    cy.get('[data-cy="chart-type-preview"]')
      .contains("Bar Chart")
      .should("be.visible");

    cy.intercept(`${apiUrl}/chart`).as("saveChart");
    cy.intercept(`${apiUrl}/chart/*`).as("saveChart2");

    cy.get('[data-cy="toolbox-chart-next"]').click();

    cy.wait("@saveChart");

    cy.location("pathname").should("include", "/mapping");

    cy.get('[data-cy="story-sub-header-title-input"]').type(
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

    cy.intercept(`${apiUrl}/charts?filter=*`).as("fetchCharts");

    cy.wait("@saveChart2");

    // cy.get('[data-cy="back-to-story-button"]').click();

    cy.wait("@fetchCharts");

    cy.get('[data-cy="story-panel-chart-search-input"]').type(chartTestName);
    cy.wait("@fetchCharts");

    cy.contains('[data-cy="story-panel-chart-item"]', chartTestName).should(
      "be.visible"
    );
  });

  it("Can Modify the row structure of a row", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.contains('[data-cy="story-grid-item"]', `${storyTestName} - Edited`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="story-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/story/*`).as("fetchStory");

    cy.get('[data-cy="story-grid-item-edit-btn"]').click();

    cy.wait("@fetchStory");
    cy.wait("@planData");

    cy.get('[data-cy="row-frame-chart-item-0-1"]').should("have.length", 1);

    cy.get('[data-cy="row-frame-container"]')
      .first()
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-cy="edit-row-structure-button"]').click();
      });

    cy.get('[data-cy="empty-row-frame"]')
      .first()
      .within(() => {
        cy.get('[data-cy="one-by-one-type"]').click({ timeout: 2000 });
      });

    cy.get('[data-cy="row-frame-chart-item-0-1"]').should("have.length", 0);
    cy.wait(5000);
  });

  it("Can drag and drop rows in a story", () => {
    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.contains('[data-cy="story-grid-item"]', `${storyTestName} - Edited`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="story-grid-item-menu-btn"]').click();
      });

    cy.intercept(`${apiUrl}/story/*`).as("fetchStory");

    cy.get('[data-cy="story-grid-item-edit-btn"]').click();

    cy.wait("@fetchStory");

    cy.get('[data-cy="row-frame-container"]')
      .first()
      .within(() => {
        cy.get('[data-cy="row-frame-handle"]').drag();
      });
    cy.get('[data-cy="story-row-placeholder"]').eq(2).scrollIntoView().drop();
    cy.wait(5000);
    cy.get('[data-cy="row-frame-container"]')
      .first()
      .within(() => {
        cy.get('[data-cy="row-frame-text-item"]').should("have.length", 0);
      });
  });

  it("Can delete a story", () => {
    cy.intercept("DELETE", `${apiUrl}/story/*`).as("deleteStory");

    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.contains(
      '[data-cy="story-grid-item"]',
      `${storyTestName} - Edited (Copy)`
    )
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="story-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="story-grid-item-delete-btn"]').click();

    cy.get('[data-cy="delete-story-item-form"]').within(() => {
      cy.get('[data-cy="delete-story-item-input"]').type("DELETE{enter}");
    });

    cy.wait("@deleteStory");

    cy.wait("@fetchStories");

    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.get('[data-cy="story-grid-item"]')
      .contains(`${storyTestName} - Edited (Copy)`)
      .should("not.exist");

    // Delete the edited story

    cy.contains('[data-cy="story-grid-item"]', `${storyTestName} - Edited`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="story-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="story-grid-item-delete-btn"]').click();

    cy.get('[data-cy="delete-story-item-form"]').within(() => {
      cy.get('[data-cy="delete-story-item-input"]').type("DELETE{enter}");
    });

    cy.wait("@deleteStory");

    cy.wait("@fetchStories");

    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${storyTestName}`
    );

    cy.wait("@fetchStories");

    cy.contains(`${storyTestName} - Edited`).should("not.exist");
  });

  it("Can Download a story - PDF", () => {
    cy.intercept(`${apiUrl}/story*`).as("fetchStory");
    cy.get('[data-cy="story-grid-item"]').first().scrollIntoView().click();
    // cy.wait("@fetchStory");

    // cy.contains(storyTestName);
    cy.get('[data-cy="export-report"]').click();
    cy.get('[data-cy="export-report-pdf"]').click();
  });

  it("Can Download a story -SVG", () => {
    cy.intercept(`${apiUrl}/story*`).as("fetchStory");
    cy.get('[data-cy="story-grid-item"]').first().scrollIntoView().click();
    // cy.wait("@fetchStory");

    // cy.contains(storyTestName);
    cy.get('[data-cy="export-report"]').click();
    cy.get('[data-cy="export-report-svg"]').click();
  });

  it("Can Download a story - PNG", () => {
    cy.intercept(`${apiUrl}/story*`).as("fetchStory");
    cy.get('[data-cy="story-grid-item"]').first().scrollIntoView().click();
    // cy.wait("@fetchStory");

    // cy.contains(storyTestName);
    cy.get('[data-cy="export-report"]').click();
    cy.get('[data-cy="export-report-png"]').click();
  });
});
