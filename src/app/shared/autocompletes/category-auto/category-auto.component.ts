import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { BehaviorSubject, debounceTime, filter, finalize, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CategoryModel } from 'src/app/core/models/category.model';
import { PaginationModel } from 'src/app/core/models/httpUtil/pagination.model';
import { QueryStringModel } from 'src/app/core/models/httpUtil/query-string.model';
import { PageModel } from 'src/app/core/models/page.model';
import { Response } from 'src/app/core/models/response.model';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'category-auto',
  templateUrl: './category-auto.component.html',
  styleUrls: ['./category-auto.component.scss']
})
export class CategoryAutoComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @Input() control: FormControl;
  changedEntity = false;
  clearedEntity = false;
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  entity$: Observable<CategoryModel[]> = new Observable();
  haveItems = false;

  @Output() onKeyEnter = new EventEmitter();
  @Output() onOptionSelected = new EventEmitter();

  @Output() entityChange = new EventEmitter<CategoryModel>();
  @Input() entity: CategoryModel;

  @ViewChild('inputElement', { read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('inputElement') inputElement: ElementRef;


  constructor(
    private categoryService: CategoryService,
  ) { }

  public ngOnInit(): void {
    this.entity$ = this.control.valueChanges
      .pipe(
        debounceTime(300),
        filter(value => value !== undefined),
        filter(value => (typeof value === 'string')),
        tap(() => {
          if (this.changedEntity && !this.clearedEntity) {
            return;
          }
          this.loading.next(true);
        }),
        switchMap(value => {
          if (this.changedEntity && !this.clearedEntity) {
            this.changedEntity = false;
            return [];
          }
          this.clearedEntity = false;
          return this.categoryService.getAllPaginated(new QueryStringModel(
            [{key: 'name', value}], 
            [
            ],
            this.getPagination,
          )).pipe(
            map((response: Response<PageModel<CategoryModel>>) => {
              this.haveItems = false;
              if (response.code === 200) {
                this.haveItems = response.data.totalElements > 0;
                return response.data.content;
              }
              return [];
            }),
            finalize(() => {
              this.loading.next(false);
            }));
        }),
        takeUntil(this.ngUnsubscribe),
      );
      if((this.control.value && this.control.value.code === '') || this.control.value?.code === undefined) {
        this.control.setValue('');
      }
  }

  ngOnChanges(changes): void {
    if (changes.entity !== undefined && this.control) {
      // Evita cargar la lista luego de cambiar el valor del control
      this.changedEntity = true;
      if (this.entity.slug != "") {
        this.control.setValue(this.entity);
      } else {
        this.control.setValue('');
      }
    }

  }

  onFocus() {
    if (this.control.value !== '' || this.haveItems) {
      return;
    }

    this.loading.next(true);
    this.control.setValue('');
    setTimeout(() => this.trigger.openPanel());
  }

  clear() {
    // clear entity
    this.entity = new CategoryModel();
    this.entity.clear();
    this.entityChange.emit(this.entity);
    // clear entity input
    this.control.setValue('');
    // open menu
    this.clearedEntity = true;
    setTimeout(() => this.trigger.openPanel());
  }

  displayFn(entity: CategoryModel): string {
    return entity ? entity.name : '';
  }

  selectedEntity(entity: CategoryModel) {
    this.entity = entity;
    this.entityChange.emit(entity);
    this.onOptionSelected.emit();
  }

  keyUpEnter(): void  {
    this.onKeyEnter.emit();
  }
  private get getPagination(): PaginationModel {
    return new PaginationModel(0, 20);
  }
  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
