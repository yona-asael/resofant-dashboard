import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { LayoutComponent } from './layout/layout.component';

import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatListModule } from '@angular/material/list'; 

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatToolbarModule, 
    MatSlideToggleModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    TranslateModule.forChild(),
  ]
})
export class PagesModule { }
