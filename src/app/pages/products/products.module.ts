import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import {MatSelectModule} from '@angular/material/select'; 
import {MatTableModule} from '@angular/material/table'; 
import {MatPaginatorModule} from '@angular/material/paginator'; 
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {MatDividerModule} from '@angular/material/divider'; 
import {MatButtonModule} from '@angular/material/button'; 
import { SharedModule } from 'src/app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TypesListComponent } from './product-edit/types-list/types-list.component';




@NgModule({
  declarations: [
    ProductListComponent,
    ProductEditComponent,
    TypesListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    TranslateModule.forChild(),
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatFabMenuModule,
    MatSortModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatDividerModule,
    MatButtonModule,
    MatTabsModule,
  ]
})
export class ProductsModule { }
