import { NumberMonthYear } from "../dates/dates";
import { FirestoreDocument } from "./doc-data";

export type User = FirestoreDocument & {
  email: string;
  name: string;
  subscribed: boolean;
  categories?: Array<Category>; // optional because these may or may not be attached to the user at all times
  encryption_data?: UserEncryptionData;
}

export type UserEncryptionData = {
  /* Surrogate key encrypted with three different keys */
  surrogate_key_password: string;          // Deprecated
  surrogate_key_backup_phrase: string;
  surrogate_key_refresh_token: string;     // Deprecated

  /* Salts used for key derivation */
  password_kdf_salt: string;               // Deprecated
  backup_phrase_kdf_salt: string;
  refresh_token_kdf_salt: string;          // Deprecated

  /** New session persistence and login data
    * This replaces the insecure and bad version
    * that used the plaintext password and refresh token
    */
  surrogate_key_hashed_password: string;
  hashed_password_salt: string;

}

/* Subcollection of User */
export type Category = FirestoreDocument & {
  index: number;
  subcategories?: Array<Subcategory>; // optional may not be attached at all times
  editable: boolean;
}

/* Subcollection of Category */
export type Subcategory = FirestoreDocument & {
  text: string;
  date: NumberMonthYear,
  index: number;
  planned_amount: number;
  actual_amount: number;
  isEditing: boolean;
}

/* Subcollection of User */
export type Transaction = FirestoreDocument & {
  amount: number;
  subcategoryId: string;
  date: Date;
  name: string;
  merchant_name: string;
  pending: boolean;

  /** Encryped fields. Repository class will be responsible for
    * encrypting and decrypting these fields.
    * amount, name, and merchant_name are encrypted.
    * subcategoryId, date, and pending are not encrypted
    * because they are not sensitive and are used for querying.
    */
  encrypted_string?: string;
}

/* Subcollection of User */
export type LinkedAccount = FirestoreDocument & {
  institution: string;
  institution_name: string;
  last_transaction_retrieval: Date;
  transaction_sync_cursor: string;
  link_status?: LinkedAccountStatus;
}

/** This seems a little abstract, but it serves as a way
  * to keep track of the status of a linked account.
  * These fields should let the frontend know what to do
  * with the linked account.
  */
export type LinkedAccountStatus = {
  required_action: "RELINK" |
    "ACKNOWLEDGE_REVOKED" |
    "NOTIFY_PENDING_EXPIRATION" |
    "NONE";
  // There are some more, but these are the ones we care about
  last_webhook: "ERROR" |
    "LOGIN_REPAIRED" |
    "PENDING_EXPIRATION" |
    "USER_PERMISSION_REVOKED" | // revoked ones will never be used because we deleted linked accounts
    "USER_ACCOUNT_REVOKED" |
    "NONE";
}
