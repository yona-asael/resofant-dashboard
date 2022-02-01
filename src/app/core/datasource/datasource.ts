import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { QueryStringModel } from '../models/httpUtil/query-string.model';
import { PageModel } from '../models/page.model';
import { Response } from '../models/response.model';
import { BaseService } from '../services/base.service';


export class BaseDataSource<T> implements DataSource<T> {
  public entitySubject = new BehaviorSubject<T[]>([]);
  public hasItems: boolean = false;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean>;
  public data: T[] = [];
  // Paginator | Paginators count
  public paginatorTotalSubject = new BehaviorSubject<number>(0);
  public paginatorTotal$: Observable<number>;

  constructor(
    private baseService: BaseService,
  ) {
    this.loading$ = this.loadingSubject.asObservable();
    this.paginatorTotal$ = this.paginatorTotalSubject.asObservable();
    this.paginatorTotal$.subscribe(res => this.hasItems = res > 0);
  }

  public connect(): Observable<T[]> {
    return this.entitySubject.asObservable();
  }

  public disconnect(): void {
    this.entitySubject.complete();
    this.loadingSubject.complete();
    this.paginatorTotalSubject.complete();
  }

  public loadItems(query: QueryStringModel): void {
    this.loadingSubject.next(true);
    this.baseService.getAllPaginated<T>(query).pipe(
      tap((res: Response<PageModel<T>>) => {
        this.entitySubject.next(res.data.content);
        this.paginatorTotalSubject.next(res.data.totalElements);
        this.data = res.data.content;
      }),
      catchError((err) => { throw Error(`Error with the pagination: ${err}`) }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

}