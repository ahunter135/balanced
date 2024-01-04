export type PlaidTransaction = {
  transaction_id: string;
  amount: number;
  date: string;
  datetime: string;
  name: string;
  merchant_name: string;
  pending: boolean;
}

export type PlaidHandler = {
  /* Open the Plaid Link interface. */
  open: () => void;
  /** Close the Plaid Link interface.
    * Triggers onSuccess or onExit callbacks.
    */
  exit: () => void;
  /* Cleans up DOM elements used by Plaid Link. */
  destroy: () => void;
};

export type PlaidHandlerCreation = {
  token: string;
  onSuccess: PlaidOnSuccessCallback;
  onExit: PlaidOnExitCallback;
  onLoad: PlaidOnLoadCallback;
  onEvent: PlaidOnEventCallback;
  /* Required for OAuth flows; if not using OAuth, set to null. */
  receivedRedirectUri: string | null;
};

/* Called when user successfully links an item. */
export type PlaidOnSuccessCallback =
  (publicToken: string, metadata: PlaidOnSuccessMetadata) => void;

/** Called when user exits the Link flow
  * without successfully linking an item.
  */
export type PlaidOnExitCallback =
  (error: object | null, metadata: object) => void;

/** Called when the Plaid Prompt first shows */
export type PlaidOnLoadCallback = () => void;

/** Called anytime something happens in the Plaid Prompt */
export type PlaidOnEventCallback =
  (eventName: string, metadata: object) => void;

export type PlaidOnSuccessMetadata = {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: Array<{
    id: string;
    name: string;
    mask?: string; // This could be string 'null'
    type: string;
    subtype: string;
    verification_status: PlaidVerificationStatus;
    class_type?: string; // This could be string 'null'
  }>;
  link_session_id: string;
  transfer_status?: 'COMPLETE' | 'INCOMPLETE'; // This could be string 'null'
};

export type PlaidVerificationStatus =
  'pending_automatic_verification' |
  'pending_manual_verification' |
  'manually_verified' |
  'automatically_verified' |
  'verification_expired' |
  'verification_failed' |
  null; // This might be 'null'
