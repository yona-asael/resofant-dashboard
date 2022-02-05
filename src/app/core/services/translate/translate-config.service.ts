import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '../../enum/Storage.enum';
import { TokenStorageService } from '../token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  constructor(
    private translateService: TranslateService,
    private tokenStorage: TokenStorageService,
  ) {
  }

  public changeLenguage(lang: string): void  {
    this.translateService.use(lang);
    this.tokenStorage.save(Storage.LANG, lang);
  }

  public get currentLanguage(): string {
    return this.translateService.currentLang;
  }
 
}
