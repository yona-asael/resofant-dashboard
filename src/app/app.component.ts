import { Component } from '@angular/core';
import { TranslateConfigService } from './core/services/translate/translate-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'resofant-dashboard';
  constructor(public translateService: TranslateConfigService) {
    
  }
}
