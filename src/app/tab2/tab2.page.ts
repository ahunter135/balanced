import { Component } from '@angular/core';
import { HttpService } from '../services/http.service';
import { updateDoc, doc, getFirestore } from '@angular/fire/firestore';
declare var Plaid: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  user = {} as any;
  transactions = [] as any;

  institutionName = '';

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.getInstitutionName();
  }

  async retrieveTransactions() {
    this.http
      .post(
        'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/getTransactionData',
        {
          accessToken: this.user.access_token,
        }
      )
      .subscribe((resp) => {
        console.log(resp);
        this.transactions = resp.added;
        this.sortTransactions();
        this.user.last_transaction_retrieval = new Date().toISOString();
        updateDoc(
          doc(getFirestore(), 'users/', 'fGdpBS7gMTMxqJe7IOcfMgJ3L3i2'),
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

  async link() {
    this.http
      .post(
        'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/createPlaidLinkToken',
        {
          user_id: 'fGdpBS7gMTMxqJe7IOcfMgJ3L3i2',
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
              .subscribe((resp) => {
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
                updateDoc(
                  doc(getFirestore(), 'users/', 'fGdpBS7gMTMxqJe7IOcfMgJ3L3i2'),
                  {
                    access_token: accessToken,
                    institution,
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

  async getInstitutionName() {
    this.http
      .post(
        'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/getInstitutionName',
        {
          accessToken: this.user.access_token,
        }
      )
      .subscribe((resp) => {
        console.log(resp);
        this.institutionName = resp.name;
      });
  }
}
