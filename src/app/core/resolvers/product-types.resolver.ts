import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Response } from '../models/response.model';
import { TypeModel } from '../models/type.model';
import { ProductService } from '../services/product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductTypesResolver implements Resolve<Response<TypeModel[]>> {
  constructor(private productService: ProductService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<Response<TypeModel[]>> | Response<TypeModel[]> {
    if(route.paramMap.get("slug")){
      return this.productService.getTypes(route.paramMap.get("slug"))
    }
    return new Response<TypeModel[]>([]);
  }
}
