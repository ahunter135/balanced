import { environment } from "src/environments/environment";

export const baseUrl = environment.useFunctionsEmulator && !environment.production ?
  'http://localhost:5001/balanced-budget-90f1f/us-central1/' :
  'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/';

export const GET_TRANSACTION_DATA_URL = baseUrl + 'getTransactionData';

export const CREATE_PLAID_LINK_TOKEN_URL = baseUrl + 'createPlaidLinkToken';

export const EXCHANGE_PLAID_PUBLIC_TOKEN_URL = baseUrl + 'exchangePublicToken';

export const GET_INSTITUTION_NAME_URL = baseUrl + 'getInstitutionName';

export const REMOVE_LINKED_ACCOUNT_URL = baseUrl + 'removeLinkedAccount';
