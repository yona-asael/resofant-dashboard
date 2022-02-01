import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateConfigService } from './services/translate/translate-config.service';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import { ThemeService } from './services/theme/theme.service';

@NgModule({
  imports: [HttpClientModule, MatToolbarModule],
  exports: [HttpClientModule, MatToolbarModule],
  providers: [
    TranslateConfigService,
    ThemeService,
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}