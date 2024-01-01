import { Configuration, PlaidEnvironments } from "plaid";

export const environment = {
  firebase: {
    projectId: 'balanced-budget-90f1f',
    appId: '1:51779442445:web:ebf0f4040d9171a1d1c244',
    storageBucket: 'balanced-budget-90f1f.appspot.com',
    apiKey: 'AIzaSyBGdK3o6G9Hbwl3GyEkcfU6Vuyi7BGUwsI',
    authDomain: 'balanced-budget-90f1f.firebaseapp.com',
    messagingSenderId: '51779442445',
    measurementId: 'G-X448BHFKZT',
  },
  production: true
};

export const plaidConfig: Configuration = new Configuration({
  /* What api environment to use. 'sandbox' or 'development' or 'production' */
  basePath: PlaidEnvironments['production'], /*'https://sandbox.plaid.com',*/
  /* Might need more here */
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': '', // IDK
      'PLAID-SECRET': '', // IDK
    },
  },
});
