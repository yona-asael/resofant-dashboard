import { Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ITranslation } from 'src/app/core/interfaces/translation.interface';
import {SelectionModel} from '@angular/cdk/collections';
import { ITableCheck } from 'src/app/core/interfaces/table.checks.interface';

@Component({
  selector: 'translations-list',
  templateUrl: './translations-list.component.html',
  styleUrls: ['./translations-list.component.scss']
})
export class TranslationsListComponent implements OnInit, OnChanges {

  @Input() public translations: ITableCheck<ITranslation>[];
  @Output() public item: EventEmitter<ITableCheck<ITranslation>>  = new EventEmitter<ITableCheck<ITranslation>>();

  public displayedColumns = ['SELECT', 'TEXT', 'TYPE', 'LANG'];
  public dataSource: MatTableDataSource<ITableCheck<ITranslation>>;
  public selection = new SelectionModel<ITableCheck<ITranslation>>(true, []);
  @ViewChildren('checkboxMultiple') private checkboxesMultiple : QueryList<any>;

  constructor() { }

  public ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ITableCheck<ITranslation>>(this.translations);
  }

  public ngOnChanges(changes): void {
    if(changes['translations']) {
      if(this.checkboxesMultiple) this.checkboxesMultiple.forEach( (value) => value.checked = false)
      this.translations =  changes['translations'].currentValue as ITableCheck<ITranslation>[];
      this.dataSource = new MatTableDataSource<ITableCheck<ITranslation>>(this.translations);
    }
  }

  public getType(type: string): string {
    return type == "NAME" ? 'types.name' : 'types.desc';
  }

  public selectItem(translation): void {
    this.translations.forEach((value) => {  value.checked = false });
    this.item.emit(translation);
  }

}
