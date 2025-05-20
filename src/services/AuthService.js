import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    getIdTokenResult,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth"
  import { auth, googleProvider } from "../firebase"
  
  const USER_KEY = "fm_user"
  const ADMIN_EMAIL = "matekofficial@interia.pl"  // <-- ustaw tutaj swój adres admina
  
  export default {
    // Google OAuth
    loginWithGoogle: () => signInWithPopup(auth, googleProvider),
  
    // Email/Password
    loginWithEmail: (email, password) =>
      signInWithEmailAndPassword(auth, email, password),
    registerWithEmail: (email, password) =>
      createUserWithEmailAndPassword(auth, email, password),
  
    // Logout
    logout: () => {
      localStorage.removeItem(USER_KEY)
      return signOut(auth)
    },
  
    // Nasłuchuj zmiany stanu logowania
    onAuthChange: (callback) => {
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Pobierz claims (role z Cloud Function)
          const { claims } = await getIdTokenResult(user)
          // Domyślna rola z claims lub guest
          let role = claims.role || "guest"
          // Hard-code: jeśli email to ADMIN_EMAIL, nadpisz na 'admin'
          if (user.email === ADMIN_EMAIL) {
            role = "admin"
          }
          const fmUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role,
          }
          localStorage.setItem(USER_KEY, JSON.stringify(fmUser))
          callback(fmUser)
        } else {
          localStorage.removeItem(USER_KEY)
          callback(null)
        }
      })
    },
  
    // Pobierz usera
    getUser: () => {
      try {
        return JSON.parse(localStorage.getItem(USER_KEY))
      } catch {
        return null
      }
    },
  
    // Sprawdź czy guest
    isGuest: () => {
      const u = JSON.parse(localStorage.getItem(USER_KEY))
      return u?.role === "guest"
    },
  }
  