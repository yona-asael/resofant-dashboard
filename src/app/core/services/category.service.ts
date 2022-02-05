import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { STATUS } from '../enum/Status.enum';
import { ICategory } from '../interfaces/category.interface';
import { ITranslation } from '../interfaces/translation.interface';
import { CategoryModel } from '../models/category.model';
import { QueryStringModel } from '../models/httpUtil/query-string.model';
import { PageModel } from '../models/page.model';
import { Response } from '../models/response.model';
import { TranslationModel } from '../models/Translation.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService  extends BaseService {

  constructor(
    protected override http: HttpClient,
  ) { 
    super('/categories',http);
  }


  public createCagetory(cat: ICategory): Observable<Response<boolean>>  {
    return this.post<Response<boolean>>(`${this.API}`, cat);
  }

  public override getAllPaginated<CategoryModel>(queryString: QueryStringModel = new QueryStringModel()): Observable<Response<PageModel<CategoryModel>>>  {
    this.httpOptions.params = this.toHttpParams(queryString.getHTTPParamsCriteria);
    return this.get<Response<PageModel<CategoryModel>>>(this.API);
  }

  public getBySlug(slug: string): Observable<Response<CategoryModel>> {
    return this.get<Response<CategoryModel>>(`${this.API}/${slug}`);
  }

  public updateStatusBySlig(slug: string, status: string): Observable<Response<boolean>> {
    return this.put<Response<boolean>>(`${this.API}/${slug}/status/${status.toString()}`);
  }

  public getTransBySlug(slug: string): Observable<Response<TranslationModel[]>> {
    return this.get<Response<TranslationModel[]>>(`${this.API}/${slug}/translations`);
  }

  public updateTransBySlug(slug: string, trans: ITranslation): Observable<Response<boolean>> {
    return this.put<Response<boolean>>(`${this.API}/${slug}/translations`, trans);
  }
}
