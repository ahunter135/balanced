import { FirestoreDocument, FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { CollectionReference, DocumentData, Query, collection, collectionGroup, getDocs, getFirestore, query, } from 'firebase/firestore';
import { CollectionRepository } from './collection-repository';
import { Firestore } from '@angular/fire/firestore';

export class SubCollectionRepository<T extends FirestoreDocument> {

  private collectionRepository: CollectionRepository<T>;
  readonly db: Firestore;

  constructor(
    private subCollectionName: string,
  ) {
    this.collectionRepository = new CollectionRepository<T>();
    this.db = this.collectionRepository.db;
  }
  protected async _get(collectionRef: CollectionReference<DocumentData>, id: string): Promise<T | undefined> {
    this.collectionRepository.collectionRef = collectionRef;
    return this.collectionRepository.get(id);
  }

  protected async _getAll(): Promise<FirestoreDocumentQueryResult<T>> {
    const result = await getDocs(query(collectionGroup(getFirestore(), this.subCollectionName)));
    return {
      size: result.size,
      docs: this.collectionRepository.mapDocsToData(result.docs)
    }
  }

  protected async _getAllFromParent(parentCollectionRef: CollectionReference<DocumentData>): Promise<FirestoreDocumentQueryResult<T>> {
    this.collectionRepository.collectionRef = parentCollectionRef;
    return this.collectionRepository.getAll();
  }

  protected async _getByQuery(query: Query<DocumentData>): Promise<FirestoreDocumentQueryResult<T>> {
    return this.collectionRepository.getByQuery(query);
  }

  protected async _add(collectionRef: CollectionReference<DocumentData>, item: DocumentData, id?: string | undefined): Promise<T | undefined> {
    this.collectionRepository.collectionRef = collectionRef;
    return this.collectionRepository.add(item, id);
  }

  protected async _update(collectionRef: CollectionReference<DocumentData>, id: string, data: DocumentData): Promise<boolean> {
    this.collectionRepository.collectionRef = collectionRef;
    return this.collectionRepository.update(id, data);
  }

  protected async _delete(collectionRef: CollectionReference<DocumentData>, id: string, shouldHardDelete: boolean = false): Promise<boolean> {
    this.collectionRepository.collectionRef = collectionRef;
    return this.collectionRepository.delete(id, shouldHardDelete);
  }
}
