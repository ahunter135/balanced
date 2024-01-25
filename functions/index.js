/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { onRequest } = require("firebase-functions/v2/https");
const {
  Configuration,
  PlaidApi,
  Products,
  PlaidEnvironments,
} = require("plaid");

const {
  addLinkedAccount,
  addLinkedAccountSecret,
  deleteLinkedAccount,
  deleteLinkedAccountSecret,
  getLinkedAccountSecret,
  updateLinkedAccount,
} = require("./crud/linked-accounts");

require("dotenv").config();

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (
  process.env.PLAID_PRODUCTS || Products.Transactions
).split(",");

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
  ","
);

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";

// Parameter used for OAuth in Android. This should be the package name of your app,
// e.g. com.plaid.linksample
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || "";

const admin = require("firebase-admin");
const {
  USER_COLLECTION_NAME,
  LINKED_ACCOUNT_SUBCOLLECTION_NAME,
  LINKED_ACCOUNT_SECRET_SUBCOLLECTION_NAME,
} = require("./constants");
const { plaidItemWebhook, ITEM_WEBHOOK_URL } = require("./webhooks/item");
admin.initializeApp();

const configuration = getPlaidConfig();

const client = new PlaidApi(configuration);

exports.createPlaidLinkToken = onRequest({ cors: true }, async (req, res) => {
  if (!(await isUserPremium(req.body.user_id))) {
    res.status(403).send("This feature is only available to premium users");
    return;
  }
  try {
    // Note: Webhooks specified per item here
    const configs = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: req.body.user_id,
      },
      client_name: "WiseWallets",
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: "en",
      webhook: ITEM_WEBHOOK_URL,
    };

    const createTokenResponse = await client.linkTokenCreate(configs);
    res.status(200).send(createTokenResponse.data);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    return;
  }
});

exports.exchangePublicToken = onRequest({ cors: true }, async (req, res) => {
  if (!(await isUserPremium(req.body.userId))) {
    res.status(403).send("This feature is only available to premium users");
    return;
  }
  try {
    console.log(req.body);
    const tokenResponse = await client.itemPublicTokenExchange({
      public_token: req.body.publicToken,
    });
    const accessToken = tokenResponse.data.access_token;
    const institutionId = tokenResponse.data.item_id;
    const institutionName = req.body.institutionName;
    // Add linked account to user
    const linkedAccount = {
      institution_name: institutionName,
      institution: institutionId,
    };
    const linkedAccountRef = await addLinkedAccount(
      req.body.userId,
      linkedAccount
    );
    const linkedAccountId = linkedAccountRef.id;
    const linkedAccountSecret = {
      access_token: accessToken,
    };
    const linkedAccountSecretRef = await addLinkedAccountSecret(
      req.body.userId,
      linkedAccountId,
      linkedAccountSecret
    );
    const linkedAccountSecretId = linkedAccountSecretRef.id;
    /*
      if (PLAID_PRODUCTS.includes(Products.Transfer)) {
        TRANSFER_ID = await authorizeAndCreateTransfer(ACCESS_TOKEN);
      } */
    // Sync transactions from the Link item
    let { added, modified, removed } = await syncPlaidTransactions(
      accessToken,
      req.body.userId,
      linkedAccountId,
      linkedAccount
    );
    /* Initial Sync so remove transactions before today */
    const today = new Date().setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    added = filterPlaidTransactions(added, today, tomorrow);
    modified = filterPlaidTransactions(modified, today, tomorrow);
    removed = filterPlaidTransactions(removed, today, tomorrow);
    res.status(200).send({
      added,
      modified,
      removed,
      linkedAccountId,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    return;
  }
});

exports.relinkPlaidLinkToken = onRequest(
  { cors: true },
  async (req, res) => {
    if(!req.body.user_id ||
      !req.body.linked_account_id) {
      res.status(400).send({ message: "Missing required parameters" });
    }
    if (!(await isUserPremium(req.body.user_id))) {
      res.status(403).send({ message: "This feature is only available to premium users" });
      return;
    }
    try {
      const linkedAccountSecret = await getLinkedAccountSecret(
        req.body.user_id,
        req.body.linked_account_id
      );
      if (linkedAccountSecret.empty) {
        res.status(404).send("Linked account not found");
        return;
      }
      const accessToken = linkedAccountSecret.docs[0].data().access_token;

      const configs = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: req.body.user_id,
        },
        client_name: "WiseWallets",
        country_codes: PLAID_COUNTRY_CODES,
        language: "en",
        access_token: accessToken,
        webhook: ITEM_WEBHOOK_URL,
      };

      const createTokenResponse = await client.linkTokenCreate(configs);
      res.status(200).send(createTokenResponse.data);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
      return;
    }
  }
);

