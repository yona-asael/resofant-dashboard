import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Mode } from 'src/app/core/enum/Mode.enum';
import { ThemeService } from 'src/app/core/services/theme/theme.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  isDarkMode: boolean;

  constructor(
    private themeService: ThemeService
  ) { 
    this.themeService.initMode();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit(): void {
      
  }

  public toggle() {
    this.themeService.isDarkMode() ? this.themeService.update(Mode.LIGHT) : this.themeService.update(Mode.DARK);

  }

}
