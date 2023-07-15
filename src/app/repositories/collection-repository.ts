import { IRepository } from './interfaces/repository';
import { FirestoreDocument, FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { CollectionReference, DocumentData, Query, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';

export class CollectionRepository<T extends FirestoreDocument> implements IRepository<T> {

  collectionRef: CollectionReference<DocumentData>;

  constructor(
    collectionRef: CollectionReference<DocumentData>,
  ) {
    this.collectionRef = collectionRef;
  }

  async get(id: string): Promise<T | undefined> {
    const result = await getDoc(doc(this.collectionRef, id));
    let data = result.data();
    if (!data) return undefined;
    data['id'] = result.id;
    return data as T;
  }

  async getAll(): Promise<FirestoreDocumentQueryResult<T>> {
    const result = await getDocs(this.collectionRef);
    return {
      size: result.size,
      docs: this.mapDocsToData(result.docs)
    }
  }

  async getByQuery(query: Query): Promise<FirestoreDocumentQueryResult<T>> {
    const result = await getDocs(query);
    return {
      size: result.size,
      docs: this.mapDocsToData(result.docs)
    }
  }

  async add(item: DocumentData, id?: string): Promise<T | undefined> {
    let result = undefined;
    try {
      if (id) {
        await setDoc(doc(this.collectionRef, id), item);
        result = structuredClone(item);
        result['id'] = id;
        return result as T;
      } else {
        result = await addDoc(this.collectionRef, item);
        let data = structuredClone(item);
        data['id'] = result.id;
        return data as T;
      }
    } catch (e) {
      return undefined;
    }

  }

  async update(id: string, data: DocumentData): Promise<boolean> {
    try { await setDoc(doc(this.collectionRef, id), data, { merge: true }); }
    catch (e) { return false; }
    return true;
  }

  async delete(id: string, shouldHardDelete: boolean = false): Promise<boolean> {
    if (shouldHardDelete) {
      return this.update(id, { is_deleted: true });
    }

    try { await deleteDoc(doc(this.collectionRef, id)); }
    catch (e) { return false; }
    return true;
  }

  mapDocsToData(docs: any[]): T[] {
    return docs.map(doc => {
      let data = doc.data();
      data['id'] = doc.id;
      return data as T;
    });
  }

}
