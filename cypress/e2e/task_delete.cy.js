// cypress/e2e/task_create_delete.spec.js

describe("ManagMe – E2E: Tworzenie i usuwanie zadania w Projekcie Alfa → Story 1", () => {
  const projectName = "Projekt Alfa"
  const storyName   = "Projekt Alfa – Story 1"
  const taskName    = `TempTask ${Date.now()}`
  const taskDesc    = "Tymczasowe zadanie do usunięcia"

  beforeEach(() => {
    // Zakładamy, że użytkownik jest zalogowany i mamy projekt + historyjkę
    cy.visit("http://localhost:3000/").wait(500)
  })

  it("Dodaje zadanie, odczekuje, a potem je usuwa", () => {
    // 1. Wybór projektu
    cy.contains("button", "Projekty").scrollIntoView().click()
    cy.get("[data-cy=projects-modal]")
      .should("be.visible")
      .contains(projectName)
      .click()
    cy.get("[data-cy=projects-modal]").should("not.exist")
    cy.wait(500)

    // 2. Wybór historyjki
    cy.get("[data-cy=open-stories-modal]").scrollIntoView().click({ force: true })
    cy.get("[data-cy=stories-modal]")
      .should("be.visible")
      .contains(storyName)
      .scrollIntoView()
      .click({ force: true })
    cy.get("[data-cy=stories-modal]").should("not.exist")
    cy.wait(500)

    // 3. Dodanie zadania
    cy.get("[data-cy=task-form]").scrollIntoView().within(() => {
      cy.get("[data-cy=task-name]").type(taskName)
      cy.wait(300)
      cy.get("[data-cy=task-desc]").type(taskDesc)
      cy.wait(300)
      cy.get("[data-cy=task-time]").type("1")
      cy.wait(300)
      cy.get("[data-cy=task-priority]").select("medium")
      cy.wait(300)
      cy.get("[data-cy=task-add]").click()
    })
    cy.wait(3000)
    cy.get('[data-cy="column-todo"]').contains(taskName).should("be.visible")

    // 4. Usunięcie zadania
    cy.get("[data-cy=task-card]")
      .contains(taskName)
      .parents("[data-cy=task-card]")
      .within(() => {
        cy.get("[data-cy=task-delete]").click()
      })
    cy.wait(3000)

    // 5. Weryfikacja, że zadanie zniknęło
    cy.get("[data-cy=task-card]").contains(taskName).should("not.exist")
  })
})
