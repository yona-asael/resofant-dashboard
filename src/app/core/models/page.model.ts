
export class PageModel<T> {
    public content: T[];
    public pageable: IPageable;
    public sort: ISort
    
    public totalElements: number;
    public totalPages: number;
    public last: boolean;
    public empty: boolean;
}

interface IPageable {
    page: number,
    size: number,
    sort: ISort
}

interface ISort {
    unsorted: boolean,
    sorted: boolean,
    empty: boolean,
}