import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { STATUS } from 'src/app/core/enum/Status.enum';
import { MatFabMenu } from '@angular-material-extensions/fab-menu';
import { map, merge, Subject,} from 'rxjs';
import { CategoryModel } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslatePipe,  } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { IHTTPParamsCriteria } from 'src/app/core/interfaces/HTTPUtil/http-params-criteria.interface';
import { Table } from 'src/app/core/table';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  public baseRoute: string = 'categories';
  public status = [
    { value: STATUS.ACTIVE.toString(), label: "status.ACTIVE" },
    { value: STATUS.DISABLED.toString(), label: "status.DISABLED" }
  ];
  public fabButtonsRandom: MatFabMenu[] = [];
  public formCategory: FormGroup;

  public tableController: Table<CategoryModel>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private translation: TranslatePipe,
  ) { }

  ngOnInit(): void {
    this.tableController = new Table(this.categoryService, ["SELECT", 'SLUG', 'NAME', 'DESCRIPTION', 'STATUS']);
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
      case 1: this.router.navigate(['/categories', 'create']);
        break;
      case 2: this.router.navigate(['/categories', 'edit', selected.slug]);
        break;
      case 3:this.router.navigate(['/categories', 'preview', selected.slug ]);
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
    this.tableController.setFormsChanges(merge(
        controls['slug'].valueChanges.pipe(map( value => {return { key: "slug", value: value} as IHTTPParamsCriteria})),
        controls['name'].valueChanges.pipe(map( value => {return { key: "name", value: value} as IHTTPParamsCriteria})),
        controls['status'].valueChanges.pipe(map( value => {return { key: "status", value: value} as IHTTPParamsCriteria})),
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
