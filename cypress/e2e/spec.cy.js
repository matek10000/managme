// cypress/e2e/app.spec.js

describe("ManagMe – E2E: Tworzenie projektu, historyjki i zadania (ze zwolnieniami)", () => {
  const projectName = `Proj ${Date.now()}`
  const projectDesc = "Opis projektu"
  const storyName   = `Story ${Date.now()}`
  const storyDesc   = "Opis historyjki"
  const taskName    = `Task ${Date.now()}`
  const taskDesc    = "Opis zadania"

  beforeEach(() => {
    cy.visit("http://localhost:3000/")
    cy.wait(500) // dajemy chwilę na załadowanie strony
  })

  it("Tworzy projekt, historyjkę, wybiera ją i dodaje zadanie", () => {
    // 1. Dodaj projekt
    cy.contains("➕ Dodaj nowy projekt").scrollIntoView()
    cy.wait(200)
    cy.get('input[placeholder="Nazwa projektu"]').type(projectName)
    cy.wait(200)
    cy.get('textarea[placeholder="Opis projektu"]').type(projectDesc)
    cy.wait(200)
    cy.contains("button", "Dodaj projekt").click()
    cy.wait(500)

    // 2. Wybierz projekt
    cy.contains("button", "Projekty").click()
    cy.wait(300)
    cy.get('[data-cy=projects-modal]').contains(projectName).click()
    cy.wait(500)
    cy.get('[data-cy=projects-modal]').should("not.exist")
    cy.wait(200)

    // 3. Dodaj historyjkę
    cy.get('[data-cy=story-form]').within(() => {
      cy.get('[data-cy=story-name]').type(storyName)
      cy.wait(200)
      cy.get('[data-cy=story-desc]').type(storyDesc)
      cy.wait(200)
      cy.get('[data-cy=story-add]').click()
    })
    cy.wait(500)
    cy.get('[data-cy=story-list]').contains(storyName).should("be.visible")
    cy.wait(200)

    // 4. Wybierz historyjkę z modalu
    cy.get('[data-cy="open-stories-modal"]').click()
    cy.wait(300)
    cy.get('[data-cy="stories-modal"]').contains(storyName).click()
    cy.wait(500)
    cy.get('[data-cy="stories-modal"]').should("not.exist")
    cy.wait(200)

    // 5. Dodaj zadanie
    cy.get('[data-cy=task-form]').within(() => {
      cy.get('[data-cy=task-name]').type(taskName)
      cy.wait(200)
      cy.get('[data-cy=task-desc]').type(taskDesc)
      cy.wait(200)
      cy.get('[data-cy=task-time]').type("2")
      cy.wait(200)
      cy.get('[data-cy=task-priority]').select("medium")
      cy.wait(200)
      cy.get('[data-cy=task-add]').click()
    })
    cy.wait(500)

    // Weryfikacja – task pojawia się w kolumnie TODO
    cy.get('[data-cy="column-todo"]').contains(taskName).should("be.visible")
  })
})
