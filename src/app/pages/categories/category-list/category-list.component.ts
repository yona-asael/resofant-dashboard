import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { STATUS } from 'src/app/core/enum/Status.enum';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { concat, debounceTime, distinctUntilChanged, filter, map, merge, Subject, take, takeUntil, tap, zip } from 'rxjs';
import { BaseDataSource } from 'src/app/core/datasource/datasource';
import { CategoryModel } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { QueryStringModel } from 'src/app/core/models/httpUtil/query-string.model';
import { PaginationModel } from 'src/app/core/models/httpUtil/pagination.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslatePipe,  } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { IHTTPParamsCriteria } from 'src/app/core/interfaces/HTTPUtil/http-params-criteria.interface';
import { Direction, SortingModel } from 'src/app/core/models/httpUtil/sorting.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  public baseRoute: string = 'categories';
  
  public displayedColumns: string[] = ["SELECT", 'SLUG', 'NAME', 'DESCRIPTION', 'STATUS'];
  public status = [
    { value: STATUS.ACTIVE.toString(), label: "status.ACTIVE" },
    { value: STATUS.DISABLED.toString(), label: "status.DISABLED" }
  ];
  public fabButtonsRandom: MatFabMenu[] = [];
  public formCategory: FormGroup;
  public dataSource: BaseDataSource<CategoryModel>
  public selection = new SelectionModel<CategoryModel>(true, []);
  public data_source_loaded = false;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private selected: CategoryModel;
  private filters: IHTTPParamsCriteria[] = [ {key: "status", value: "ACTIVE"}];
  private sortDirections: SortingModel[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private translation: TranslatePipe,
  ) { }

  ngOnInit(): void {
    this.dataSource = new BaseDataSource<CategoryModel>(this.categoryService);
    this.fabButtonsRandom.push({ id: 1, icon: 'add', tooltip: this.translation.transform("fab.add"), tooltipPosition: 'below'});
    this.createForm();
  }

  ngAfterViewInit(): void { 
    this.initTable()
    this.loadList();
  }
  
  public onSelectionCategory(id): void {
    switch (id) {
      case 1: this.router.navigate(['/categories', 'create']);
        break;
      case 2: this.router.navigate(['/categories', 'edit', this.selected.slug]);
        break;
      case 3:this.router.navigate(['/categories', 'preview', this.selected.slug ]);
        break;
      default:
        break;
    }
  }

  private createForm(): void {
    this.formCategory = this.fb.group( {
      slug: [""],
      name: [""],
      status: ["ACTIVE"],
    });
    this.onChanges();
  }

  private onChanges(): void {
    const controls = this.formCategory.controls;
    merge(
      controls['slug'].valueChanges.pipe(map( value => {return { key: "slug", value: value} as IHTTPParamsCriteria})),
      controls['name'].valueChanges.pipe(map( value => {return { key: "name", value: value} as IHTTPParamsCriteria})),
      controls['status'].valueChanges.pipe(map( value => {return { key: "status", value: value} as IHTTPParamsCriteria})),
    ).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => {
        this.checkParams(value);
        this.loadList();
      }),
    ).subscribe();
  }

  private checkParams(param: IHTTPParamsCriteria): void {
    if(!this.filters)  this.filters = [];
    if(this.filters.length === 0) this.filters.push(param); 
    const index = this.filters.findIndex( (value) => value.key === param.key);
    if(index == -1) {
      this.filters.push(param); 
      return;
    }
    this.filters[index] = param;
  }
  
  private initTable(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((value) => {
          if(value.hasOwnProperty('direction')) this.generateSort(value as Sort)
          this.loadList();
        }),
        takeUntil(this.ngUnsubscribe)
      ).subscribe();
    this.dataSource = new BaseDataSource<CategoryModel>(this.categoryService);

    this.dataSource.connect().pipe(take(1)).subscribe((value) => {
      this.data_source_loaded = !!value;
    });
  }

  private generateSort(sort: Sort): void { 
    if(sort.direction === "") return;
    if(!this.sortDirections)  this.sortDirections = [];
    const sorted = new SortingModel((sort.active.toLowerCase()), sort.direction as Direction);
    if(this.sortDirections.length === 0) this.sortDirections.push(sorted); 
    const index = this.sortDirections.findIndex( (value) => value.key.includes(sort.active.toLowerCase()));
    if(index == -1) {
      this.sortDirections.push(sorted); 
      return;
    }
    this.sortDirections[index] = sorted;
  }

  private loadList(): void {
    const query = new QueryStringModel(
      [...this.filters],
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
    if(!this.fabButtonsRandom.some( (value) => value.id === 2)) {
      this.fabButtonsRandom.push(
        { id: 2, icon: 'edit', tooltip: this.translation.transform("fab.edit"), tooltipPosition: 'below'},
        { id: 3, icon: 'visibility', tooltip: this.translation.transform("fab.preview"), tooltipPosition: 'below'},
      );
    }
  
  }

  private get getPagination(): PaginationModel {
    return new PaginationModel(this.paginator.pageIndex, this.paginator.pageSize);
  }

  public getTranslate(status: string): string {
    return status === STATUS.ACTIVE.toString() ? 'status.ACTIVE' : 'status.DISABLED';
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}

