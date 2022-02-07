import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, map, merge, Observable, Subject, takeUntil, zip } from "rxjs";
import { TypeText } from "./enum/TypeText.enum";
import { ITableCheck } from "./interfaces/table.checks.interface";
import { ITranslation } from "./interfaces/translation.interface";
import { TranslationModel } from "./models/Translation.model";
import { BaseService } from "./services/base.service";


export class TableCheck {
    private ngUnsubscribe = new Subject();
    private tranlatio: BehaviorSubject<ITableCheck<ITranslation>[]> = new BehaviorSubject<ITableCheck<ITranslation>[]>([]);
    private tableItems: ITableCheck<ITranslation>[] = [];
    private selected: ITableCheck<ITranslation>;
    private trans: ITranslation[] = [];
    private slug: string;

    public translationForm: FormGroup;
    private isUpdate: boolean;
    private toastr: ToastrService;
    private translate: TranslatePipe;
    private service: BaseService;

    constructor(slug: string, isUpdate: boolean, translations: TranslationModel[], service: BaseService ,toastr: ToastrService, translate: TranslatePipe) {
        this.toastr = toastr;
        this.slug = slug;
        this.isUpdate = isUpdate;
        this.translate = translate;
        this.service = service;
        if (translations.length > 0) {
            translations.forEach(value => this.tableItems.push(
                {
                    checked: false,
                    update: false,
                    data: { lang: value.lang, text: value.text, type: value.type }
                } as ITableCheck<ITranslation>
            ));
            this.tranlatio.next(this.tableItems);
        }
    }

    public createForm(fb: FormBuilder,readonly: boolean): void {
        this.translationForm =  fb.group({
            text: [{ value: "", disabled: readonly }, [Validators.required]],
            type: [{ value: "", disabled: readonly }, [Validators.required]],
            lang: [{ value: "", disabled: readonly }, [Validators.required]],
        });
    }

    public addTranslation() {
        const control = this.translationForm.controls;
        if (!this.translationForm.valid) {
          this.toastr.warning(
            this.translate.transform("notifications.form.miss.msg"),
            this.translate.transform("notifications.form.miss.title"),
          );
          return;
        }
        const trans = this.tableItems.find((value) => value.data.lang == control['lang'].value && value.data.type == control['type'].value);
        if (trans != undefined) {
          const index = this.tableItems.indexOf(trans);
          const translationsNew = this.tableItems;
          translationsNew[index].data.text = control['text'].value;
          translationsNew[index].checked = false;
          if(this.isUpdate) this.updateCategory(translationsNew[index]);
          this.tableItems = [...translationsNew];
          this.tranlatio.next(this.tableItems);
        } else {
          const check = {
            checked: false, data: { lang: control['lang'].value, text: control['text'].value, type: control['type'].value }
          } as ITableCheck<ITranslation>;
          this.tableItems = [...this.tableItems, check];
          this.tranlatio.next(this.tableItems);
        }
        [this.translationForm.controls['text'], this.translationForm.controls['type'], this.translationForm.controls['lang']]
        .forEach((control) => control.reset()); 
    }


    public removeTranslation(): void {
        const item = this.selected;
        this.tableItems = this.tableItems.filter((value) => value.data.text != item.data.text && value.data.lang != item.data.lang);
        this.tranlatio.next(this.tableItems);
    }

    public selectTranslation(item): void {
        this.tableItems.forEach(value=> value.checked =false);
        this.tranlatio.next(this.tableItems); 
        this.selected = item;
        const controls = this.translationForm.controls;
        controls['text'].setValue(item.data.text);
        controls['type'].setValue(item.data.type);
        controls['lang'].setValue(item.data.lang);
    }


    public isNameByLanguage(lang: string): boolean {
        return  this.trans.some((value) => (value.lang === lang  && value.type === TypeText.NAME.toString()));
    }

    public save(): boolean {
        this.trans = this.tableItems.map(value => value.data);
        const spanish = this.isNameByLanguage('es');
        const english = this.isNameByLanguage('en');
        if(this.trans.length > 0 && (!spanish &&  !english) ) {
          this.toastr.warning(
            this.translate.transform("notifications.data.category.save.msg"),
            this.translate.transform("notifications.data.category.save.title"),
          );
          return true;
        }
        return false;
    }

    private updateCategory(item: ITableCheck<ITranslation>): void {
        if(this.tableItems.some( (value) => value.data.text === item.data.text))
        this.service.updateTransBySlug(this.slug, item.data).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
    }

    public get translations() {
        return this.trans;
    }

    public get onTranslationChange(): Observable<ITableCheck<ITranslation>[]> {
        return this.tranlatio.asObservable();
    }
    
}