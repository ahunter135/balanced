const admin = require("firebase-admin");
const {
  LINKED_ACCOUNT_SECRET_SUBCOLLECTION_NAME,
  LINKED_ACCOUNT_SUBCOLLECTION_NAME,
  USER_COLLECTION_NAME
} = require("../constants");


const addLinkedAccount = async (userId, linkedAccount) => {
  return admin
    .firestore()
    .collection(USER_COLLECTION_NAME)
    .doc(userId)
    .collection(LINKED_ACCOUNT_SUBCOLLECTION_NAME)
    .add(linkedAccount);
};

const updateLinkedAccount = async (userId, linkedAccountId, linkedAccount) => {
  return admin
    .firestore()
    .collection(USER_COLLECTION_NAME)
    .doc(userId)
    .collection(LINKED_ACCOUNT_SUBCOLLECTION_NAME)
    .doc(linkedAccountId)
    .set(linkedAccount);
};

const deleteLinkedAccount = async (userId, linkedAccountId) => {
  return admin
    .firestore()
    .collection(USER_COLLECTION_NAME)
    .doc(userId)
    .collection(LINKED_ACCOUNT_SUBCOLLECTION_NAME)
    .doc(linkedAccountId)
    .delete();
};

const addLinkedAccountSecret = async (
  userId,
  linkedAccountId,
  linkedAccountSecret
) => {
  return admin
    .firestore()
    .collection(USER_COLLECTION_NAME)
    .doc(userId)
    .collection(LINKED_ACCOUNT_SUBCOLLECTION_NAME)
    .doc(linkedAccountId)
    .collection(LINKED_ACCOUNT_SECRET_SUBCOLLECTION_NAME)
    .add(linkedAccountSecret);
};

const updateLinkedAccountSecret = async (
  userId,
  linkedAccountId,
  linkedAccountSecretId,
  linkedAccountSecret
) => {
  return admin
    .firestore()
    .collection(USER_COLLECTION_NAME)
    .doc(userId)
    .collection(LINKED_ACCOUNT_SUBCOLLECTION_NAME)
    .doc(linkedAccountId)
    .collection(LINKED_ACCOUNT_SECRET_SUBCOLLECTION_NAME)
    .doc(linkedAccountSecretId)
    .set(linkedAccountSecret);
};

const getLinkedAccountSecret = async (userId, linkedAccountId) => {
  return admin
    .firestore()
    .collection(USER_COLLECTION_NAME)
    .doc(userId)
    .collection(LINKED_ACCOUNT_SUBCOLLECTION_NAME)
    .doc(linkedAccountId)
    .collection(LINKED_ACCOUNT_SECRET_SUBCOLLECTION_NAME)
    .get();
};

const deleteLinkedAccountSecret = async (
  userId,
  linkedAccountId,
  linkedAccountSecretId
) => {
  return admin
    .firestore()
    .collection(USER_COLLECTION_NAME)
    .doc(userId)
    .collection(LINKED_ACCOUNT_SUBCOLLECTION_NAME)
    .doc(linkedAccountId)
    .collection(LINKED_ACCOUNT_SECRET_SUBCOLLECTION_NAME)
    .doc(linkedAccountSecretId)
    .delete();
}

const updateLinkedAccountStatus = async (
  linkedAccountDoc,
  requiredAction,
  lastWebhook
) => {
  await linkedAccountDoc.update({
    'link_status.required_action': requiredAction,
    'link_status.last_webhook': lastWebhook
  });
};

const queryForAccessToken = async (accessToken) => {
  const querySnapshot = await admin.firestore()
    .collectionGroup(LINKED_ACCOUNT_SECRET_SUBCOLLECTION_NAME)
    .where("access_token", "==", accessToken)
    .get();
  if (querySnapshot.empty) {
    throw new Error("No access token found");
  }
  if (querySnapshot.size > 1) {
    throw new Error("More than one access token found");
  }
  return querySnapshot.docs[0];
};

exports.addLinkedAccount = addLinkedAccount;
exports.updateLinkedAccount = updateLinkedAccount;
exports.deleteLinkedAccount = deleteLinkedAccount;

exports.addLinkedAccountSecret = addLinkedAccountSecret;
exports.updateLinkedAccountSecret = updateLinkedAccountSecret;
exports.getLinkedAccountSecret = getLinkedAccountSecret;
exports.deleteLinkedAccountSecret = deleteLinkedAccountSecret;

exports.queryForAccessToken = queryForAccessToken;
exports.updateLinkedAccountStatus = updateLinkedAccountStatus;
