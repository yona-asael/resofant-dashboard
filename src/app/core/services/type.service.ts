import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IType } from '../interfaces/type.interface';
import { QueryStringModel } from '../models/httpUtil/query-string.model';
import { PageModel } from '../models/page.model';
import { Response } from '../models/response.model';
import { TranslationModel } from '../models/Translation.model';
import { TypeModel } from '../models/type.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TypeService extends  BaseService {
  constructor(
    protected override http: HttpClient,
  ) { 
    super('/types',http);
  }


  public createCagetory(cat: IType): Observable<Response<boolean>>  {
    return this.post<Response<boolean>>(`${this.API}`, cat);
  }

  public override getAllPaginated<TypeModel>(queryString: QueryStringModel = new QueryStringModel()): Observable<Response<PageModel<TypeModel>>>  {
    this.httpOptions.params = this.toHttpParams(queryString.getHTTPParamsCriteria);
    return this.get<Response<PageModel<TypeModel>>>(this.API);
  }

  public getBySlug(slug: string): Observable<Response<TypeModel>> {
    return this.get<Response<TypeModel>>(`${this.API}/${slug}`);
  }

  public updateTypeBySlug(slug: string, status: string): Observable<Response<boolean>> {
    return this.put<Response<boolean>>(`${this.API}/${slug}/status/${status.toString()}`);
  }
  public updateCategoryBySlug(slug: string, category: string): Observable<Response<boolean>> {
    return this.put<Response<boolean>>(`${this.API}/${slug}/category/${category}`);
  }

  public getTransBySlug(slug: string): Observable<Response<TranslationModel[]>> {
    return this.get<Response<TranslationModel[]>>(`${this.API}/${slug}/translations`);
  }

}
