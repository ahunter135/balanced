const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");


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

    try {
      switch (req.body.webhook_code) {
        case "ERROR":
          await plaidItemWebhookOnError(req.body);
          break;
        case "LOGIN_REPAIRED":
          await plaidItemWebhookOnLoginRepaired(req.body);
          break;
        case "PENDING_EXPIRATION":
          await plaidItemWebhookOnPendingExpiration(req.body);
          break;
        case "USER_PERMISSION_REVOKED":
        case "USER_ACCOUNT_REVOKED":
          await plaidItemWebhookOnRevoked(req.body);
          break;
        default:
          throw new Error("Invalid webhook code");
      }
    } catch (err) {

    }
  }
);


// Handlers for each webhook code


const plaidItemWebhookOnError = async (body) => {

};

const plaidItemWebhookOnLoginRepaired = async (body) => {

};

const plaidItemWebhookOnPendingExpiration = async (body) => {

};

// Both revoked events mean item is donezo, so handle the same way
const plaidItemWebhookOnRevoked = async (body) => {

};
