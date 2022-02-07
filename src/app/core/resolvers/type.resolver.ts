import { Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Resolve
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Response } from '../models/response.model';
import { TypeModel } from '../models/type.model';
import { TypeService } from '../services/type.service';

@Injectable({
  providedIn: 'root'
})
export class TypeResolver implements  Resolve< Response<TypeModel>  > {

  constructor(private typeService: TypeService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Response<TypeModel>> | Response<TypeModel> {
    if(route.paramMap.get("slug")){
      return this.typeService.getBySlug(route.paramMap.get("slug"))
    }
    return new Response<TypeModel>(new TypeModel());
  }
}
