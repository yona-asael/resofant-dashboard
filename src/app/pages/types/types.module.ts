import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypesRoutingModule } from './types-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { TypesListComponent } from './types-list/types-list.component';
import { TypesEditComponent } from './types-edit/types-edit.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs'; 


@NgModule({
  declarations: [
    TypesListComponent,
    TypesEditComponent,
  ],
  imports: [
    CommonModule,
    TypesRoutingModule,
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
    SharedModule,
    MatTabsModule
  ]
})
export class TypesModule { }
