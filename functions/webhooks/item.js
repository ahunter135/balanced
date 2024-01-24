const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const {
  queryForAccessToken,
  updateLinkedAccountStatus,
  deleteLinkedAccount,
  deleteLinkedAccountSecret
} = require("../crud/linked-accounts");

exports.ITEM_WEBHOOK_URL = "https://plaiditemwebhook-x7msx3awhq-uc.a.run.app";


/** Plaid webhook for item events. Docs: https://plaid.com/docs/api/items/
  * This webhook is responsible for handling events related to items (access tokens).
  * The events we care about are:
  * - ERROR: Indicates that the item is no longer valid
  * - LOGIN_REPAIRED: Indicates that the user has taken action to repair the item
  * - PENDING_EXPIRATION: Indicates that the access token is nearing expiration
  * - USER_PERMISSION_REVOKED: Indicates that the user has revoked access to the item
  * - USER_ACCOUNT_REVOKED: Indicates that the user has revoked access to an account
  * We will update the linked account doc to accurately reflect the status of the item.
  * The front end will be responsible for checking the linked account status and notifying
  * the user.
  */
exports.plaidItemWebhook = onRequest(
  /* TODO: set cors to plaid domain */
  { cors: true },
  async (req, res) => {
    // Sanity checks here
    if (req.method !== "POST") {
      res.status(400).send("Invalid request method");
      return;
    }
    if (!req.body ||
      !req.body.webhook_type ||
      req.body.webhook_type !== "ITEM" ||
      !req.body.webhook_code ||
      !req.body.item_id
    ) {
      res.status(400).send("Invalid request body");
      return;
    }

    let linkedAccountSecretDoc;
    try {
      // Get the access token from the item id
      linkedAccountSecretDoc = await queryForAccessToken(
        req.body.item_id
      );
      if (!linkedAccountSecretDoc) {
        throw new Error();
      }
    } catch (err) {
      res.status(400).send("Yo bro, we don't have that :(");
      return;
    }
    // The linked account doc is the parent of the linked account secret doc
    const linkedAccountDoc = linkedAccountSecretDoc.ref.parent.parent;

    try {
      switch (req.body.webhook_code) {
        case "ERROR":
          if (!req.body.error &&
            req.body.error.error_code != "ITEM_LOGIN_REQUIRED")
            break;
          await plaidItemWebhookOnError(linkedAccountDoc);
          break;
        case "LOGIN_REPAIRED":
          await plaidItemWebhookOnLoginRepaired(linkedAccountDoc);
          break;
        case "PENDING_EXPIRATION":
          await plaidItemWebhookOnPendingExpiration(linkedAccountDoc);
          break;
        case "USER_PERMISSION_REVOKED":
        case "USER_ACCOUNT_REVOKED":
          await plaidItemWebhookOnRevoked(
            linkedAccountDoc,
            linkedAccountSecretDoc
          );
          break;
        default:
          throw new Error("Invalid webhook code");
      }
      res.status(200).send("OK");
      return;
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
      return;
    }
  }
);


// Handlers for each webhook code

/** On error, changet the required_action to "relink" and set the
  * last_webhook to "ERROR"
  */
const plaidItemWebhookOnError = async (linkedAccountDoc) => {
  await updateLinkedAccountStatus(
    linkedAccountDoc,
    "RELINK",
    "ERROR"
  );
};

/** On login repaired, set the required_action to "NONE" and set the
  * last_webhook to "LOGIN_REPAIRED"
  */
const plaidItemWebhookOnLoginRepaired = async (linkedAccountDoc) => {
  await updateLinkedAccountStatus(
    linkedAccountDoc,
    "NONE",
    "LOGIN_REPAIRED"
  );
};

/** On pending expiration, set the required_action to "NOTIFY_PENDING_EXPIRATION"
  * and set the last_webhook to "PENDING_EXPIRATION"
  */
const plaidItemWebhookOnPendingExpiration = async (linkedAccountDoc) => {
  await updateLinkedAccountStatus(
    linkedAccountDoc,
    "NOTIFY_PENDING_EXPIRATION",
    "PENDING_EXPIRATION"
  );
};

// Both revoked events mean item is donezo, so handle the same way
// On revoked, delete the linked account doc and its secret subcollection
const plaidItemWebhookOnRevoked = async (
  linkedAccountDoc,
  linkedAccountSecretDoc
) => {
  await deleteLinkedAccountSecret(
    linkedAccountDoc.id,
    linkedAccountSecretDoc.id
  );
  await deleteLinkedAccount(
    linkedAccountDoc.id
  );
};
