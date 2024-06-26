import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage'
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  // ================== Autenticación ==================

  getAuth() {
    return getAuth();
  }

  // ====== Acceder ==============
  singIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // ====== Crear Usuario ============
  singUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  // ====== Actualizar Usuario ============
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  // =========== Enviar email para restablecer contraseña ===========
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }
  
  // =================== Cerrar Sesión ==================
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // =========== Base de Datos ===========

  // ========== Obtener documentos de una colección (Consultar productos) ==================
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionQuery), { idField: 'id' });
  }

  // ========== Obtener documentos de una colección (Consultar productos) ==================
  getCollectionDataUser(path: string,  collectionQuery?: any) {
    return collection(getFirestore(), path);
    //return collectionData(query(ref, ...collectionQuery), { idField: 'id' });
  }
  
  // ========== Setear Documento ==================
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data)
  }

  // ========== Actualizar Documento (Actualizar Producto) ==================
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data)
  }

  // ========== Eliminar Documento (Eliminar Producto) ==================
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path))
  }

  // ========== Obtener Documento =============
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // ========== Agregar un Documento (Registrar productos) =============
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }


  // ================= Almacenamiento =================

  // ============= Subir Imagen ================
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  // ============= Obtener ruta de la imagen con su url ================
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  // ============= Eliminar Archivo (Eliminar imagen de producto Db) ================
  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }
}
