import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTypesResolver } from 'src/app/core/resolvers/product-types.resolver';
import { ProductResolver } from 'src/app/core/resolvers/product.resolver';
import { TranslationsResolver } from 'src/app/core/resolvers/translations.resolver';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  {
    path: "",
    component: ProductListComponent,
    data: {
      title: "title.products.root",
      card: "layout.card.title.products.list"
    }
  },
  {
    path: "create",
    component: ProductEditComponent,
    resolve: { product: ProductResolver,types: ProductTypesResolver, trans: TranslationsResolver},
    data: {
      title: "title.products.create",
      card: "layout.card.title.products.edit.create",
      readonly: false,
      update: false,
    }
  },
  {
    path: "edit/:slug",
    component: ProductEditComponent,
    resolve: {product: ProductResolver,types: ProductTypesResolver, trans: TranslationsResolver},
    data: {
      title: "title.products.edit",
      card: "layout.card.title.products.edit.edit",
      readonly: false,
      update: true,
    }
  },
  {
    path: "preview/:slug",
    component: ProductEditComponent,
    resolve: {product: ProductResolver,types: ProductTypesResolver, trans: TranslationsResolver},
    data: {
      title: "title.products.preview",
      card: "layout.card.title.products.edit.preview",
      readonly: true,
      update: false,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
