import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'src/app/interfaces/transaction';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() cardTitle: string;
  transactions = [] as Array<Transaction>;
  constructor() {}

  ngOnInit() {
    if (this.cardTitle === 'income') {
      // Get and Show Income
    } else {
      // Get all relevent transactions
    }
  }
}
