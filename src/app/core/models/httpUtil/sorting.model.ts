import { SortEnum } from "../../enum/operations/sort.enum";


export class SortingModel {
    public key: string;
    public isAsc: boolean;

    constructor(key: string, isAsc: boolean) {
        this.key = key;
        this.isAsc = isAsc;
    }

    public get query(): string {
        return `${this.key}:${this.isAsc ? SortEnum.ASC : SortEnum.DESC}`;
    }
}