import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypesRoutingModule } from './types-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TypesRoutingModule,
    TranslateModule.forChild(),
  ]
})
export class TypesModule { }
