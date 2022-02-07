import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';

import { ICategory } from 'src/app/core/interfaces/category.interface';

import { TranslationModel } from 'src/app/core/models/Translation.model';
import { Response } from 'src/app/core/models/response.model';

import { TypeText } from 'src/app/core/enum/TypeText.enum';
import { STATUS } from 'src/app/core/enum/Status.enum';

import { TableCheck } from 'src/app/core/table-check';
import { ITranslation } from 'src/app/core/interfaces/translation.interface';
import { ITableCheck } from 'src/app/core/interfaces/table.checks.interface';
import { TypeService } from 'src/app/core/services/type.service';
import { IType } from 'src/app/core/interfaces/type.interface';
import { TypeModel } from 'src/app/core/models/type.model';
import { CategoryModel } from 'src/app/core/models/category.model';

@Component({
  selector: 'app-types-edit',
  templateUrl: './types-edit.component.html',
  styleUrls: ['./types-edit.component.scss']
})
export class TypesEditComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public baseRoute: string = '/types';
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
  
  public typeForm: FormGroup;
  private type: TypeModel;

  public readonly: boolean;
  public isUpdate: boolean;
  public typeText: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslatePipe,
    private activatedRoute: ActivatedRoute,
    private typeService: TypeService,
  ) { }

  ngOnInit(): void {
    this.readonly = this.activatedRoute.snapshot.data['readonly'];
    this.isUpdate = this.activatedRoute.snapshot.data['update'];
    this.typeText = this.isUpdate ? 'actions.update' : 'actions.create';
    const type = this.activatedRoute.snapshot.data['type'] as Response<TypeModel>;
    const trans = this.activatedRoute.snapshot.data['trans'] as Response<TranslationModel[]>;
    if (type != null) this.type = type.data;
    if (trans != null) this.tableCheck = new TableCheck(this.type.slug, this.isUpdate, trans.data, this.typeService, this.toastr, this.translate);
    this.createForm();
  }

  private createForm(): void {
    const isCreate = this.isUpdate ? false : true;
    this.tableCheck.createForm(this.fb, this.readonly);
    this.typeForm = this.fb.group({
      slug: [{ value: this.type.slug, disabled: (!isCreate || this.readonly) }, !isCreate ? [Validators.required] : []],
      status: [{ value: isCreate ? STATUS.ACTIVE : this.type.status, disabled: (isCreate || this.readonly) }, isCreate ? [] : [Validators.required]],
      category: [{value: this.type.category, disabled: this.readonly}, [Validators.required]]
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
    if (this.isUpdate) this.update();
    if (this.typeForm.valid && !this.isUpdate) this.create();
  }

  private update(): void {
    const category = this.typeForm.controls['category'].value as CategoryModel;
    this.typeService.updateTypeBySlug(this.type.slug, this.typeForm.controls['status'].value).subscribe();
    this.typeService.updateCategoryBySlug(this.type.slug, category.slug).subscribe();
  }

  private create(): void {
    this.typeService.createCagetory(this.IType).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.router.navigate([this.baseRoute]);
    });
  }

  private get IType(): IType {
    const category = this.typeForm.controls['category'].value as CategoryModel;
    return {
      slug: this.typeForm.controls['slug'].value,
      category: {slug:  category.slug} as ICategory,
      translations: this.tableCheck.translations,
    } as IType
  }

  public get autControl(): FormControl {
    return this.typeForm.get("category") as FormControl;
  }
}

