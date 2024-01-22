import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LinkedAccountsRepositoryService } from 'src/app/repositories/linked-accounts-repository.service';
import { PlaidService } from 'src/app/services/plaid.service';
import { LinkedAccount, User } from 'src/app/types/firestore/user';

@Component({
  selector: 'app-view-linked-accounts',
  templateUrl: './view-linked-accounts.component.html',
  styleUrls: ['./view-linked-accounts.component.scss'],
})
export class ViewLinkedAccountsComponent  implements OnInit {
  /** Fetched in this component's ngOnInit() method.
    * Tab1 does not keep these values in memory, so
    * we'll just fetch them here.
    */
  linkedAccounts: LinkedAccount[] = [];
  loading = true;

  /* Pass through componentProps to the modal */
  user: User;

  constructor(
    public modalController: ModalController,
    private linkedAccountsRepository: LinkedAccountsRepositoryService,
    private plaidService: PlaidService,
  ) { }

  ngOnInit() {
    if (!this.user) {
      throw new Error("ViewLinkedAccountsComponent: user is undefined");
    }
    this.linkedAccountsRepository.getAllFromParent(this.user.id!)
      .then((linkedAccounts) => {
        this.loading = false;
        this.linkedAccounts = linkedAccounts.docs;
        this.linkedAccounts.push({
          id: "test",
          institution: "test",
          institution_name: "test ok",
          last_transaction_retrieval: new Date(),
          transaction_sync_cursor: "test",
          link_status: {
            required_action: "NONE",
            last_webhook: "ERROR",
          },
        });
        this.linkedAccounts.push({
          id: "test",
          institution: "test",
          institution_name: "test relink",
          last_transaction_retrieval: new Date(),
          transaction_sync_cursor: "test",
          link_status: {
            required_action: "RELINK",
            last_webhook: "ERROR",
          },
        });
        this.linkedAccounts.push({
          id: "test",
          institution: "test",
          institution_name: "test pending exp",
          last_transaction_retrieval: new Date(),
          transaction_sync_cursor: "test",
          link_status: {
            required_action: "NOTIFY_PENDING_EXPIRATION",
            last_webhook: "ERROR",
          },
        });
      }
    );
  }

  async removeLinkedAccount(linkedAccount: LinkedAccount) {
    this.plaidService.removePlaidLinkedAccount(linkedAccount);
    this.linkedAccounts = this.linkedAccounts.filter((la) => la.id !== linkedAccount.id);
  }

  async handleLinkedAccountAction(linkedAccount: LinkedAccount) {
    switch (linkedAccount.link_status.required_action) {
      case "RELINK":
      case "NOTIFY_PENDING_EXPIRATION":
        this.relinkLinkedAccount(linkedAccount);
        break;
      case "NONE":
        break;
      default:
        throw new Error("ViewLinkedAccountsComponent: unknown required_action");
    }
  }

  private async relinkLinkedAccount(linkedAccount: LinkedAccount) {
    console.log("relinking linked account");
  }

}
