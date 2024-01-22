import { LinkedAccount } from "../firestore/user";

/** An extension of the LinkedAccount type that adds
  * a linkStatus property. This is used to determine
  * whether the account is linked or unlinked, and to
  * display the status in the modal.
  */
export type LinkedAccountModal = LinkedAccount & {
  linkStatus?: "linked" | "unlinked";
};
