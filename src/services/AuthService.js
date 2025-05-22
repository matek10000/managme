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
  const ADMIN_EMAIL = "matekofficial@interia.pl"  // <- mail admina
  
  export default {
    loginWithGoogle: () => signInWithPopup(auth, googleProvider),
  
    loginWithEmail: (email, password) =>
      signInWithEmailAndPassword(auth, email, password),
    registerWithEmail: (email, password) =>
      createUserWithEmailAndPassword(auth, email, password),
  
    logout: () => {
      localStorage.removeItem(USER_KEY)
      return signOut(auth)
    },
  
    onAuthChange: (callback) => {
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          const { claims } = await getIdTokenResult(user)
          let role = claims.role || "guest"
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
  
    // Pobiera usera
    getUser: () => {
      try {
        return JSON.parse(localStorage.getItem(USER_KEY))
      } catch {
        return null
      }
    },
  
    // Sprawdza czy guest
    isGuest: () => {
      const u = JSON.parse(localStorage.getItem(USER_KEY))
      return u?.role === "guest"
    },
  }
  