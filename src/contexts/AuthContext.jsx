import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { fetchUserProfile } from '../lib/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const googleProvider = new GoogleAuthProvider()
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const ensureUserProfile = async (user, fallbackName = 'Eco Hero') => {
    const fallbackProfile = {
      uid: user.uid,
      name: user.displayName ?? fallbackName,
      email: user.email,
      totalPoints: 0,
    }

    try {
      const existingProfile = await fetchUserProfile(user.uid)
      if (existingProfile) return existingProfile

      const profilePayload = {
        ...fallbackProfile,
        createdAt: serverTimestamp(),
      }

      await setDoc(doc(db, 'users', user.uid), profilePayload, { merge: true })
      return fallbackProfile
    } catch (error) {
      console.error('Ensuring user profile failed:', error)
      return fallbackProfile
    }
  }

  useEffect(() => {
    async function resolveRedirectSignIn() {
      try {
        const redirectResult = await getRedirectResult(auth)
        if (redirectResult?.user) {
          const userProfile = await ensureUserProfile(redirectResult.user)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Redirect sign-in completion failed:', error)
      }
    }

    resolveRedirectSignIn()

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        try {
          setCurrentUser(user)

          if (user) {
            const userProfile = await ensureUserProfile(user)
            setProfile(userProfile)
          } else {
            setProfile(null)
          }
        } catch (error) {
          console.error('Auth profile initialization failed:', error)
          setProfile(
            user
              ? {
                  uid: user.uid,
                  name: user.displayName ?? 'Eco Hero',
                  email: user.email,
                  totalPoints: 0,
                }
              : null
          )
        } finally {
          setIsLoading(false)
        }
      },
      (error) => {
        console.error('Auth state listener failed:', error)
        setCurrentUser(null)
        setProfile(null)
        setIsLoading(false)
      }
    )

    return unsubscribe
  }, [])

  const signup = async ({ name, email, password }) => {
    const credentials = await createUserWithEmailAndPassword(auth, email, password)
    const user = credentials.user

    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        totalPoints: 0,
        createdAt: serverTimestamp(),
      })
    } catch (error) {
      // Account creation succeeded; keep user signed in even if profile write fails.
      console.error('Initial profile write failed during signup:', error)
    }

    try {
      const userProfile = await ensureUserProfile(user, name)
      setProfile(userProfile)
    } catch (error) {
      console.error('Signup profile fetch failed:', error)
      setProfile({
        uid: user.uid,
        name,
        email: user.email,
        totalPoints: 0,
      })
    }
  }

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)

  const signInWithGoogle = async () => {
    try {
      const credentials = await signInWithPopup(auth, googleProvider)
      const userProfile = await ensureUserProfile(credentials.user)
      setProfile(userProfile)
      return credentials.user
    } catch (error) {
      const shouldFallbackToRedirect =
        error?.code === 'auth/popup-blocked' ||
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/operation-not-supported-in-this-environment'

      if (shouldFallbackToRedirect) {
        await signInWithRedirect(auth, googleProvider)
        return null
      }

      throw error
    }
  }

  const logout = () => signOut(auth)

  const refreshProfile = async () => {
    if (!currentUser) return
    try {
      const userProfile = await fetchUserProfile(currentUser.uid)
      setProfile(
        userProfile ?? {
          uid: currentUser.uid,
          name: currentUser.displayName ?? 'Eco Hero',
          email: currentUser.email,
          totalPoints: 0,
        }
      )
    } catch (error) {
      console.error('Profile refresh failed:', error)
    }
  }

  const value = useMemo(
    () => ({
      currentUser,
      profile,
      isLoading,
      signup,
      login,
      signInWithGoogle,
      logout,
      refreshProfile,
    }),
    [currentUser, profile, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
