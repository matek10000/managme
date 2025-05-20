const USER_KEY = "fm_user"

export default {
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      return null
    }
  },
  setUser: (u) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u))
  },
  updateUserRole: (newRole) => {
    const u = JSON.parse(localStorage.getItem(USER_KEY))
    if (!u) return
    u.role = newRole
    localStorage.setItem(USER_KEY, JSON.stringify(u))
  }
}
