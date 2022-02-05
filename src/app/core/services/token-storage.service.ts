import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Storage } from '../enum/Storage.enum';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  public save<T>(module: Storage, data: T): void {
    localStorage.setItem(module.toString(), JSON.stringify(data));
  }

  public get<T>(module: Storage): T {
    return JSON.parse(localStorage.getItem(module.toString())) as T;
  }

  public getOb<T>(module: Storage): Observable<T> {
    return of(JSON.parse(localStorage.getItem(module.toString())) as T);
  }

}
