import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';


import { TranslationModel } from 'src/app/core/models/Translation.model';
import { Response } from 'src/app/core/models/response.model';

import { STATUS } from 'src/app/core/enum/Status.enum';

import { TableCheck } from 'src/app/core/table-check';
import { ITranslation } from 'src/app/core/interfaces/translation.interface';
import { ITableCheck } from 'src/app/core/interfaces/table.checks.interface';
import { ProductModel } from 'src/app/core/models/product.model';
import { TypeText } from 'src/app/core/enum/TypeText.enum';
import { ProductService } from 'src/app/core/services/product.service';
import { TypeModel } from 'src/app/core/models/type.model';
import { IProduct } from 'src/app/core/interfaces/product.interface';
import { IType } from 'src/app/core/interfaces/type.interface';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit{
  private ngUnsubscribe = new Subject();
  public baseRoute: string = '/products';
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
  
  public productForm: FormGroup;
  private product: ProductModel;

  public readonly: boolean;
  public isUpdate: boolean;
  public productText: string;
  private types: TypeModel[];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslatePipe,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.readonly = this.activatedRoute.snapshot.data['readonly'];
    this.isUpdate = this.activatedRoute.snapshot.data['update'];
    this.productText = this.isUpdate ? 'actions.update' : 'actions.create';
    const product = this.activatedRoute.snapshot.data['product'] as Response<ProductModel>;
    const trans = this.activatedRoute.snapshot.data['trans'] as Response<TranslationModel[]>;
    if (product != null) this.product = product.data;
    if (trans != null) this.tableCheck = new TableCheck(this.product.slug, this.isUpdate, trans.data, this.productService, this.toastr, this.translate);
    this.createForm();
  }

  private createForm(): void {
    const isCreate = this.isUpdate ? false : true;
    this.tableCheck.createForm(this.fb, this.readonly);
    this.productForm = this.fb.group({
      slug: [{ value: this.product.slug, disabled: (!isCreate || this.readonly) }, !isCreate ? [Validators.required] : []],
      status: [{ value: isCreate ? STATUS.ACTIVE : this.product.status, disabled: (isCreate || this.readonly) }, isCreate ? [] : [Validators.required]],
      price: [{ value: this.product.price, disabled:  this.readonly }, [Validators.required, Validators.pattern(/^\d+\.\d{2}$/)] ],
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
    if (this.productForm.valid ) this.create();
  }

  private update(): void {
    console.log(this.product.slug, this.ProducModel);
    this.productService.updateProduct(this.product.slug, this.ProducModel).pipe(takeUntil(this.ngUnsubscribe)).subscribe((res) => {
      this.router.navigate([this.baseRoute]);
    })
  }

  private create(): void {
    this.productService.createProduct(this.IProduct).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.router.navigate([this.baseRoute]);
    });
  }

  public getTypes(types): void {
    this.types = types;
  }

  private get ProducModel(): ProductModel {
    const controls = this.productForm.controls;
    const types = this.types.map((value) => value.slug);
    this.product.price = controls['price'].value,
    this.product.status = controls['status'].value,
    this.product.types = types;
    return this.product;
  }
  
  private get IProduct(): IProduct {
    const types = this.types.map((value) => {return { slug: value.slug } as IType});
    const price = Number(this.productForm.controls['price'].value).toFixed(2);
    return {
      slug: this.productForm.controls['slug'].value,
      price: Number(price),
      types: types,
      translations: this.tableCheck.translations,
    } as IProduct
  }

  public get autControl(): FormControl {
    return this.productForm.get("types") as FormControl;
  }
}

