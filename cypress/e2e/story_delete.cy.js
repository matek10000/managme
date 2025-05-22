// cypress/e2e/story_create_delete.spec.js

describe("ManagMe – E2E: Tworzenie i usuwanie historyjki w Projekcie Alfa", () => {
  const projectName = "Projekt Alfa"
  const storyName   = `TempStory ${Date.now()}`
  const storyDesc   = "Opis testowej historyjki"

  beforeEach(() => {
    // Zakładamy, że użytkownik jest zalogowany i mamy projekt
    cy.visit("http://localhost:3000/").wait(500)
  })

  it("Dodaje historyjkę, odczekuje, a potem ją usuwa", () => {
    // 1. Wybór projektu
    cy.contains("button", "Projekty").scrollIntoView().click()
    cy.get("[data-cy=projects-modal]")
      .should("be.visible")
      .contains(projectName)
      .click()
    cy.get("[data-cy=projects-modal]").should("not.exist")
    cy.wait(500)

    // 2. Dodanie nowej historyjki
    cy.get("[data-cy=story-form]").scrollIntoView().within(() => {
      cy.get("[data-cy=story-name]").type(storyName)
      cy.wait(300)
      cy.get("[data-cy=story-desc]").type(storyDesc)
      cy.wait(300)
      cy.get("[data-cy=story-add]").click()
    })
    cy.wait(3000)

    // 3. Weryfikacja, że historyjka pojawiła się na liście
    cy.get("[data-cy=story-list]")
      .contains(storyName)
      .should("be.visible")
    cy.wait(500)

    // 4. Usunięcie tej historyjki
    cy.get("[data-cy=story-list]")
      .contains(storyName)
      .parents("[data-cy=story-card]")
      .within(() => {
        cy.get("[data-cy=story-delete]").click()
      })
    cy.wait(3000)

    // 5. Weryfikacja, że historyjka zniknęła
    cy.get("[data-cy=story-list]").contains(storyName).should("not.exist")
  })
})
