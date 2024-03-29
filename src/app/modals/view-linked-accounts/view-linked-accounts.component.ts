import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LinkedAccountsRepositoryService } from 'src/app/repositories/linked-accounts-repository.service';
import { FinicityService } from 'src/app/services/finicity.service';
import { PlaidService } from 'src/app/services/plaid.service';
import { LinkedAccount, User } from 'src/app/types/firestore/user';

@Component({
  selector: 'app-view-linked-accounts',
  templateUrl: './view-linked-accounts.component.html',
  styleUrls: ['./view-linked-accounts.component.scss'],
})
export class ViewLinkedAccountsComponent implements OnInit {
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
    private finicityService: FinicityService
  ) {}

  ngOnInit() {
    if (!this.user) {
      throw new Error('ViewLinkedAccountsComponent: user is undefined');
    }
    this.linkedAccountsRepository
      .getAllFromParent(this.user.id!)
      .then(async (linkedAccounts) => {
        this.loading = false;
        this.linkedAccounts = linkedAccounts.docs;
        console.log(this.linkedAccounts);

        for (let i = 0; i < this.linkedAccounts.length; i++) {
          if (this.linkedAccounts[i].isFinicity) {
            let institution: any =
              await this.finicityService.getInstitutionById(
                this.linkedAccounts[i].institutionId as string
              );

            this.linkedAccounts[i].institution_name = institution.name;
          }
        }
      });
  }

  async removeLinkedAccount(linkedAccount: LinkedAccount) {
    this.plaidService.removePlaidLinkedAccount(linkedAccount);
    this.linkedAccounts = this.linkedAccounts.filter(
      (la) => la.id !== linkedAccount.id
    );
  }

  async handleLinkedAccountAction(linkedAccount: LinkedAccount) {
    if (!linkedAccount.link_status) {
      return; // Same as NONE
    }
    switch (linkedAccount.link_status.required_action) {
      case 'RELINK':
      case 'NOTIFY_PENDING_EXPIRATION':
        this.relinkLinkedAccount(linkedAccount);
        break;
      case 'NONE':
        break;
      default:
        throw new Error('ViewLinkedAccountsComponent: unknown required_action');
    }
  }

  async link() {
    this.modalController.dismiss(1);
  }

  // On successful relink, change the local linked account's status
  async onRelinkSuccessCallback(linkedAccountId: string) {
    const linkedAccount = this.linkedAccounts.find(
      (la) => la.id === linkedAccountId
    );
    if (!linkedAccount) {
      return; // What?
    }
    if (!linkedAccount.link_status) {
      return; // No way this should happen
    }
    linkedAccount.link_status = {
      required_action: 'NONE',
      last_webhook: linkedAccount.link_status.last_webhook,
    };
  }

  private async relinkLinkedAccount(linkedAccount: LinkedAccount) {
    this.plaidService.relinkPlaidLinkedAccount(
      linkedAccount,
      this.onRelinkSuccessCallback.bind(this)
    );
  }
}
