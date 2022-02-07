import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map, merge, pipe, Subject } from 'rxjs';
import { ListenerOperation } from 'src/app/core/enum/Listener.enu';
import { STATUS } from 'src/app/core/enum/Status.enum';
import { IHTTPParamsCriteria } from 'src/app/core/interfaces/HTTPUtil/http-params-criteria.interface';
import { TypeListener } from 'src/app/core/models/listeners/type-listener';
import { ProductModel } from 'src/app/core/models/product.model';
import { TypeModel } from 'src/app/core/models/type.model';
import { ListenerService } from 'src/app/core/services/listener.service';
import { ProductService } from 'src/app/core/services/product.service';
import { Table } from 'src/app/core/table';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  public baseRoute: string = '/products';
  public status = [
    { value: STATUS.ACTIVE.toString(), label: "status.ACTIVE" },
    { value: STATUS.DISABLED.toString(), label: "status.DISABLED" }
  ];
  public fabButtonsRandom: MatFabMenu[] = [];
  public formType: FormGroup;
  public tableController: Table<ProductModel>;
  private types: String[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private translation: TranslatePipe,
    private listenerService: ListenerService<TypeListener>,
    ) { }

  ngOnInit(): void {
    this.tableController = new Table(this.productService, ["SELECT", 'SLUG', 'NAME', 'DESCRIPTION', 'STATUS']);
    this.fabButtonsRandom.push({ id: 1, icon: 'add', tooltip: this.translation.transform("fab.add"), tooltipPosition: 'below'});
    this.createForm();
  }

  ngAfterViewInit(): void { 
    this.tableController.setPaginatorAndSort(this.paginator, this.sort)
    this.tableController.initTable();
  }
  
  public onSelectionCategory(id): void {
    const selected = this.tableController.Selected;
    switch (id) {
      case 1: this.router.navigate([this.baseRoute, 'create']);
        break;
      case 2: this.router.navigate([this.baseRoute, 'edit', selected.slug]);
        break;
      case 3:this.router.navigate([this.baseRoute, 'preview', selected.slug ]);
        break;
      default:
        break;
    }
  }

  private createForm(): void {
    this.formType = this.fb.group( {
      slug: [""],
      name: [""],
      status: ["ACTIVE"],
      types: [],
    });
    this.onChanges();
  }

  public get autControl(): FormControl {
    return this.formType.get("types") as FormControl;
  }

  private onChanges(): void {
    const controls = this.formType.controls;
    this.tableController.setFormsChanges(merge(
        controls['slug'].valueChanges.pipe(map( value => {return { key: "slug", value: value} as IHTTPParamsCriteria})),
        controls['name'].valueChanges.pipe(map( value => {return { key: "name", value: value} as IHTTPParamsCriteria})),
        controls['status'].valueChanges.pipe(map( (value) => {return { key: "status", value: value} as IHTTPParamsCriteria})),
        this.listenerService.onChange.pipe(
          filter( (value) => value instanceof TypeListener),
          map( (value: TypeListener) => {
            if(value.operation === ListenerOperation.DELETE) this.types = this.types.filter( (slug) => slug !== value.data.slug);
            if(value['data'] === undefined ) return [];
            if(this.types.indexOf(value.data.slug) === -1 && value.operation === ListenerOperation.ADD) this.types.push(value.data.slug);
            return { key: "types", value: this.types.join(', ')}
          })
        )
    )).subscribe();
   
  }

  public changeSelector(element): void {
    this.tableController.changeSelector(element);
    if(!this.fabButtonsRandom.some( (value) => value.id === 2)) {
      this.fabButtonsRandom.push(
        { id: 2, icon: 'edit', tooltip: this.translation.transform("fab.edit"), tooltipPosition: 'below'},
        { id: 3, icon: 'visibility', tooltip: this.translation.transform("fab.preview"), tooltipPosition: 'below'},
      );
    }
  }

  public getTranslate(status: string): string {
    return status === STATUS.ACTIVE.toString() ? 'status.ACTIVE' : 'status.DISABLED';
  }

  ngOnDestroy(): void {
    this.tableController.unSubscribe();
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
