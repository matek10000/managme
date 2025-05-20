const admin = require("firebase-admin")
const serviceAccount = require("../fbadmin.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const sampleProjects = [
  { name: "Projekt Alfa", description: "Pierwszy projekt" },
  { name: "Projekt Beta", description: "Drugi projekt" },
  { name: "Projekt Gamma", description: "Trzeci projekt" },
  { name: "Projekt Delta", description: "Czwarty projekt" },
  { name: "Projekt Epsilon", description: "Piąty projekt" },
]

async function seed() {
  console.log("Start seeda...")
  for (const projData of sampleProjects) {
    const projRef = await db.collection("projects").add({
      ...projData,
      createdAt: Date.now(),
    })
    console.log(`✅ Dodano projekt: ${projData.name} (id: ${projRef.id})`)

    const stories = [
      {
        name: `${projData.name} – Story 1`,
        description: "Opis story 1",
        priority: "medium",
        status: "todo",
        createdAt: Date.now(),
      },
      {
        name: `${projData.name} – Story 2`,
        description: "Opis story 2",
        priority: "high",
        status: "doing",
        createdAt: Date.now(),
      },
    ]
    for (const s of stories) {
      await projRef.collection("stories").add(s)
      console.log(`   ➕ Dodano story: ${s.name}`)
    }

    const tasks = [
      {
        projectId: projRef.id,
        name: `${projData.name} – Task A`,
        description: "Zadanie A",
        priority: "low",
        status: "todo",
        estimatedTime: 3,
        createdAt: Date.now(),
      },
      {
        projectId: projRef.id,
        name: `${projData.name} – Task B`,
        description: "Zadanie B",
        priority: "medium",
        status: "doing",
        estimatedTime: 5,
        createdAt: Date.now(),
      },
      {
        projectId: projRef.id,
        name: `${projData.name} – Task C`,
        description: "Zadanie C",
        priority: "high",
        status: "done",
        estimatedTime: 2,
        createdAt: Date.now(),
      },
    ]
    for (const t of tasks) {
      await db.collection("tasks").add(t)
      console.log(`   🔧 Dodano task: ${t.name}`)
    }
  }
  console.log("🎉 Seed zakończony!")
  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Błąd podczas seeda:", err)
  process.exit(1)
})
