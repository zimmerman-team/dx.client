describe("General tests", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.visit("/landing");

    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("Can view the landing story", () => {
    cy.intercept(`${apiUrl}/story/public/*`).as("fetchStory");
    cy.get('[data-cy="landing-story-link"]').click();
    cy.wait(2000);

    cy.location("pathname").should(
      "include",
      "/story/664f406b82350800ca942b92"
    );
    cy.wait("@fetchStory");
    cy.get("input").should("have.value", "Impact Report on Climate Migration");
  });
});
