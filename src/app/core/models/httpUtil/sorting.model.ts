import { SortEnum } from "../../enum/operations/sort.enum";
import { IHTTPParamsCriteria } from "../../interfaces/HTTPUtil/http-params-criteria.interface";

export type Direction = 'asc' | 'desc';
export class SortingModel {
    public key: string;
    public isAsc: Direction;

    constructor(key: string, isAsc: Direction) {
        this.key = `${key}_${isAsc.toString()}`;
        this.isAsc = isAsc;
    }

    public get query(): IHTTPParamsCriteria {
        return { key: this.key, value: this.isAsc.toString()};
    }
}