import { IRepository } from './interfaces/repository';
import { FirestoreDocument, FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { CollectionReference, DocumentData, Query, collection, collectionGroup, getDocs, getFirestore, query, } from 'firebase/firestore';
import { CollectionRepository } from './collection-repository';

export class SubCollectionRepository<T extends FirestoreDocument> implements IRepository<T> {

  private collectionRepository: CollectionRepository<T>;

  constructor(
    private collectionArgsInArray: string[],
  ) {
    // the best way to describe this is that we are building a collection reference from n number of base collections
    // the array will contain the base colleciton at pos 0, its id at pos 1, and so on
    // example: ['users', userId, 'posts', postId, 'comments']
    // the last item will be the subcollection name
    this.collectionRepository = new CollectionRepository<T>(this.buildCollectionRef(collectionArgsInArray));
  }
  async get(id: string): Promise<T | undefined> {
    return this.collectionRepository.get(id);
  }

  async getAll(): Promise<FirestoreDocumentQueryResult<T>> {
    const result = await getDocs(query(collectionGroup(getFirestore(), this.collectionArgsInArray[this.collectionArgsInArray.length - 1])));
    return {
      size: result.size,
      docs: this.collectionRepository.mapDocsToData(result.docs)
    }
  }

  async getByQuery(query: Query<DocumentData>): Promise<FirestoreDocumentQueryResult<T>> {
    return this.collectionRepository.getByQuery(query);
  }

  async add(item: DocumentData, id?: string | undefined): Promise<T | undefined> {
    return this.collectionRepository.add(item, id);
  }

  async update(id: string, data: DocumentData): Promise<boolean> {
    return this.collectionRepository.update(id, data);
  }

  async delete(id: string, shouldHardDelete: boolean = false): Promise<boolean> {
    return this.collectionRepository.delete(id, shouldHardDelete);
  }

  private buildCollectionRef(collectionArgsInArray: string[]): CollectionReference<DocumentData> {
    if (collectionArgsInArray.length < 2) throw new Error('SubCollectionRepository must have at least 2');
    const baseCollectionName = collectionArgsInArray.splice(0, 1)[0];
    return collection(getFirestore(), baseCollectionName, ...collectionArgsInArray);
  }

}
