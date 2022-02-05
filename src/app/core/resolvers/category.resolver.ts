import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CategoryModel } from '../models/category.model';
import { Response } from '../models/response.model';
import { CategoryService } from '../services/category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryResolver implements Resolve<Response<CategoryModel>> {
  
  constructor(private categoryService: CategoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Response<CategoryModel>> | Response<CategoryModel>{
    if(route.paramMap.get("slug")){
      return this.categoryService.getBySlug(route.paramMap.get("slug"))
    }
    return new Response<CategoryModel>(new CategoryModel());
  }
}
