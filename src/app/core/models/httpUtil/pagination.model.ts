import { IHTTPParamsCriteria } from "../../interfaces/HTTPUtil/http-params-criteria.interface";

export class PaginationModel {
    public pageIndex: number;
    public pageSize: number;

    constructor(index: number = 0, size: number = 0) {
        this.pageIndex = index; 
        this.pageSize = size;
    }

    public get getPaginator(): IHTTPParamsCriteria[] {
        return [
            {key: 'pageIndex', value: this.pageIndex.toString()},
            {key: 'pageSize', value: this.pageSize.toString()}
        ];
    }
}