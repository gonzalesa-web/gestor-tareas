import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

export const registerWithEmail = (
  email: string,
  password: string
): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (
  email: string,
  password: string
): Promise<UserCredential> => signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = (): Promise<UserCredential> =>
  signInWithPopup(auth, new GoogleAuthProvider());

export const logout = (): Promise<void> => signOut(auth);