import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddTransactionComponent } from 'src/app/modals/add-transaction/add-transaction.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() viewChanged = new EventEmitter();
  @Output() transactionAdded = new EventEmitter();
  @Output() requestDateChange = new EventEmitter();
  @Input() chosenMonth: String;
  @Input() chosenYear: String;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async addTransaction() {
    const modal = await this.modalController.create({
      component: AddTransactionComponent,
    });

    modal.present();

    modal.onDidDismiss().then((resp: any) => {
      this.transactionAdded.emit();
    });
  }

  segmentChanged(ev: any) {
    this.viewChanged.emit(ev.detail.value);
  }

  dateClicked() {
    this.requestDateChange.emit();
  }
}
