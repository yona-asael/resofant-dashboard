import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListenerService<T> {
  private data: Subject<T> = new Subject<T>();
  constructor() { }

  public set setData(data: T) {
    this.data.next(data);
  }

 

  public get onChange(): Observable<T> {
    return this.data.asObservable();
  }
}
