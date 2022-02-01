import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { LayoutComponent } from './layout/layout.component';

import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatToolbarModule, 
    MatSlideToggleModule,
    TranslateModule.forChild(),
  ]
})
export class PagesModule { }
