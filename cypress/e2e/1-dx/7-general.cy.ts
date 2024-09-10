describe("General tests", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.visit("/landing");

    cy.get('[data-cy="cookie-btn"]').click();
  });

  it("Can view the landing report", () => {
    cy.intercept(`${apiUrl}/report/public/*`).as("fetchReport");
    cy.get('[data-cy="landing-report-link"]').click();
    cy.wait(2000);

    cy.location("pathname").should(
      "include",
      "/report/664f406b82350800ca942b92"
    );
    cy.wait("@fetchReport");
    cy.get("input").should("have.value", "Impact Report on Climate Migration");
  });
});
