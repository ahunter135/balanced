import { CollectionReference, DocumentData, Query } from "firebase/firestore";
import { FirestoreDocument, FirestoreDocumentQueryResult} from "src/app/types/firestore/doc-data";

export interface ICollectionRepository<T extends FirestoreDocument> {
  get(id: string): Promise<T | undefined>;
  getAll(): Promise<FirestoreDocumentQueryResult<T>>;
  getByQuery(query: Query): Promise<FirestoreDocumentQueryResult<T>>;

  add(item: DocumentData, id?: string): Promise<T | undefined>;

  update(id: string, data: DocumentData): Promise<boolean>;

  delete(id: string, shouldHardDelete: boolean): Promise<boolean>;
}

export interface ISubCollectionRepository<T extends FirestoreDocument> {
  get(...ids: string[]): Promise<T | undefined>;
  getAll(): Promise<FirestoreDocumentQueryResult<T>>;
  getAllFromParent(...ids: string[]): Promise<FirestoreDocumentQueryResult<T>>;
  getByQuery(query: Query): Promise<FirestoreDocumentQueryResult<T>>;

  add(...args: any[]): Promise<T | undefined>;

  update(...args: any[]): Promise<boolean>;

  delete (...args: any[]): Promise<boolean>;
}
