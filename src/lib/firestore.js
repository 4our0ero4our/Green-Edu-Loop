import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

export const POINT_RULES = {
  Plastic: 10,
  Glass: 15,
  General: 5,
}

export async function fetchUserProfile(uid) {
  const userRef = doc(db, 'users', uid)
  const snapshot = await getDoc(userRef)
  return snapshot.exists() ? snapshot.data() : null
}

export async function fetchWasteLogs(userId, logLimit = null) {
  const constraints = [
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
  ]

  if (logLimit) constraints.push(limit(logLimit))

  const wasteQuery = query(collection(db, 'wasteLogs'), ...constraints)
  const snapshot = await getDocs(wasteQuery)

  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }))
}

export async function addWasteLog(userId, wasteType) {
  const pointsEarned = POINT_RULES[wasteType] ?? POINT_RULES.General

  await addDoc(collection(db, 'wasteLogs'), {
    userId,
    wasteType,
    pointsEarned,
    timestamp: serverTimestamp(),
  })

  await updateDoc(doc(db, 'users', userId), {
    totalPoints: increment(pointsEarned),
  })

  return pointsEarned
}
