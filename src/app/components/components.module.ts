import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { CategoryComponent } from './category/category.component';
import { AddTransactionComponent } from '../modals/add-transaction/add-transaction.component';
import { CurrencyInputComponent } from './currency-input/currency-input.component';

@NgModule({
  declarations: [
    HeaderComponent,
    CategoryComponent,
    AddTransactionComponent,
    CurrencyInputComponent,
  ],
  exports: [
    HeaderComponent,
    CategoryComponent,
    AddTransactionComponent,
    CurrencyInputComponent,
  ],
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
})
export class ComponentsModule {}
