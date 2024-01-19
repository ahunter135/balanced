import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DatePipe], // Provide DatePipe here
})
export class HeaderComponent implements OnInit {
  /* Events that page should handle */
  @Output() requestDateChange = new EventEmitter();
  @Output() addTransactionButtonClicked = new EventEmitter();
  @Output() refreshButtonClicked = new EventEmitter();
  /* Month and year to display, Locale */
  @Input() chosenMonth: string;
  @Input() chosenYear: string;

  isSpinning = false;
  constructor(private datePipe: DatePipe) {}

  ngOnInit() {}

  async addTransaction() {
    // Moving this to event so parent can handle
    // passing categories and subcategories
    this.addTransactionButtonClicked.emit();
  }

  refresh() {
    this.isSpinning = true;
    // Your refresh logic here
    // After the refresh logic is done, set isSpinning to false to stop the spin
    setTimeout(() => {
      this.isSpinning = false;
    }, 2000);
    this.refreshButtonClicked.emit();
  }

  dateClicked() {
    this.requestDateChange.emit();
  }

  getShortMonthName(fullMonthName: string | null): string {
    // Check if fullMonthName is null or empty and return an empty string immediately
    if (!fullMonthName) {
      return '';
    }

    try {
      const date = new Date(`${fullMonthName} 1, 2000`);
      const shortMonthName = this.datePipe.transform(date, 'MMM');

      // Check if shortMonthName is null or undefined and return an empty string
      return shortMonthName ? shortMonthName : '';
    } catch (error) {
      console.error('Invalid month name:', fullMonthName);
      return ''; // Return empty string or some default value
    }
  }
}
