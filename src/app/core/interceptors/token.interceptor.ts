import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IHTTPParamsCriteria } from '../interfaces/HTTPUtil/http-params-criteria.interface';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { Storage } from '../enum/Storage.enum';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private headers: IHTTPParamsCriteria[] = [{ key: 'Content-Type', value: 'application/json' }]

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.headers.push({key: 'Accept-Language', value: this.tokenStorage.get<string>(Storage.LANG)});
    // if (request.headers.get("skip")) {
    //   const clone = request.clone({ headers: this.toHeaders(this.headers), params: request.params });
    //   return next.handle(clone);
    // }
    // const tokenModel = this.tokenStorage.getGeneric<TokenServiceModel>(StorageEnum.TOKEN);
    // if (tokenModel.Invalid) {
    //   this.router.navigate(['/auth/login']);
    //   this.tokenStorage.saveGeneric<TokenServiceModel>(StorageEnum.TOKEN, new TokenServiceModel("", ""));
    // }
    // const token = tokenModel.token.replace(/['"]+/g, '');
    // if (token) {
    //   this.headers.push({ key: 'Authorization', value: token });
    //   const clone = request.clone({ headers: this.toHeaders(this.headers), params: request.params });
    //   return next.handle(clone);
    // } else {
    //   return next.handle(request);
    // }
    const clone = request.clone({ headers: this.toHeaders(this.headers), params: request.params });
    return next.handle(clone);
  }

  protected toHeaders(params: IHTTPParamsCriteria[]): HttpHeaders {
    return params.reduce((p, param) => p.set(param.key, param.value), new HttpHeaders());
  }

}
