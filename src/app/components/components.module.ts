import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { CategoryComponent } from './category/category.component';

@NgModule({
  declarations: [HeaderComponent, CategoryComponent],
  exports: [HeaderComponent, CategoryComponent],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class ComponentsModule {}
