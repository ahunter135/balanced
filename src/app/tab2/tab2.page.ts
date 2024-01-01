import { Component } from '@angular/core';
import { HttpService } from '../services/http.service';
import {
  updateDoc,
  doc,
  getFirestore,
  addDoc,
  collection,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { UserService } from '../services/user.service';
import { TransactionSorterComponent } from '../modals/transaction-sorter/transaction-sorter.component';
import { ModalController } from '@ionic/angular';
import { UserRepositoryService } from '../repositories/user-repository.service';
declare var Plaid: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  user = {} as any;
  transactions = [] as any;
  institutions = [] as any;
  institutionName = '';
  selectedInstitute: any;

  constructor(
    private http: HttpService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private userRepository: UserRepositoryService,
  ) {}

  ngOnInit() {
    // this.getInstitutionName();
    this.getInstitutions();
  }

  async retrieveTransactions() {
    this.http
      .post(
        'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/getTransactionData',
        {
          accessToken: this.selectedInstitute.access_token,
        }
      )
      .subscribe((resp) => {
        console.log(resp);
        this.transactions = resp.added;
        this.sortTransactions();
        this.user.last_transaction_retrieval = new Date().toISOString();
        updateDoc(
          doc(
            getFirestore(),
            'users/',
            this.userRepository.getCurrentUserId()!,
            'linked_accounts',
            this.selectedInstitute.id
          ),
          {
            last_transaction_retrieval: new Date().toISOString(),
          }
        );
      });
  }
  async sortTransactions() {
    this.transactions.sort((a: any, b: any) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }

  async openTransactionSorter(index: number) {
    const modal = await this.modalCtrl.create({
      component: TransactionSorterComponent,
      componentProps: {
        transaction: this.transactions[index],
      },
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 0.8, 1],
    });

    modal.present();
  }

  async link() {
    this.http
      .post(
        'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/createPlaidLinkToken',
        {

          user_id: this.userRepository.getCurrentUserId()!,
        }
      )
      .subscribe((resp) => {
        console.log(resp);
        const handler = Plaid.create({
          token: resp.link_token,
          onSuccess: (public_token: string, metadata: any) => {
            this.http
              .post(
                'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/exchangePublicToken',
                { public_token }
              )
              .subscribe(async (resp) => {
                console.log(resp);
                /**
              {
                access_token: "access-sandbox-477ca4f5-493b-486b-b18e-9e339f501da6" This is the required access token to make requests
                error: null
                item_id: "yQkDd5JLpVIK14D4WR5JCVDvKwDzDztyvaBD5" This is the financial institution
              }
             */
                const accessToken = resp.access_token;
                const institution = resp.item_id;
                const id = this.userService.generateRandomId();
                const name = await this.getInstitutionName(accessToken);
                setDoc(
                  doc(
                    getFirestore(),
                    'users/',
                    this.userRepository.getCurrentUserId()!,
                    'linked_accounts',
                    id
                  ),
                  {
                    access_token: accessToken,
                    institution,
                    name,
                    id,
                  }
                );
              });
          },
          onLoad: () => {
            // This fires when the Plaid Prompt shows up for the first time
          },
          onExit: (err: any, metadata: any) => {},
          onEvent: (eventName: any, metadata: any) => {
            // This fires any time something happens within the Plaid Prompt
          },
          //required for OAuth; if not using OAuth, set to null or omit:
          receivedRedirectUri: null,
        });
        handler.open();
      });
  }

  async getInstitutions() {
    const linked_accounts = await getDocs(
      collection(
        getFirestore(),
        'users',
        this.userRepository.getCurrentUserId()!,
        'linked_accounts'
      )
    );
    if (!linked_accounts.empty) {
      linked_accounts.forEach((acc) => {
        this.institutions.push(acc.data());
      });

      this.selectedInstitute = this.institutions[0];
      if (this.selectedInstitute) {
        this.retrieveTransactions();
      }
    }
  }
  async getInstitutionName(token: string) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/getInstitutionName',
          {
            accessToken: token,
          }
        )
        .subscribe((resp) => {
          console.log(resp);
          this.institutionName = resp.name;
          resolve(resp.name);
        });
    });
  }
}
