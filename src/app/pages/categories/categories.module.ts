import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input'; 
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CategoryResolver } from 'src/app/core/resolvers/category.resolver';
import { TranslationsResolver } from 'src/app/core/resolvers/translations.resolver';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryEditComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
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
    SharedModule
  ],
  providers: [
    TranslatePipe,
    CategoryResolver,
    TranslationsResolver,
  ]
})
export class CategoriesModule { }
