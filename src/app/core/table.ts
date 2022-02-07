import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { BehaviorSubject, debounceTime, distinctUntilChanged, merge, Observable, Subject, take, takeUntil, tap } from "rxjs";
import { BaseDataSource } from "./datasource/datasource";
import { IHTTPParamsCriteria } from "./interfaces/HTTPUtil/http-params-criteria.interface";
import { PaginationModel } from "./models/httpUtil/pagination.model";
import { QueryStringModel } from "./models/httpUtil/query-string.model";
import { Direction, SortingModel } from "./models/httpUtil/sorting.model";
import { BaseService } from "./services/base.service";


export class Table<T>  {
    private ngUnsubscribe = new Subject();
    public dataSource: BaseDataSource<T>;
    public displayedColumns: string [] = [];
    private data_source_loaded = false;
    public selection = new SelectionModel<T>(true, []);
    private selected: T;
    
    private filters: IHTTPParamsCriteria[] = [];
    private sortDirections: SortingModel[] = [];
    private customParams: IHTTPParamsCriteria[] = [];
    private service: BaseService;
    
    public sort: MatSort;
    public paginator: MatPaginator;

    constructor(baseService: BaseService, columns: string[]) {
        this.service = baseService;
        this.displayedColumns = columns;
        this.dataSource  = new BaseDataSource<T>(this.service);
    }

    public setFormsChanges(formsChanges, debounTime: number = 500) {
        return formsChanges.pipe(
            takeUntil(this.ngUnsubscribe),
            debounceTime(debounTime),
            distinctUntilChanged(),
            tap((value: any) => {
                this.checkParams(value);
                this.loadList();
            }),
        );
    }

    private checkParams(param: IHTTPParamsCriteria): void {
        if (!this.filters) this.filters = [];
        if (this.filters.length === 0) this.filters.push(param);
        const index = this.filters.findIndex((value) => value.key === param.key);
        if (index == -1) {
            this.filters.push(param);
            return;
        }
        this.filters[index] = param;
    }


    public initTable(): void {
        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            takeUntil(this.ngUnsubscribe),
            tap((value) => {
                if (value.hasOwnProperty('direction')) this.generateSort(value as Sort)
                this.loadList();
            }),
        ).subscribe();
        this.dataSource.connect().pipe(take(1)).subscribe((value) => {
            this.data_source_loaded = !!value;
        });
        this.loadList();
    }

    private generateSort(sort: Sort): void {
        if (sort.direction === "") return;
        if (!this.sortDirections) this.sortDirections = [];
        const sorted = new SortingModel((sort.active.toLowerCase()), sort.direction as Direction);
        if (this.sortDirections.length === 0) this.sortDirections.push(sorted);
        const index = this.sortDirections.findIndex((value) => value.key.includes(sort.active.toLowerCase()));
        if (index == -1) {
            this.sortDirections.push(sorted);
            return;
        }
        this.sortDirections[index] = sorted;
    }

    public loadList(): void {
        const query = new QueryStringModel(
            [...this.filters, ...this.customParams],
            [],
            this.getPagination,
            this.sortDirections
        );
        this.dataSource.loadItems(query);
    }

    public changeSelector(element): void {
        this.selection.clear();
        this.selection.toggle(element);
        this.selected = element;
    }

    public setPaginatorAndSort(paginator: MatPaginator, sort: MatSort) {
        this.paginator = paginator;
        this.sort = sort;
    }

    public get Selected(): T {
        return this.selected;
    }

    private get getPagination(): PaginationModel {
        return new PaginationModel(this.paginator.pageIndex, this.paginator.pageSize);
    }


    public unSubscribe(): void {
        this.ngUnsubscribe.unsubscribe();
    }
}