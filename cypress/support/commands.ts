/// <reference types="cypress" />
import "cypress-file-upload";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorageCache", (overrides = {}) => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
  cy.writeFile("./cypress/fixtures/localStorage.json", LOCAL_STORAGE_MEMORY);
});

Cypress.Commands.add("restoreLocalStorageCache", (overrides = {}) => {
  cy.fixture("localStorage.json").then((fixture) => {
    Object.keys(fixture).forEach((key) => {
      localStorage.setItem(key, fixture[key]);
    });
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  if (
    err.message.includes(
      "ResizeObserver loop completed with undelivered notifications"
    ) ||
    err.message.includes("Error: Consent required") ||
    err.message.includes(
      'Blocked a frame with origin "https://billing.stripe.com"'
    )
  ) {
    return false;
  }
});

Cypress.Commands.add("drag", { prevSubject: true }, (subject) => {
  cy.wrap(subject).trigger("dragstart").trigger("dragleave");
});

Cypress.Commands.add("drop", { prevSubject: true }, (subject) => {
  cy.wrap(subject).trigger("dragenter").trigger("dragover").trigger("drop");
});

function loginViaAuth0Ui(username: string, password: string) {
  // App landing page redirects to Auth0.
  cy.visit("/");
  cy.visit(
    `https://${Cypress.env(
      "auth0_domain"
    )}/authorize?response_type=token&client_id=${Cypress.env(
      "auth0_client_id"
    )}&audience=${Cypress.env(
      "auth0_audience"
    )}&scope=openid%20profile%20email&redirect_uri=${Cypress.env(
      "base_url"
    )}/callback`
  );
  cy.intercept("/callback**").as("callback");
  cy.intercept(`https://${Cypress.env("auth0_domain")}/oauth/token`).as(
    `auth0`
  );

  // Login on Auth0.
  cy.origin(
    Cypress.env("auth0_domain"),
    { args: { username, password } },
    ({ username, password }) => {
      cy.get("input#username").type(username);
      cy.get("input#password").type(password, { log: false });
      cy.contains("button[value=default]", "Continue").click();

      cy.url().then((url) => {
        if (url.includes("auth0.com")) {
          cy.contains("button[value=accept]", "Accept").click();
        }
      });

      cy.wait("@callback");
      cy.wait("@auth0");
    }
  );
}

Cypress.Commands.add("loginToAuth0", (username: string, password: string) => {
  const log = Cypress.log({
    displayName: "AUTH0 LOGIN",
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot("before");

  loginViaAuth0Ui(username, password);

  log.snapshot("after");
  log.end();
});

Cypress.Commands.add("setGoogleAccessToken", () => {
  cy.request({
    method: "POST",
    url: "https://oauth2.googleapis.com/token",
    body: {
      client_id: Cypress.env("google_client_id_test"),
      client_secret: Cypress.env("google_client_secret_test"),
      refresh_token: Cypress.env("google_refresh_token_test"),
      grant_type: "refresh_token",
    },
  }).then(({ body }) => {
    localStorage.setItem("google_access_token", body.access_token);
  });
});
