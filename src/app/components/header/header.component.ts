import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /* Events that page should handle */
  @Output() requestDateChange = new EventEmitter();
  @Output() addTransactionButtonClicked = new EventEmitter();
  @Output() refreshButtonClicked = new EventEmitter();
  /* Month and year to display, Locale */
  @Input() chosenMonth: String;
  @Input() chosenYear: String;

  constructor() {}

  ngOnInit() {}

  async addTransaction() {
    // Moving this to event so parent can handle
    // passing categories and subcategories
    this.addTransactionButtonClicked.emit();
  }

  refresh() {
    this.refreshButtonClicked.emit();
  }

  dateClicked() {
    this.requestDateChange.emit();
  }
}
