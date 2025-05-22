// cypress/e2e/task_only_flow.spec.js

describe("ManagMe – E2E: Task flow (TODO → DOING → DONE)", () => {
  const projectName = "Projekt Alfa"
  const storyName   = "Projekt Alfa – Story 1"
  const taskName    = `FlowTask ${Date.now()}`

  beforeEach(() => {
    // Zakładamy, że projekt i historyjka już istnieją
    cy.visit("http://localhost:3000/").wait(500)
  })

  it("Dodaje zadanie i przenosi je przez statusy", () => {
    // 1. Wybierz projekt
    cy.contains("button", "Projekty")
      .scrollIntoView()
      .click()
    cy.get('[data-cy=projects-modal]').should("be.visible")
    cy.get('[data-cy=projects-modal]')
      .contains(projectName)
      .click()
    cy.get('[data-cy=projects-modal]').should("not.exist")
    cy.wait(300)

    // 2. Wybierz historyjkę
    cy.get('[data-cy="open-stories-modal"]')
      .scrollIntoView()
      .click({ force: true })
    cy.get('[data-cy="stories-modal"]').should("be.visible")
    cy.get('[data-cy="stories-modal-card"]')
      .contains(storyName)
      .scrollIntoView()
      .click({ force: true })
    cy.get('[data-cy="stories-modal"]').should("not.exist")
    cy.wait(300)

    // 3. Dodaj zadanie do TODO
    cy.get('[data-cy=task-form]')
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy=task-name]').type(taskName)
        cy.get('[data-cy=task-desc]').type("Automatyczny przepływ statusów")
        cy.get('[data-cy=task-time]').type("1")
        cy.get('[data-cy=task-priority]').select("medium")
        cy.get('[data-cy=task-add]').click()
      })
    cy.wait(500)
    cy.get('[data-cy="column-todo"]').contains(taskName).should("be.visible")

    // 4. Po 5s przenieś do DOING
    cy.wait(5000)
    cy.get('[data-cy="column-todo"]')
      .contains(taskName)
      .parents('[data-cy="task-card"]')
      .within(() => {
        cy.get('[data-cy="task-next"]').click({ force: true })
      })
    cy.get('[data-cy="column-doing"]').contains(taskName).should("exist")

    // 5. Po kolejnych 5s przenieś do DONE
    cy.wait(5000)
    cy.get('[data-cy="column-doing"]')
      .contains(taskName)
      .parents('[data-cy="task-card"]')
      .within(() => {
        cy.get('[data-cy="task-next"]').click({ force: true })
      })
    cy.get('[data-cy="column-done"]').contains(taskName).should("exist")
  })
})
