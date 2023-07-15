import { Injectable } from '@angular/core';
import { IRepository: } from './interfaces/repository';
import { FirestoreDocument, FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { DocumentData, collection, doc, getFirestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CollectionRepositoryService<T extends FirestoreDocument> implements IRepository:<T> {

  constructor(
    private collectionName: string
  ) { }

  async get(id: string): Promise<T> {
    const result = ait doc(collection(getFirestore(), this.collectionName), id);
  }

  getAll(): Promise<FirestoreDocumentQueryResult<T>> {
    throw new Error('Method not implemented.');
  }

  getByQuery(query: any): Promise<FirestoreDocumentQueryResult<T>> {
    throw new Error('Method not implemented.');
  }


  add(item: T, id?: string): Promise<T> {
    throw new Error('Method not implemented.');
  }

  update(id: string, data: DocumentData): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  delete(id: string, shouldHardDelete?: boolean): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

}
