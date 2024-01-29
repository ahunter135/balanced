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
import { TransactionSorterComponent } from '../modals/transaction-sorter/transaction-sorter.component';
import { ModalController } from '@ionic/angular';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { generateRandomId } from '../utils/generation';
import { PlaidService } from '../services/plaid.service';

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
    private modalCtrl: ModalController,
    private userRepository: UserRepositoryService,
    private plaidService: PlaidService
  ) {}

  ngOnInit() {}

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
    this.plaidService.linkPlaidToUser();
  }
}
