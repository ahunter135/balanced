import { baseUrl } from "../../constants/http/urls";

const itemWebhookUrl = `${baseUrl}plaidItemWebhook`;

export type ItemWebhookCode = "ERROR" |
    "LOGIN_REPAIRED" |
    "PENDING_EXPIRATION" |
    "USER_PERMISSION_REVOKED" |
    "USER_ACCOUNT_REVOKED";

export type ItemWebhookBody = {
  webhook_type: "ITEM";
  webhook_code: ItemWebhookCode;
  item_id: string;
  error?: {
    error_code: string;
    error_message: string;
    error_type: string;
    display_message?: string;
    status: number;
  };
  environment: "sandbox" | "development" | "production";
};

export const mockPlaidItemErrorWebhook = (
  code: ItemWebhookCode,
  access_token: string,
) => {
  let body: ItemWebhookBody = {
    webhook_type: "ITEM",
    webhook_code: code,
    item_id: access_token,
    environment: "sandbox",
  };

  // Set proper error object dependign on webhook code
  switch (code) {
    case "ERROR":
      body["error"] = {
        error_code: "ITEM_LOGIN_REQUIRED",
        error_message: "Item requires user to login.",
        error_type: "ITEM_ERROR",
        status: 400,
      };
      break;
    case "USER_PERMISSION_REVOKED":
    case "USER_ACCOUNT_REVOKED":
      body["error"] = {
        error_code: "ACCESS_NOT_GRANTED",
        error_message: "Access has not been granted by the user.",
        error_type: "ITEM_ERROR",
        status: 400,
      };
      break;
  }
  postItemWebhook(body);
};

const postItemWebhook = async (body: ItemWebhookBody) => {
  const response = await fetch(itemWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("Error posting item webhook");
  }
};
