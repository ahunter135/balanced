import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { CategoryComponent } from './category/category.component';
import { AddTransactionComponent } from '../modals/add-transaction/add-transaction.component';
import { CurrencyInputComponent } from './currency-input/currency-input.component';
import { TransactionSorterComponent } from '../modals/transaction-sorter/transaction-sorter.component';
import { ViewSubCategoryComponent } from '../modals/view-sub-category/view-sub-category.component';
import { NgxCurrencyDirective } from 'ngx-currency';

@NgModule({
  declarations: [
    HeaderComponent,
    CategoryComponent,
    AddTransactionComponent,
    CurrencyInputComponent,
    ViewSubCategoryComponent,
    TransactionSorterComponent,
  ],
  exports: [
    HeaderComponent,
    CategoryComponent,
    AddTransactionComponent,
    CurrencyInputComponent,
    ViewSubCategoryComponent,
    TransactionSorterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgxCurrencyDirective,
  ],
})
export class ComponentsModule {}
