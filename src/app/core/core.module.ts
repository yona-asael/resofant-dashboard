import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateConfigService } from './services/translate/translate-config.service';
import { ThemeService } from './services/theme/theme.service';
import { StatusInterceptor } from './interceptors/status.interceptor';

@NgModule({
  imports: [HttpClientModule],
  exports: [HttpClientModule],
  providers: [
    TranslateConfigService,
    ThemeService,
    StatusInterceptor
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