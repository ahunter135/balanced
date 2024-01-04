import { Injectable } from '@angular/core';
import { CATEGORIES_SUBCOLLECTION_NAME, SUBCATEGORIES_SUBCOLLECTION_NAME, USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
import { CollectionReference, DocumentData, Query, collection, doc, getFirestore, runTransaction } from 'firebase/firestore';
import { SubCollectionRepository } from './subcollection-repository';
import { Subcategory } from '../types/firestore/user';
import { FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { ISubCollectionRepository } from './interfaces/repository';
import { CLONE_PROPERTY, isObjectClone } from '../helpers/firestore/repository-helpers';

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
    subcategory = this.cloneAndRemoveProperties(subcategory);
    return super._add(SubcategoryRepositoryService.makeCollectionRef(userId, categoryId), subcategory, id);
  }

  async update(userId: string, categoryId: string, subcategoryId: string, subcategory: DocumentData): Promise<boolean> {
    subcategory = this.cloneAndRemoveProperties(subcategory);
    return super._update(SubcategoryRepositoryService.makeCollectionRef(userId, categoryId), subcategoryId, subcategory);
  }

  async updateActualAmountAtomic(
    userId: string,
    categoryId: string,
    subcategoryId: string,
    amountToAdd: number,
  ): Promise<boolean> {
    await runTransaction(getFirestore(), async (t) => {
      const subcategoryRef = SubcategoryRepositoryService.makeCollectionRef(userId, categoryId);
      const subcategoryDoc = doc(subcategoryRef, subcategoryId);
      const subcategory = await t.get(subcategoryDoc);
      if (!subcategory.exists()) {
        throw new Error('Subcategory does not exist');
      }
      const oldActualAmount = subcategory.data()['actual_amount'];
      t.update(subcategoryDoc, {
        actual_amount: oldActualAmount + amountToAdd,
      });
    });
    return true;
  }

  async delete(userId: string, categoryId: string, subcategoryId: string, shouldHardDelete: boolean = false): Promise<boolean> {
    return super._delete(SubcategoryRepositoryService.makeCollectionRef(userId, categoryId), subcategoryId, shouldHardDelete);
  }

  static makeCollectionRef(userId: string, categoryId: string): CollectionReference<DocumentData> {
    return collection(getFirestore(), USER_COLLECTION_NAME, userId, CATEGORIES_SUBCOLLECTION_NAME, categoryId, SUBCATEGORIES_SUBCOLLECTION_NAME);
  }

  protected cloneAndRemoveProperties(item: DocumentData): DocumentData {
    if (!isObjectClone(item)) {
      item = structuredClone(item);
      /* Let superclasses know we have already cloned this item */
      item[CLONE_PROPERTY] = true;
    }

    if (item['isEditing'] != undefined) {
      delete item['isEditing'];
    }

    return item;
  }
}