exports.getTransactionData = onRequest({ cors: true }, async (req, res) => {
  if (!(await isUserPremium(req.body.userId))) {
    res.status(403).send("This feature is only available to premium users");
    return;
  }
  try {
    const linkedAccountSecrets = await getLinkedAccountSecret(
      req.body.userId,
      req.body.linkedAccountId
    );
    if (linkedAccountSecrets.empty) {
      res.status(404).send("Linked account not found");
      return;
    }
    const accessToken = linkedAccountSecrets.docs[0].data().access_token;
    const { added, modified, removed } = await syncPlaidTransactions(
      accessToken,
      req.body.userId,
      req.body.linkedAccountId,
      req.body.linkedAccount
    );
    res.status(200).send({
      added,
      modified,
      removed,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    return;
  }
});

exports.getInstitutionName = onRequest({ cors: true }, async (req, res) => {
  let request = {
    access_token: req.body.accessToken,
  };
  try {
    const response = await client.itemGet(request);
    const item = response.data.item;
    const institution = item.institution_id;
    request = {
      institution_id: institution,
      country_codes: ["US"],
    };
    try {
      const response = await client.institutionsGetById(request);
      const institution = response.data.institution;

      res.send({ name: institution.name });
    } catch (error) {
      console.log(error);
      // Handle error
      res.send(error);
    }
  } catch (error) {
    console.log(error);
    // handle error
    res.send(error);
  }
});

/* Removes a linked account from a user, called when user initiates */
exports.removeLinkedAccount = onRequest(
  { cors: true },
  async (req, res) => {
    if(!req.body.linked_account_id ||
       !req.body.user_id) {
      res.status(400).send({ message: "Missing required parameters" });
      return;
    }

    const linkedAccountSecret = await getLinkedAccountSecret(
      req.body.user_id,
      req.body.linked_account_id
    );
    if (linkedAccountSecret.empty) {
      res.status(404).send("Linked account not found");
      return;
    }
    const accessToken = linkedAccountSecret.docs[0].data().access_token;
    const request = {
      access_token: accessToken,
    };
    try {
      const response = await client.itemRemove(request);
      /* Success, delete linked account doc */
      await deleteLinkedAccountSecret(
        req.body.user_id,
        req.body.linked_account_id,
        linkedAccountSecret.docs[0].id
      );
      await deleteLinkedAccount(
        req.body.user_id,
        req.body.linked_account_id
      );
      res.status(200).send({ message: "Linked account removed" });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
      return;
    }
  }
);

// This is a helper function to authorize and create a Transfer after successful
// exchange of a public_token for an access_token. The TRANSFER_ID is then used
// to obtain the data about that particular Transfer.
const authorizeAndCreateTransfer = async (accessToken) => {
  // We call /accounts/get to obtain first account_id - in production,
  // account_id's should be persisted in a data store and retrieved
  // from there.
  const accountsResponse = await client.accountsGet({
    access_token: accessToken,
  });
  const accountId = accountsResponse.data.accounts[0].account_id;

  const transferAuthorizationResponse =
    await client.transferAuthorizationCreate({
      access_token: accessToken,
      account_id: accountId,
      type: "credit",
      network: "ach",
      amount: "1.34",
      ach_class: "ppd",
      user: {
        legal_name: "FirstName LastName",
        email_address: "foobar@email.com",
        address: {
          street: "123 Main St.",
          city: "San Francisco",
          region: "CA",
          postal_code: "94053",
          country: "US",
        },
      },
    });
  const authorizationId = transferAuthorizationResponse.data.authorization.id;

  const transferResponse = await client.transferCreate({
    access_token: accessToken,
    account_id: accountId,
    authorization_id: authorizationId,
    description: "Payment",
  });
  prettyPrintResponse(transferResponse);
  return transferResponse.data.transfer.id;
};

const isUserPremium = async (userId) => {
  const user = await getUser(userId);
  return user.data().subscribed;
};

const syncPlaidTransactions = async (
  accessToken,
  userId,
  linkedAccountId,
  linkedAccount
) => {
  // New transaction updates since "cursor"
  let added = [];
  let modified = [];
  // Removed transaction ids
  let removed = [];
  let hasMore = true;
  let cursor = linkedAccount.transaction_sync_cursor;
  while (hasMore) {
    const request = {
      access_token: accessToken,
      cursor: cursor,
    };
    const response = await client.transactionsSync(request);
    console.log(response.status);
    const data = response.data;
    // Add this page of results
    added = added.concat(data.added);
    modified = modified.concat(data.modified);
    removed = removed.concat(data.removed);
    hasMore = data.has_more;
    console.log("hasMore: " + hasMore);
    // Update cursor to the next cursor
    cursor = data.next_cursor;
  }
  console.log("done syncing");
  linkedAccount.transaction_sync_cursor = cursor;
  linkedAccount.last_transaction_retrieval = new Date();
  await updateLinkedAccount(userId, linkedAccountId, linkedAccount);
  console.log("updated linked account");
  return {
    added,
    modified,
    removed,
  };
};


const getUser = async (userId) => {
  return admin
    .firestore()
    .collection(USER_COLLECTION_NAME)
    .doc(userId)
    .get();
};

const filterPlaidTransactions = (transactions, beginDate, endDate) => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= beginDate && transactionDate <= endDate;
  });
};

/* Return the plaid Configuration object based on the environment */
function getPlaidConfig() {
  const env = process.env.PLAID_ENV;
  let plaidClientId = process.env.PLAID_CLIENT_ID;
  let plaidSecret = undefined;

  if (!env) throw new Error("PLAID_ENV is not set");

  if (env == "sandbox") {
    plaidSecret = process.env.PLAID_SECRET_SANDBOX;
  } else if (env == "development") {
    plaidSecret = process.env.PLAID_SECRET_DEVELOPMENT;
  } else if (env == "production") {
    plaidSecret = process.env.PLAID_SECRET_PRODUCTION;
  } else {
    throw new Error(
      `PLAID_ENV is set to an invalid environment: ${env}. ` +
        `Valid values are sandbox, development, and production.`
    );
  }

  if (!plaidClientId || !plaidSecret) {
    throw new Error(
      `PLAID_CLIENT_ID and PLAID_SECRET are not set for PLAID_ENV=${env}`
    );
  }

  return new Configuration({
    basePath: PlaidEnvironments[env],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": plaidClientId,
        "PLAID-SECRET": plaidSecret,
        "Plaid-Version": "2020-09-14",
      },
    },
  });
}


// WEBHOOK EXPORTS
exports.plaidItemWebhook = plaidItemWebhook;
