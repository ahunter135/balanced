import { DocumentData, Query } from "firebase/firestore";
import { FirestoreDocument, FirestoreDocumentQueryResult} from "src/app/types/firestore/doc-data";

export interface IRepository<T extends FirestoreDocument> {
  get(id: string): Promise<T | undefined>;
  getAll(): Promise<FirestoreDocumentQueryResult<T>>;
  getByQuery(query: Query): Promise<FirestoreDocumentQueryResult<T>>;

  add(item: DocumentData, id?: string): Promise<T | undefined>;

  update(id: string, data: DocumentData): Promise<boolean>;

  delete(id: string, shouldHardDelete: boolean): Promise<boolean>;
}
