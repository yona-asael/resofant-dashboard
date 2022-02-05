import { IBase } from "./base.interface";

export interface ITableCheck<T> extends IBase { 
    checked: boolean,
    update: boolean,
    data: T,
}