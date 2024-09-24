import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { defaultEquals } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage)
  utilsSvc = inject(UtilsService)

  //================autenticacion=============

  getAuth() {
    return getAuth();
  }


  //========acceder==========
  signIn(user: User) {

    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }


  //========crear usuario==========

  signUp(user: User) {

    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //========actualizar usuario==========ac

  updateUser(displayName: string) {

    return updateProfile(getAuth().currentUser, { displayName })
  }
  //========Restablecer contraseña==========ac
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  singOut() {

    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');

  }


  //========Base de datos ==========a

  //========Obtener datos de  collection ==========

  getCollectionData(path: string, collectionQuery?: any) {

    const ref = collection(getFirestore(), path)
    return collectionData(query(ref, collectionQuery), { idField: 'id' })
  }




  //========setear documentos====
  setDocument(path: string, data: any) {

    return setDoc(doc(getFirestore(), path), data);

  }

  //========Actualizar documentos====
  updateDocument(path: string, data: any) {

    return updateDoc(doc(getFirestore(), path), data);
  }

  //========eliminar documentos====
  deleteDocument(path: string) {

    return deleteDoc(doc(getFirestore(), path));

  }
  //========obterner documentos====

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }


  //========Agregar  documentos====
  addDocument(path: string, data: any) {

    return addDoc(collection(getFirestore(), path), data);
  }


  //========almacenamiento====

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  //========actualizar imagen====

  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath

  }

   //========eliminar archivvo  imagen====
   deleteFile(path: string) {
return  deleteObject (ref(getStorage(), path))
    
   }
}
