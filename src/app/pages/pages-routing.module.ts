import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./home/home.module').then( (m) => m.HomeModule),
        data: {
          title: "title.home",
        }
      },
      {
        path: "products",
        loadChildren: () => import('./products/products.module').then( (m) => m.ProductsModule)
      },
      {
        path: "orders",
        loadChildren: () => import('./orders/orders.module').then( (m) => m.OrdersModule)
      },
      {
        path: "categories",
        loadChildren: () => import('./categories/categories.module').then( (m) => m.CategoriesModule)
      },
      {
        path: "types",
        loadChildren: () => import('./types/types.module').then( (m) => m.TypesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
