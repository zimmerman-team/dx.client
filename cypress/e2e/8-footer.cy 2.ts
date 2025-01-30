/// <reference types="cypress" />

describe("testing footer for valid links", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.contains("Accept").click();
  });
  it("it should verify footer copies", () => {
    cy.contains("2025 Dataxplorer All Rights Reserved").scrollIntoView();
    cy.contains("Tel: +3185 401 5241");
    cy.contains("Email: contact@dataxplorer.org");
    cy.contains("Keizersgracht 520H");
    cy.contains("1017 EK Amsterdam");
    cy.contains("The Netherlands");
  });

  it("it should remain in home page", () => {
    cy.contains("a", "Explore").scrollIntoView().click();
    cy.contains("Create high impact data driven");
  });
  it("clicking logo should remain in home page", () => {
    cy.get("[data-cy=footer-logo]").scrollIntoView().click();
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

  it("should subscibe to email", () => {
    cy.contains("Stay Up To Date");
    cy.contains(
      "You will receive occasional emails from DX. You always have choice to unsubscribe within every Email."
    );
    cy.contains("SUBSCRIBE");
    cy.get('input[placeholder="Email address"]').type(
      "emmanuella@zimmerman.team"
    );
    cy.contains("SUBSCRIBE").click();
    cy.wait(2000);
    cy.contains("Thank you for subscribing!");
  });
});
