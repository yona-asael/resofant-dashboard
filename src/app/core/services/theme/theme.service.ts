import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Mode } from '../../enum/Mode.enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private render: Renderer2;
  private colorTheme: string;

  constructor(private renderFactory: RendererFactory2) {
    this.render = this.renderFactory.createRenderer(null, null);
  }

  public initMode(): void {
    this.getColorTheme();
    this.render.addClass(document.body, this.colorTheme);

  }

  public update(theme: Mode.DARK | Mode.LIGHT): void {
    this.setColorTheme(theme);
    const previousTheme = (theme === Mode.DARK ? Mode.LIGHT : Mode.DARK);
    this.render.removeClass(document.body, previousTheme);
    this.render.addClass(document.body, theme);
  }

  public isDarkMode(): boolean  {
    return this.colorTheme === Mode.DARK ;
  }

  private setColorTheme(theme: string): void {
    this.colorTheme = theme;
    localStorage.setItem(Mode.STORE, theme);
  }

  private getColorTheme(): void {
    if(localStorage.getItem(Mode.STORE)) {
      this.colorTheme = localStorage.getItem(Mode.STORE);
    } else {
      this.colorTheme = Mode.LIGHT;
    }
  }
}
