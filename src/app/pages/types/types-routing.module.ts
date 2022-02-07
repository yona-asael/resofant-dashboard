import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslationsResolver } from 'src/app/core/resolvers/translations.resolver';
import { TypeResolver } from 'src/app/core/resolvers/type.resolver';
import { TypesEditComponent } from './types-edit/types-edit.component';
import { TypesListComponent } from './types-list/types-list.component';

const routes: Routes = [

  {
    path: "",
    component: TypesListComponent,
    data: {
      title: "title.types.root",
      card: "layout.card.title.types.list"
    }
  },
  {
    path: "create",
    component: TypesEditComponent,
    resolve: { type: TypeResolver, trans: TranslationsResolver},
    data: {
      title: "title.types.create",
      card: "layout.card.title.types.edit.create",
      readonly: false,
      update: false,
    }
  },
  {
    path: "edit/:slug",
    component: TypesEditComponent,
    resolve: { type: TypeResolver, trans: TranslationsResolver},
    data: {
      title: "title.types.edit",
      card: "layout.card.title.types.edit.edit",
      readonly: false,
      update: true,
    }
  },
  {
    path: "preview/:slug",
    component: TypesEditComponent,
    resolve: { type: TypeResolver, trans: TranslationsResolver},
    data: {
      title: "title.types.preview",
      card: "layout.card.title.types.edit.edit",
      readonly: true,
      update: false,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypesRoutingModule { }
