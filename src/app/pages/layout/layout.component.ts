import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Mode } from 'src/app/core/enum/Mode.enum';
import { INav } from 'src/app/core/interfaces/layout/nav.interface';
import { ThemeService } from 'src/app/core/services/theme/theme.service';
import { TranslateConfigService } from 'src/app/core/services/translate/translate-config.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {

  isDarkMode: boolean;
  public navMenu: INav[];

  public title: string;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private themeService: ThemeService,
    private activateRoute: ActivatedRoute,
    private translateService: TranslateConfigService
  ) {
    this.themeService.initMode();
    this.isDarkMode = this.themeService.isDarkMode();
    this.translateService.changeLenguage('es');
  }

    
  ngOnInit(): void {
    this.navMenu = [
      { icon: "home", route: "/", text: "layout.nav.home", status: false },
      { icon: "receipt", route: "/orders", text: "layout.nav.orders", status: false },
      { icon: "shopping_cart", route: "/products", text: "layout.nav.products", status: false },
      { icon: "local_library", route: "/types", text: "layout.nav.types", status: false },
      { icon: "category", route: "/categories", text: "layout.nav.categories", status: false },
    ]

    this.title = this.activateRoute.snapshot.firstChild.children.slice(-1).pop().data['card'];
    this.checkActive();
  }


  private checkActive(): void {
    this.navMenu.forEach((item, id) => {
      if (this.router.url.includes(item.route)) {
        if (item.route.length > 1) {
          item.status = true;
        }
      }
    });
    this.listenUrlChangue();
  }

  private listenUrlChangue(): void {
    this.router.events
    .subscribe((res: NavigationStart) => {
      if (res['url']) {
        this.navMenu.forEach((item) => item.status = false);
        this.navMenu.forEach((item, idx) => {
          if (res['url'].includes(item.route)) {
            if (item.route.length > 1) {
              item.status = true;
            }
            if (item.route.length === res['url'].length && item.route === '/') {
              this.navMenu[0].status = true;
            }
          }
        });
        this.title = this.activateRoute.snapshot.firstChild.children.slice(-1).pop().data['card'];
        this.cdr.detectChanges();
      }
    });
  }

  public toggle() {
    this.themeService.isDarkMode() ? this.themeService.update(Mode.LIGHT) : this.themeService.update(Mode.DARK);

  }



}
