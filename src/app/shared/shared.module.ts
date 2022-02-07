import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationsListComponent } from './translations-list/translations-list.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TypeAutoComponent } from './autocompletes/type-auto/type-auto.component';
import { CategoryAutoComponent } from './autocompletes/category-auto/category-auto.component'; 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 

@NgModule({
  declarations: [
    TranslationsListComponent,
    TypeAutoComponent,
    CategoryAutoComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule.forChild(),
  ],
  exports: [
    TranslationsListComponent,
    CategoryAutoComponent,
    TypeAutoComponent,
  ],
  providers: [
    TranslatePipe,
  ]
})
export class SharedModule { }
