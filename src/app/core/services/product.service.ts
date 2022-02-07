import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from '../interfaces/product.interface';
import { QueryStringModel } from '../models/httpUtil/query-string.model';
import { PageModel } from '../models/page.model';
import { ProductModel } from '../models/product.model';
import { Response } from '../models/response.model';
import { TranslationModel } from '../models/Translation.model';
import { TypeModel } from '../models/type.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {
  constructor(
    protected override http: HttpClient,
  ) { 
    super('/products',http);
  }

  public createProduct(cat: IProduct): Observable<Response<boolean>>  {
    return this.post<Response<boolean>>(`${this.API}`, cat);
  }

  public override getAllPaginated<ProductModel>(queryString: QueryStringModel = new QueryStringModel()): Observable<Response<PageModel<ProductModel>>>  {
    this.httpOptions.params = this.toHttpParams(queryString.getHTTPParamsCriteria);
    return this.get<Response<PageModel<ProductModel>>>(this.API);
  }

  public getBySlug(slug: string): Observable<Response<ProductModel>> {
    return this.get<Response<ProductModel>>(`${this.API}/${slug}`);
  }

  public updateStatusBySlug(slug: string, status: string): Observable<Response<boolean>> {
    return this.put<Response<boolean>>(`${this.API}/${slug}/status/${status.toString()}`);
  }

  public updateProduct(slug: string, type: ProductModel): Observable<Response<boolean>> {
    return this.put<Response<boolean>>(`${this.API}/${slug}`, type);
  }

  public getTypes(slug: string): Observable<Response<TypeModel[]>> {
    return this.get<Response<TypeModel[]>>(`${this.API}/${slug}/types`);
  }

  public getTransBySlug(slug: string): Observable<Response<TranslationModel[]>> {
    return this.get<Response<TranslationModel[]>>(`${this.API}/${slug}/translations`);
  }
}
