import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Response } from '../models/response.model';
import { TranslatePipe } from '@ngx-translate/core';

@Injectable()
export class StatusInterceptor implements HttpInterceptor {
  private retryDelay = 2000;
  private retryMaxAttempts = 2;
  
  constructor(
    private router: Router,
    private location: Location,
    private toastr: ToastrService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      filter(value => value instanceof HttpResponse || value instanceof HttpErrorResponse),
      map((event: HttpEvent<any>)=>{
        if(event['url'].includes('assets')) return event;
        const body = event['body'] as Response<any>;
        if(200 == body.code) this.toastr.success( body.message,);
        return event;
      } ),
      catchError(err => {
      if(err['url'].includes('assets')) next.handle(request);
      if ([403].includes(err.status)) {
        this.router.navigate(['/auth/login']);
      } else if([400].includes(err.status)) {
        this.toastr.warning('Revise sus datos correctamente', 'Informacion invalida');;
      } else if ([401].includes(err.status)) {
        // this.router.navigate(['/auth/login']);
      }else if ([404].includes(err.status)){
        this.toastr.warning('No existe registro', 'No se encontro informacion');
      } else if ([500].includes(err.status)) {
        this.toastr.error('Contactar a matenimiento', 'Error en el servidor');
      }  else if ([504].includes(err.status)) {
        this.toastr.error('Contactar a matenimiento o revisa tu conexion', 'Ups! no hay comunicacion');
      } 
      return next.handle(request);
    }));

  }
}
