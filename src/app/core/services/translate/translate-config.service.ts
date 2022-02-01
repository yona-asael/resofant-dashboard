import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  constructor(private translateService: TranslateService) {
    this.translateService.use('es');
  }

  public changeLenguage(lang: string): void  {
    this.translateService.use(lang);
  }
 
}
