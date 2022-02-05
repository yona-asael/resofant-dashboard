import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationsListComponent } from './translations-list/translations-list.component';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import {MatCheckboxModule} from '@angular/material/checkbox'; 


@NgModule({
  declarations: [
    TranslationsListComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    TranslateModule.forChild(),
  ],
  exports: [
    TranslationsListComponent,
  ],
  providers: [
    TranslatePipe,
  ]
})
export class SharedModule { }
