import { Component, OnInit } from '@angular/core';
import { collection, getDocs, getFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account-picker',
  templateUrl: './account-picker.component.html',
  styleUrls: ['./account-picker.component.scss'],
})
export class AccountPickerComponent implements OnInit {
  flags: any = {
    plaid: {
      enabled: false,
    },
    finicity: {
      enabled: false,
    },
  };
  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {
    getDocs(collection(getFirestore(), 'flags')).then((snapshot) => {
      console.log(snapshot.docs);
      snapshot.docs.forEach((doc) => {
        this.flags[doc.id] = { enabled: doc.data()['enabled'] };
        console.log(this.flags);
      });
    });
  }
}
