import { DocumentData, Query } from "firebase/firestore";
import { FirestoreDocument, FirestoreDocumentQueryResult} from "src/app/types/firestore/doc-data";

export interface IRepository<T extends FirestoreDocument> {
  getAll(): Promise<FirestoreDocumentQueryResult<T>>;

  getByQuery(query: Query): Promise<FirestoreDocumentQueryResult<T>>
}

export interface ICollectionRepository<T extends FirestoreDocument> extends IRepository<T>{
  get(id: string): Promise<T | undefined>;

  add(item: DocumentData, id?: string): Promise<T | undefined>;

  update(id: string, data: DocumentData): Promise<boolean>;

  delete(id: string, shouldHardDelete: boolean): Promise<boolean>;
}

export interface ISubCollectionRepository<T extends FirestoreDocument> extends IRepository<T> {
  get(...ids: string[]): Promise<T | undefined>;
  getAllFromParent(...ids: string[]): Promise<FirestoreDocumentQueryResult<T>>;

  add(...args: any[]): Promise<T | undefined>;

  update(...args: any[]): Promise<boolean>;

  delete (...args: any[]): Promise<boolean>;
}
