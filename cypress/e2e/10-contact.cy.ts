/// <reference types="cypress" />

describe("testing contact form", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    cy.visit("/contact");
    cy.contains("Accept").click();
  });
  it("should submit contact form", () => {
    cy.intercept(`${apiUrl}/users/send-contact-form-to-intercom`).as(
      "submitForm"
    );
    cy.get('input[name="email"]').first().type("emmanuella@zimmerman.team");
    cy.get('input[name="firstName"]').type("Emmanuella");
    cy.get('input[name="lastName"]').type("Okorie");
    cy.get('input[name="company"]').type("Zimmerman B.V");
    cy.get('textarea[name="message"]').type("Testing");
    cy.contains("button", "SUBMIT").click();

    cy.wait("@submitForm");
    cy.get("body").find('[data-cy="contact-form-alert"]').should("be.visible");
  });
});
