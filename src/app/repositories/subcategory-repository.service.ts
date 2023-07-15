import { Injectable } from '@angular/core';
import { CATEGORIES_SUBCOLLECTION_NAME, SUBCATEGORIES_SUBCOLLECTION_NAME, USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
import { CollectionReference, DocumentData, Query, collection, getFirestore } from 'firebase/firestore';
import { SubCollectionRepository } from './subcollection-repository';
import { Subcategory } from '../types/firestore/user';
import { FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { ISubCollectionRepository } from './interfaces/repository';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryRepositoryService
  extends SubCollectionRepository<Subcategory>
  implements ISubCollectionRepository<Subcategory> {

  constructor() {
    super(SUBCATEGORIES_SUBCOLLECTION_NAME);
  }

  async get(userId: string, categoryId: string, subcategoryId: string): Promise<Subcategory | undefined> {
    return super._get(SubcategoryRepositoryService.makeCollectionRef(userId, categoryId), subcategoryId);
  }

  async getAll(): Promise<FirestoreDocumentQueryResult<Subcategory>> {
    return super._getAll();
  }

  async getAllFromParent(userId: string, categoryId: string): Promise<FirestoreDocumentQueryResult<Subcategory>> {
    return super._getAllFromParent(SubcategoryRepositoryService.makeCollectionRef(userId, categoryId));
  }

  async getByQuery(query: Query<DocumentData>): Promise<FirestoreDocumentQueryResult<Subcategory>> {
    return super._getByQuery(query);
  }

  async add(userId: string, categoryId: string, subcategory: DocumentData, id?: string): Promise<Subcategory | undefined> {
    return super._add(SubcategoryRepositoryService.makeCollectionRef(userId, categoryId), subcategory, id);
  }

  async update(userId: string, categoryId: string, subcategoryId: string, subcategory: DocumentData): Promise<boolean> {
    return super._update(SubcategoryRepositoryService.makeCollectionRef(userId, categoryId), subcategoryId, subcategory);
  }

  async delete(userId: string, categoryId: string, subcategoryId: string, shouldHardDelete: boolean = false): Promise<boolean> {
    return super._delete(SubcategoryRepositoryService.makeCollectionRef(userId, categoryId), subcategoryId, shouldHardDelete);
  }

  static makeCollectionRef(userId: string, categoryId: string): CollectionReference<DocumentData> {
    return collection(getFirestore(), USER_COLLECTION_NAME, userId, CATEGORIES_SUBCOLLECTION_NAME, categoryId, SUBCATEGORIES_SUBCOLLECTION_NAME);
  }
}
