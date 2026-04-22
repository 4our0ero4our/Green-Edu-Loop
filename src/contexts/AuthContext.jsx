import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { fetchUserProfile } from '../lib/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        try {
          setCurrentUser(user)

          if (user) {
            const userProfile = await fetchUserProfile(user.uid)
            setProfile(
              userProfile ?? {
                uid: user.uid,
                name: user.displayName ?? 'Eco Hero',
                email: user.email,
                totalPoints: 0,
              }
            )
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

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      email: user.email,
      totalPoints: 0,
      createdAt: serverTimestamp(),
    })

    try {
      const userProfile = await fetchUserProfile(user.uid)
      setProfile(
        userProfile ?? {
          uid: user.uid,
          name,
          email: user.email,
          totalPoints: 0,
        }
      )
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
