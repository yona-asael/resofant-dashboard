export class PaginationModel {
    public pageIndex: number;
    public pageSize: number;

    constructor(index: number = 0, size: number = 0) {
        this.pageIndex = index; 
        this.pageSize = size;
    }

    public get getPaginator(): string {
        return `pageIndex:${this.pageIndex}:pageSize:${this.pageSize}`;
    }
}