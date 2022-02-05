import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeText } from 'src/app/core/enum/TypeText.enum';
import { ICategory } from 'src/app/core/interfaces/category.interface';
import { ITranslation } from 'src/app/core/interfaces/translation.interface';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';
import { ITableCheck } from 'src/app/core/interfaces/table.checks.interface';
import { Response } from 'src/app/core/models/response.model';
import { CategoryModel } from 'src/app/core/models/category.model';
import { TranslationModel } from 'src/app/core/models/Translation.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { Subject, takeUntil } from 'rxjs';
import { STATUS } from 'src/app/core/enum/Status.enum';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public baseRoute: string = '/categories';
  public statusSelect = [
    { value: STATUS.ACTIVE.toString(), label: "status.ACTIVE" },
    { value: STATUS.DISABLED.toString(), label: "status.DISABLED" }
  ];
  public textTypes = [
    { value: TypeText.NAME.toString(), label: 'types.name' },
    { value: TypeText.DESCRIPTION.toString(), label: 'types.desc' },
  ];
  public langs: string[] = ['es', "en"]

  private selected: ITableCheck<ITranslation>;
  public translations: ITableCheck<ITranslation>[] = [];
  public trans: ITranslation[] = [];

  private category: CategoryModel;
  public categoryForm: FormGroup;
  
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
    if (trans != null) {
      if (trans.data.length > 0) {
        trans.data.forEach(value => this.translations.push({
          checked: false,
          update: false,
          data: { lang: value.lang, text: value.text, type: value.type }
        } as ITableCheck<ITranslation>));
      }
    }
    this.createForm();
  }

  private createForm(): void {
    const isCreate = this.isUpdate ? false : true;
    this.categoryForm = this.fb.group({
      slug: [{ value: this.category.slug, disabled: (!isCreate  || this.readonly)}, !isCreate ? [Validators.required] : [] ],
      status: [{ value: isCreate ? STATUS.ACTIVE : this.category.status , disabled: (isCreate || this.readonly) }, isCreate ? [] : [Validators.required]],
      text: [{ value: "", disabled: this.readonly }, [Validators.required]],
      type: [{ value: "", disabled: this.readonly }, [Validators.required]],
      lang: [{ value: "", disabled: this.readonly }, [Validators.required]],
    });
  }

  public addTranslation(): void {
    const control = this.categoryForm.controls;
    if (!this.categoryForm.valid) {
      this.toastr.warning(
        this.translate.transform("notifications.form.miss.msg"),
        this.translate.transform("notifications.form.miss.title"),
      );
      return;
    }
    const trans = this.translations.find((value) => value.data.lang == control['lang'].value && value.data.type == control['type'].value);
    if (trans != undefined) {
      const index = this.translations.indexOf(trans);
      const translationsNew = this.translations;
      translationsNew[index].data.text = control['text'].value;
      translationsNew[index].checked = false;
      if(this.isUpdate) this.updateCategory(translationsNew[index]);
      this.translations = [...translationsNew];
    } else {
      const check = {
        checked: false, data: { lang: control['lang'].value, text: control['text'].value, type: control['type'].value }
      } as ITableCheck<ITranslation>;
      this.translations = [...this.translations, check];
    }
    [this.categoryForm.controls['text'], this.categoryForm.controls['type'], this.categoryForm.controls['lang']]
    .forEach((control) => control.reset()); 
  }

  public removeTranslation(): void {
    const item = this.selected;
    this.translations = this.translations.filter((value) => value.data.text != item.data.text && value.data.lang != item.data.lang);
  }

  public selectTranslation(item): void {
    this.translations.forEach(value=> value.checked =false);
    this.translations = this.translations;
    this.selected = item;
    const controls = this.categoryForm.controls;
    controls['text'].setValue(item.data.text);
    controls['type'].setValue(item.data.type);
    controls['lang'].setValue(item.data.lang);
  }

  public save(): void {
    if(this.isUpdate) this.categoryService.updateStatusBySlig(this.category.slug, this.categoryForm.controls['slug'].value);
    this.trans = this.translations.map(value => value.data);
    const spanish = this.trans.some((value) => (value.lang === 'es'  && value.type === TypeText.NAME.toString()));
    const english = this.trans.some((value) => (value.lang === 'en'  && value.type === TypeText.NAME.toString()));
    if(this.trans.length > 0 && !spanish ) {
      this.toastr.warning(
        this.translate.transform("notifications.data.category.save.msg"),
        this.translate.transform("notifications.data.category.save.title"),
      );
      return;
    }
    if(this.categoryForm.controls['slug'].valid && spanish) {
      this.categoryService.createCagetory(this.ICategory).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.router.navigate([this.baseRoute]);
      });
    }
  }

  private updateCategory(item: ITableCheck<ITranslation>): void {
    if(this.translations.some( (value) => value.data.text === item.data.text)) return;
    this.categoryService.updateTransBySlug(this.category.slug, item.data).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
  }

  private get ICategory(): ICategory {
    return {
      slug: this.categoryForm.controls['slug'].value,
      translations: this.trans,
    } as ICategory
  }

}
