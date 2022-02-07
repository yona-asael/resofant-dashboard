import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { BehaviorSubject, debounceTime, filter, finalize, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ListenerOperation } from 'src/app/core/enum/Listener.enu';
import { PaginationModel } from 'src/app/core/models/httpUtil/pagination.model';
import { QueryStringModel } from 'src/app/core/models/httpUtil/query-string.model';
import { TypeListener } from 'src/app/core/models/listeners/type-listener';
import { PageModel } from 'src/app/core/models/page.model';
import { Response } from 'src/app/core/models/response.model';
import { TypeModel } from 'src/app/core/models/type.model';
import { ListenerService } from 'src/app/core/services/listener.service';
import { TypeService } from 'src/app/core/services/type.service';
@Component({
  selector: 'type-auto',
  templateUrl: './type-auto.component.html',
  styleUrls: ['./type-auto.component.scss']
})
export class TypeAutoComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @Input() control: FormControl;
  changedEntity = false;
  clearedEntity = false;
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  entity$: Observable<TypeModel[]> = new Observable();
  entities: TypeModel[] = [];
  haveItems = false;

  @Output() onKeyEnter = new EventEmitter();
  @Output() onOptionSelected = new EventEmitter();

  @Output() entityChange = new EventEmitter<TypeModel>();
  @Input() entity: TypeModel;

  @ViewChild('inputElement', { read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('inputElement') inputElement: ElementRef;


  constructor(
    private typeService: TypeService,
    private listenerService: ListenerService<TypeListener>
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
          return this.typeService.getAllPaginated(new QueryStringModel(
            [{key: 'name', value}], 
            [
            ],
            this.getPagination,
          )).pipe(
            map((response: Response<PageModel<TypeModel>>) => {
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
    this.entity = new TypeModel();
    this.entity.clear();
    this.entityChange.emit(this.entity);
    // clear entity input
    this.control.setValue('');
    // open menu
    this.clearedEntity = true;
    setTimeout(() => this.trigger.openPanel());
  }

  displayFn(entity: TypeModel): string {
    return entity ? entity.name : '';
  }

  selectedEntity(entity: TypeModel) {
    this.entity = entity;
    if(this.entities.indexOf(entity) === -1) this.entities.push(entity);
    this.listenerService.setData = new TypeListener(entity, ListenerOperation.ADD);
    this.control.setValue('');
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