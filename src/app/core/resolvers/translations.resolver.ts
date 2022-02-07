import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Response } from '../models/response.model';
import { TranslationModel } from '../models/Translation.model';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { TypeService } from '../services/type.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationsResolver implements Resolve<Response<TranslationModel[]> > {
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private typeService: TypeService
  ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Response<TranslationModel[]>> | Response<TranslationModel[]> {
   
    if(!route.paramMap.get("slug")) return new Response<TranslationModel[]>([]);
    
    if(state.url.includes("categories")) {
      return this.categoryService.getTransBySlug(route.paramMap.get("slug"))
    }
    if(state.url.includes("types")) {
      return this.typeService.getTransBySlug(route.paramMap.get("slug"))
    }
    if(state.url.includes("products")) {
      return this.productService.getTransBySlug(route.paramMap.get("slug"))
    }
    return new Response<TranslationModel[]>([]);
  }
}
