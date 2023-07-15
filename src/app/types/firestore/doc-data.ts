import { DocumentData } from "firebase/firestore";

export type FirestoreDocument = DocumentData & {
  id?: string; // optional, bc will not know this prior to creating the document
  is_deleted?: boolean;
}

export type FirestoreDocumentQueryResult<T extends FirestoreDocument> = {
  size: number;
  docs: T[];
}
