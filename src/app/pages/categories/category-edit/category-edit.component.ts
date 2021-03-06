import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';

import { CategoryService } from 'src/app/core/services/category.service';

import { ICategory } from 'src/app/core/interfaces/category.interface';

import { TranslationModel } from 'src/app/core/models/Translation.model';
import { CategoryModel } from 'src/app/core/models/category.model';
import { Response } from 'src/app/core/models/response.model';

import { TypeText } from 'src/app/core/enum/TypeText.enum';
import { STATUS } from 'src/app/core/enum/Status.enum';

import { TableCheck } from 'src/app/core/table-check';
import { ITranslation } from 'src/app/core/interfaces/translation.interface';
import { ITableCheck } from 'src/app/core/interfaces/table.checks.interface';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public baseRoute: string = '/categories';
  public langs: string[] = ['es', "en"]
  public statusSelect = [
    { value: STATUS.ACTIVE.toString(), label: "status.ACTIVE" },
    { value: STATUS.DISABLED.toString(), label: "status.DISABLED" }
  ];
  public textTypes = [
    { value: TypeText.NAME.toString(), label: 'types.name' },
    { value: TypeText.DESCRIPTION.toString(), label: 'types.desc' },
  ];
  
  public tableCheck: TableCheck;
  public tableItems: ITableCheck<ITranslation>[];
  private translations: ITranslation[];
  
  public categoryForm: FormGroup;
  private category: CategoryModel;

  public readonly: boolean;
  public isUpdate: boolean;
  public type: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslatePipe,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this.readonly = this.activatedRoute.snapshot.data['readonly'];
    this.isUpdate = this.activatedRoute.snapshot.data['update'];
    this.type = this.isUpdate ? 'actions.update' : 'actions.create';
    const category = this.activatedRoute.snapshot.data['category'] as Response<CategoryModel>;
    const trans = this.activatedRoute.snapshot.data['trans'] as Response<TranslationModel[]>;
    if (category != null) this.category = category.data;
    if (trans != null) this.tableCheck = new TableCheck(this.category.slug, this.isUpdate, trans.data, this.categoryService, this.toastr, this.translate);
    this.createForm();
  }

  private createForm(): void {
    const isCreate = this.isUpdate ? false : true;
    this.tableCheck.createForm(this.fb, this.readonly);
    this.categoryForm = this.fb.group({
      slug: [{ value: this.category.slug, disabled: (!isCreate || this.readonly) }, !isCreate ? [Validators.required] : []],
      status: [{ value: isCreate ? STATUS.ACTIVE : this.category.status, disabled: (isCreate || this.readonly) }, isCreate ? [] : [Validators.required]],
    });
    this.tableCheck.onTranslationChange.subscribe( (translations) => this.tableItems = translations);
  }

  public addTranslation(): void {
    this.tableCheck.addTranslation();
  }

  public removeTranslation(): void {
    this.tableCheck.removeTranslation();
  }

  public selectTranslation(item): void {
    this.tableCheck.selectTranslation(item);
  }

  public save(): void {
    if (this.tableCheck.save()) return;
    if (this.isUpdate) this.categoryService.updateStatusBySlug(this.category.slug, this.categoryForm.controls['status'].value);
    if (this.categoryForm.controls['slug'].valid && !this.isUpdate) {
      this.categoryService.createCagetory(this.ICategory).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.router.navigate([this.baseRoute]);
      });
    }
  }

  private get ICategory(): ICategory {
    return {
      slug: this.categoryForm.controls['slug'].value,
      translations: this.tableCheck.translations,
    } as ICategory
  }

}
