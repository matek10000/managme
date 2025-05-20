// cypress/e2e/app.spec.js

describe("ManagMe – pełny E2E", () => {
  const projectName = `Proj ${Date.now()}`
  const projectDesc = "Opis projektu testowego"
  const storyName   = `Story ${Date.now()}`
  const storyDesc   = "Opis historyjki testowej"
  const taskName    = `Task ${Date.now()}`
  const taskDesc    = "Opis zadania testowego"

  before(() => {
    // Zakładamy, że już jesteśmy zalogowani (np. fixture albo manualnie wcześniej).
    // Jeśli przekierowanie na inny URL po logowaniu zostało zrobione w komponencie,
    // to tutaj po prostu odwiedzamy stronę główną, żeby być w znanym miejscu.
    cy.visit("http://192.168.18.105:3000/")
  })

  it("1. Tworzy nowy projekt i wraca na /", () => {
    // Dodajemy projekt
    cy.contains("➕ Dodaj nowy projekt").scrollIntoView()
    cy.get('input[placeholder="Nazwa projektu"]').type(projectName)
    cy.get('textarea[placeholder="Opis projektu"]').type(projectDesc)
    cy.contains("button", "Dodaj projekt").click()

    // Gdy klikniesz Dodaj, aplikacja może przekierować na /projects/:id
    // dlatego wymusimy powrót na główny widok Home:
    cy.visit("http://192.168.18.105:3000/")

    // Teraz możemy wybrać projekt z dropdowna
    cy.get("select#projectSelect").select(projectName)
    cy.contains(projectName).should("be.visible")
    cy.contains(projectDesc).should("be.visible")
  })

  it("2. Dodaje historyjkę", () => {
    // Upewnij się, że jesteś na home i masz wybrany projekt
    cy.visit("http://192.168.18.105:3000/")
    cy.get("select#projectSelect").select(projectName)

    cy.contains("📚 Historyjki").scrollIntoView()
    cy.get('input[placeholder="Nazwa historyjki"]').type(storyName)
    cy.get('input[placeholder="Opis historyjki"]').type(storyDesc)
    cy.contains("button", "Dodaj").click()

    cy.contains(storyName).should("be.visible")
  })

  it("3. Dodaje zadanie", () => {
    cy.visit("http://192.168.18.105:3000/")
    cy.get("select#projectSelect").select(projectName)
    cy.contains(storyName).should("be.visible")

    cy.contains("📋 Zadania").scrollIntoView()
    cy.get('input[placeholder="Nazwa zadania"]').type(taskName)
    cy.get('textarea[placeholder="Opis zadania"]').type(taskDesc)
    cy.get("select").contains(storyName).select(storyName)
    cy.contains("button", "Dodaj zadanie").click()

    cy.contains(taskName).should("be.visible")
  })

  it("4. Zmienia status zadania", () => {
    cy.visit("http://192.168.18.105:3000/")
    cy.get("select#projectSelect").select(projectName)

    cy.contains(taskName)
      .parents("div")
      .within(() => {
        cy.contains("button", "Zakończ").click({ force: true })
      })

    cy.contains("h4", /done/i)
      .parent()
      .contains(taskName)
      .should("exist")
  })

  it("5. Edytuje projekt, historyjkę i zadanie", () => {
    cy.visit("http://192.168.18.105:3000/")
    cy.get("select#projectSelect").select(projectName)

    // Edycja projektu
    cy.contains("button", "Edytuj projekt").click({ force: true })
    cy.get('input[placeholder="Nazwa projektu"]')
      .clear()
      .type(projectName + " X")
    cy.contains("button", "Zapisz").click()
    cy.contains(projectName + " X").should("exist")

    // Edycja historyjki
    cy.contains(storyName)
      .parents("li")
      .within(() => {
        cy.contains("button", "Edytuj").click()
        cy.get('input[placeholder="Nazwa historyjki"]')
          .clear()
          .type(storyName + " Y")
        cy.contains("button", "Zapisz").click()
      })
    cy.contains(storyName + " Y").should("exist")

    // Edycja zadania
    cy.contains(taskName)
      .parents("div")
      .within(() => {
        cy.contains("button", "Edytuj").click()
        cy.get('input[placeholder="Nazwa zadania"]')
          .clear()
          .type(taskName + " Z")
        cy.contains("button", "Zapisz").click()
      })
    cy.contains(taskName + " Z").should("exist")
  })

  it("6. Usuwa zadanie, historyjkę i projekt", () => {
    cy.visit("http://192.168.18.105:3000/")
    cy.get("select#projectSelect").select(projectName + " X")

    // Usuń zadanie
    cy.contains(taskName + " Z")
      .parents("div")
      .within(() => {
        cy.contains("button", "Usuń").click()
      })
    cy.contains(taskName + " Z").should("not.exist")

    // Usuń historyjkę
    cy.contains(storyName + " Y")
      .parents("li")
      .within(() => {
        cy.contains("button", "Usuń").click()
      })
    cy.contains(storyName + " Y").should("not.exist")

    // Usuń projekt
    cy.contains("button", "Usuń projekt").click({ force: true })
    cy.get("select#projectSelect").should("not.contain", projectName + " X")
  })
})
