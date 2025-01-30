/// <reference types="cypress" />

describe("testing footer for valid links", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("clicking logo should remain in home page", () => {
    cy.get("[data-cy=header-logo]").scrollIntoView().click();
    cy.contains("Create high impact data driven");
  });
  it("it should remain in home page", () => {
    cy.contains("a", "Library").scrollIntoView().click();
    cy.contains("Create high impact data driven");
  });
  it("it should go to why dataxplorer page", () => {
    cy.contains("a", "Why Dataxplorer").scrollIntoView().click();
    cy.contains("Turn Data into Impact in Minutes with Dataxplorer");
  });
  it("it should go to why about page", () => {
    cy.contains("a", "About").scrollIntoView().click();
    cy.contains("Our Story");
  });
  it("it should go to Partners page", () => {
    cy.contains("a", "Partners").scrollIntoView().click();
    cy.contains(
      "Global Health and International Development Organizations are using Dataxplorer"
    );
  });
  it("it should go to Pricing page", () => {
    cy.contains("a", "Pricing").scrollIntoView().click();
    cy.contains("Create stories that aren't a pain to build");
  });
  it("it should go to Contact page", () => {
    cy.contains("a", "Contact").scrollIntoView().click();
    cy.contains("Dataxplorer Equips You with Insightful Data");
  });
});
