// cypress/e2e/project_create_delete.spec.js

describe("ManagMe – E2E: Tworzenie i usuwanie projektu", () => {
  const projectName = `TempProj ${Date.now()}`
  const projectDesc = "Opis tymczasowego projektu"

  beforeEach(() => {
    // Zakładamy, że użytkownik jest zalogowany
    cy.visit("http://localhost:3000/").wait(500)
  })

  it("Dodaje nowy projekt i następnie go usuwa", () => {
    // 1. Dodanie projektu
    cy.contains("➕ Dodaj nowy projekt").scrollIntoView()
    cy.get('input[placeholder="Nazwa projektu"]').clear().type(projectName)
    cy.wait(300)
    cy.get('textarea[placeholder="Opis projektu"]').clear().type(projectDesc)
    cy.wait(300)
    cy.contains("button", "Dodaj projekt").click()
    cy.wait(1000)

    // 2. Weryfikacja: projekt w dropdownie
    cy.contains("button", "Projekty").click()
    cy.get("[data-cy=projects-modal]")
      .should("be.visible")
      .contains(projectName)
      .should("be.visible")
      .click()
    cy.get("[data-cy=projects-modal]").should("not.exist")
    cy.wait(500)

    // 3. Usunięcie projektu
    cy.contains("button", "Usuń projekt").scrollIntoView().click({ force: true })
    cy.wait(1000)

    // 4. Weryfikacja: po usunięciu projektu nie ma go już na liście
    cy.contains("button", "Projekty").click()
    cy.get("[data-cy=projects-modal]")
      .should("be.visible")
      .contains(projectName)
      .should("not.exist")
  })
})
