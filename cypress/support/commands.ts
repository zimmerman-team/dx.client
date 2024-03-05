/// <reference types="cypress" />
import { jwtDecode } from "jwt-decode";
import "cypress-file-upload";
import "@4tw/cypress-drag-drop";

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

Cypress.Commands.add("login", (overrides = {}) => {
  Cypress.log({
    name: "loginViaAuth0",
  });

  const client_id = Cypress.env("auth0_client_id");
  const scope = Cypress.env("auth0_scope");
  const audience = Cypress.env("auth0_audience");

  const options = {
    method: "POST",
    url: `https://${Cypress.env("auth0_domain")}/oauth/token`,
    body: {
      grant_type: "password",
      username: Cypress.env("auth0_username"),
      password: Cypress.env("auth0_password"),
      audience,
      scope,
      client_id,
      client_secret: Cypress.env("auth0_client_secret"),
    },
  };
  cy.request(options)
    .then((resp) => {
      return resp.body;
    })
    .then((body: any) => {
      const { access_token, expires_in, id_token, token_type } = body;
      const [header, payload, signature] = id_token.split(".");
      const tokenData = jwtDecode(id_token);
      const key = `@@auth0spajs@@::${client_id}::${audience}::${scope}`;
      const userKey = `@@auth0spajs@@::${client_id}::@@user@@`;

      const auth0Cache = {
        body: {
          client_id,
          access_token,
          audience,
          id_token,
          scope,
          expires_in,
          token_type,
          decodedToken: {
            user: jwtDecode(id_token),
          },
        },
        expiresAt: Math.floor(Date.now() / 1000) + expires_in,
      };

      const auth0UserCache = {
        decodedToken: {
          encoded: { header, payload, signature },
          header: {
            alg: "RS256",
            typ: "JWT",
          },
          claims: {
            __raw: payload,
            ...tokenData,
          },
          user: tokenData,
        },
        id_token,
      };
      window.localStorage.setItem(key, JSON.stringify(auth0Cache));
      window.localStorage.setItem(userKey, JSON.stringify(auth0UserCache));
    });
});

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
    )
  ) {
    return false;
  }
});
