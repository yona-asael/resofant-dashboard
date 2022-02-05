import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryListComponent } from './category-list/category-list.component';
import {MatSelectModule} from '@angular/material/select'; 
import { CategoryResolver } from 'src/app/core/resolvers/category.resolver';
import { TranslationsResolver } from 'src/app/core/resolvers/translations.resolver';
const routes: Routes = [
  {
    path: "",
    component: CategoryListComponent,
    data: {
      title: "title.categories.root",
      card: "layout.card.title.categories.list"
    }
  },
  {
    path: "create",
    component: CategoryEditComponent,
    resolve: {category: CategoryResolver, trans: TranslationsResolver},
    data: {
      title: "title.categories.create",
      card: "layout.card.title.categories.edit.create",
      readonly: false,
      update: false,
    }
  },
  {
    path: "edit/:slug",
    component: CategoryEditComponent,
    resolve: {category: CategoryResolver, trans: TranslationsResolver},
    data: {
      title: "title.categories.edit",
      card: "layout.card.title.categories.edit.edit",
      readonly: false,
      update: true,
    }
  },
  {
    path: "preview/:slug",
    component: CategoryEditComponent,
    resolve: {category: CategoryResolver, trans: TranslationsResolver},
    data: {
      title: "title.categories.preview",
      card: "layout.card.title.categories.edit.edit",
      readonly: true,
      update: false,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
