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
      }
    );
  }

  async removeLinkedAccount(linkedAccount: LinkedAccount) {
    this.plaidService.removePlaidLinkedAccount(linkedAccount);
    this.linkedAccounts = this.linkedAccounts.filter((la) => la.id !== linkedAccount.id);
  }

  async handleLinkedAccountAction(linkedAccount: LinkedAccount) {
    if (!linkedAccount.link_status) {
      return; // Same as NONE
    }
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

  async link() {
    this.modalController.dismiss();
    this.plaidService.linkPlaidToUser();
  }

  private async relinkLinkedAccount(linkedAccount: LinkedAccount) {
    this.plaidService.relinkPlaidLinkedAccount(linkedAccount);
  }

}
