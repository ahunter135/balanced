import { Component } from '@angular/core';
import { getAuth, signOut } from '@angular/fire/auth';
import { HttpService } from '../services/http.service';
import { UserService } from '../services/user.service';
import { setDoc, doc, getFirestore } from '@angular/fire/firestore';
declare var Plaid: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  institutionName: string;
  constructor(private http: HttpService, private userService: UserService) {}

  async link() {
    this.http
      .post(
        'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/createPlaidLinkToken',
        {
          user_id: this.userService.getActiveUser()?.uid,
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

                const accessToken = resp.access_token;
                const institution = resp.item_id;
                const id = this.userService.generateRandomId();
                const name = await this.getInstitutionName(accessToken);
                setDoc(
                  doc(
                    getFirestore(),
                    'users/',
                    this.userService.getActiveUser()?.uid as string,
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

  signOut() {
    signOut(getAuth());
  }
}
