import { Component } from '@angular/core';
import { getFirestore, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { HttpService } from '../services/http.service';
declare var Plaid: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  user = {} as any;
  institutionName = "";
  constructor(private http: HttpService) {}

  ngOnInit() {
    this.getUserData();
  }

  async getUserData() {
    this.user = (await getDoc(doc(getFirestore(), 'users', "fGdpBS7gMTMxqJe7IOcfMgJ3L3i2"))).data();
    console.log(this.user);
    this.getInstitutionName();
  }

  async link() {
    this.http
      .post(
        'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/createPlaidLinkToken',
        {}
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
                updateDoc(doc(getFirestore(), "users/", "fGdpBS7gMTMxqJe7IOcfMgJ3L3i2"), {
                  access_token: accessToken,
                  institution
                });
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

  async retrieveTransactions() {
    this.http
      .post(
        'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/getTransactionData',
        {
          accessToken: this.user.access_token
        }
      ).subscribe((resp) => {
        console.log(resp);
      })
  }

  async getInstitutionName() {
    this.http
      .post(
        'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/getInstitutionName',
        {
          accessToken: this.user.access_token
        }
      ).subscribe((resp) => {
        console.log(resp);
        this.institutionName = resp.name;
      })
  }
}
