import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IBase } from "../interfaces/base.interface";
import { IHTTPParamsCriteria } from "../interfaces/HTTPUtil/http-params-criteria.interface";
import { QueryStringModel } from "../models/httpUtil/query-string.model";
import { Model } from "../models/model";
import { PageModel } from "../models/page.model";
import { Response } from "../models/response.model";


export class BaseService {
    protected params = new HttpParams();
    protected API: string = "";
    protected httpOptions = {
        headers: new HttpHeaders({
            'Accept':'application/json',
            'Content-Type': 'application/json'
        }),
        params: new HttpParams(),
    };

    constructor(
        protected http: HttpClient,
    ) { 
        this.API = environment.production ? environment.API_ENDPOINT : '/';
    }

    protected get<T>(url: string): Observable<T> {
        return this.http.get<T>(url, this.httpOptions).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    protected post<T>(url: string, object: IBase | Model): Observable<T> {
        return this.http.post<T>(url, JSON.stringify(object), this.httpOptions).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    protected put<T>(url: string, object: IBase | Model): Observable<T> {
        return this.http.put<T>(url, JSON.stringify(object), this.httpOptions).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }
    
    protected patch<T>(url: string, object: IBase | Model): Observable<T> {
        return this.http.patch<T>(url, JSON.stringify(object), this.httpOptions).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }


    protected delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(url, this.httpOptions).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    public getAllPaginated<T>(query: QueryStringModel =  new QueryStringModel()): Observable<Response<PageModel<T>>> {
        this.httpOptions.params = this.toHttpParams(query.getHTTPParamsCriteria);
        Response
        return this.get<Response<PageModel<T>>>('');
    }

    /**
    * Convert IHTTPParamsCriteria to HttpParams
    * @param {IHTTPParamsCriteria} params
    * @returns {HttpParams}
    */
    protected toHttpParams(params: IHTTPParamsCriteria[]): HttpParams {
        return params.reduce((p, param) => p.set(param.key, param.value), new HttpParams());
    }

    /**
    * Convert IHTTPParamsCriteria to HttpHeaders
    * @param {IHTTPParamsCriteria} params
    * @returns {HttpHeaders}
    */
    protected toHttpHeaders(params: IHTTPParamsCriteria[]): HttpHeaders {
        return params.reduce((p, param) => p.set(param.key, param.value), new HttpHeaders());
    }  

    protected handleError(error: any): Observable<never> {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
}