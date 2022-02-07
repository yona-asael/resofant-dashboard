import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { ListenerOperation } from 'src/app/core/enum/Listener.enu';
import { STATUS } from 'src/app/core/enum/Status.enum';
import { ITableCheck } from 'src/app/core/interfaces/table.checks.interface';
import { TypeListener } from 'src/app/core/models/listeners/type-listener';
import { Response } from 'src/app/core/models/response.model';
import { TypeModel } from 'src/app/core/models/type.model';
import { ListenerService } from 'src/app/core/services/listener.service';

@Component({
  selector: 'app-types-list',
  templateUrl: './types-list.component.html',
  styleUrls: ['./types-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypesListComponent implements OnInit, OnDestroy, AfterViewInit {
  private ngUnSubscribe = new Subject();
  public displayedColumns: string[] = ["SELECT", 'SLUG', 'NAME', 'DESCRIPTION', 'STATUS'];
  public readonly: boolean;
  public isUpdate: boolean;
  public productText: string;
  
  public typeControl: FormControl; 
  private types: ITableCheck<TypeModel>[] = [];
  private selected: TypeModel;
  
  public dataSource: MatTableDataSource<ITableCheck<TypeModel>>;
  public selection = new SelectionModel<ITableCheck<TypeModel>>(true, []);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean>;
  @ViewChildren('checkboxMultiple') private checkboxesMultiple : QueryList<any>;
  @Output() public typesEmit = new EventEmitter<TypeModel[]>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private listenerService: ListenerService<TypeListener>,
  ) { }

  public ngOnInit(): void {
    this.readonly = this.activatedRoute.snapshot.data['readonly'];
    this.isUpdate = this.activatedRoute.snapshot.data['update'];
    this.productText = this.isUpdate ? 'actions.update' : 'actions.create';
    const type = this.activatedRoute.snapshot.data['types'] as Response<TypeModel[]>;
    this.typeControl = new FormControl({value: "", disabled:this.readonly});
    this.types = type.data.map((value) => { return {checked: false, data: value, update: false} as ITableCheck<TypeModel>});
    this.dataSource = new MatTableDataSource<ITableCheck<TypeModel>>(this.types );
    if(this.readonly ) this.displayedColumns = this.displayedColumns.filter( (value) => value !== "SELECT")
    this.onTypeChange();
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private onTypeChange(): void {
    this.listenerService.onChange.pipe(
      takeUntil(this.ngUnSubscribe),
      tap( () => this.loadingSubject.next(true)),
    ).subscribe( (data) => {
      if(this.checkboxesMultiple) this.checkboxesMultiple.forEach( (value) => value.checked = false)
      if(data.operation.toString() === ListenerOperation.ADD.toString()) {
        if(!this.types.some((value) => value.data.slug === data.data.slug)){
          this.types.push( {checked: false, data: data.data, update: false} as ITableCheck<TypeModel>)
          this.typesEmit.emit(this.types.map( value => value.data));
        }
      } else {
        this.types = this.types.filter((value) => value.data.slug !== data.data.slug);
        this.typesEmit.emit(this.types.map( value => value.data));
      }
      this.dataSource = new MatTableDataSource<ITableCheck<TypeModel>>(this.types);
      this.loadingSubject.next(false);
    });
  }

  public selectItem(item): void {
    this.selected = (item as ITableCheck<TypeModel>).data;
  }

  public removeitem(): void {
    if(this.selected !== undefined) {
      this.listenerService.setData = new TypeListener(this.selected, ListenerOperation.DELETE) 
    }
  }

  public getTranslate(status: string): string {
    return status === STATUS.ACTIVE.toString() ? 'status.ACTIVE' : 'status.DISABLED';
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next(null);
    this.ngUnSubscribe.unsubscribe();
  }
}
