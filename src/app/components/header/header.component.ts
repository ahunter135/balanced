import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddTransactionComponent } from 'src/app/modals/add-transaction/add-transaction.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() viewChanged = new EventEmitter();
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async addTransaction() {
    const modal = await this.modalController.create({
      component: AddTransactionComponent,
    });

    modal.present();
  }

  segmentChanged(ev: any) {
    this.viewChanged.emit(ev.detail.value);
  }
}
