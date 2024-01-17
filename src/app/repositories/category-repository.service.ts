import { Injectable } from '@angular/core';
import { SubCollectionRepository } from './subcollection-repository';
import { Category } from '../types/firestore/user';
import { CATEGORIES_SUBCOLLECTION_NAME, USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
import { CollectionReference, DocumentData, Query, collection, getFirestore } from 'firebase/firestore';
import { FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { ISubCollectionRepository } from './interfaces/repository';
import { CLONE_PROPERTY, isObjectClone } from '../helpers/firestore/repository-helpers';

@Injectable({
  providedIn: 'root'
})
export class CategoryRepositoryService
  extends SubCollectionRepository<Category>
  implements ISubCollectionRepository<Category> {

  constructor() {
    super(CATEGORIES_SUBCOLLECTION_NAME);
  }

  async get(userId: string, categoryId: string): Promise<Category | undefined> {
    return super._get(CategoryRepositoryService.makeCollectionRef(userId), categoryId);
  }

  async getAllFromParent(userId: string): Promise<FirestoreDocumentQueryResult<Category>> {
    return super._getAllFromParent(CategoryRepositoryService.makeCollectionRef(userId));
  }

  async getAll(): Promise<FirestoreDocumentQueryResult<Category>> {
    return super._getAll();
  }

  async getByQuery(query: Query<DocumentData>): Promise<FirestoreDocumentQueryResult<Category>> {
    return super._getByQuery(query);
  }

  async add(userId: string, category: DocumentData, id?: string): Promise<Category | undefined> {
    category = this.cloneAndRemoveProperties(category);
    return super._add(CategoryRepositoryService.makeCollectionRef(userId), category, id);
  }

  async update(userId: string, categoryId: string, category: DocumentData): Promise<boolean> {
    category = this.cloneAndRemoveProperties(category);
    return super._update(CategoryRepositoryService.makeCollectionRef(userId), categoryId, category);
  }

  async delete(userId: string, categoryId: string, shouldHardDelete: boolean = false): Promise<boolean> {
    return super._delete(CategoryRepositoryService.makeCollectionRef(userId), categoryId, shouldHardDelete);
  }

  static makeCollectionRef(userId: string): CollectionReference<DocumentData> {
    return collection(getFirestore(), USER_COLLECTION_NAME, userId, CATEGORIES_SUBCOLLECTION_NAME);
  }

  protected cloneAndRemoveProperties(item: DocumentData): DocumentData {
    if (!isObjectClone(item)) {
      item = structuredClone(item);
      item[CLONE_PROPERTY] = true;
    }
    if (item['transactions']) {
      delete item['subcategories'];
    }
    return item;
  }
}
