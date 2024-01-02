import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /* Events that page should handle */
  @Output() viewChanged = new EventEmitter();
  @Output() requestDateChange = new EventEmitter();
  @Output() addTransactionButtonClicked = new EventEmitter();
  /* Month and year to display, Locale */
  @Input() chosenMonth: String;
  @Input() chosenYear: String;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  /* Add a transaction manually. Opens a new AddTransactionComponent
  * modal
  */
  async addTransaction() {
    // Moving this to event so parent can handle
    // passing categories and subcategories
    this.addTransactionButtonClicked.emit();
  }

  segmentChanged(ev: any) {
    this.viewChanged.emit(ev.detail.value);
  }

  dateClicked() {
    this.requestDateChange.emit();
  }
}
