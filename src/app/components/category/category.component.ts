import { Component, Input, OnInit } from '@angular/core';
import { Subcategory } from 'src/app/interfaces/subcategory';
import { Transaction } from 'src/app/interfaces/transaction';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() cardTitle: string;
  @Input() subcategories: Array<Subcategory>;
  @Input() isChecklist: boolean = false;
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
