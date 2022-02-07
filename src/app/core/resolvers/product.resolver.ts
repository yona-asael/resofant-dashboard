import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { Response } from '../models/response.model';
import { ProductService } from '../services/product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Response<ProductModel>> {
  constructor(private productService: ProductService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Response<ProductModel>>  | Response<ProductModel>{
    if(route.paramMap.get("slug")){
      return this.productService.getBySlug(route.paramMap.get("slug"))
    }
    return new Response<ProductModel>(new ProductModel());
  }
}
