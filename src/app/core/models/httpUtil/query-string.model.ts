
import { QueryStringEnum } from "../../enum/operations/query.string.enum";
import { IHTTPParamsCriteria } from "../../interfaces/HTTPUtil/http-params-criteria.interface";
import { PaginationModel } from "./pagination.model";
import { SearchCriteriaModel } from "./search-criteria.model";
import { SortingModel } from "./sorting.model";

export class QueryStringModel {
    public pagination: PaginationModel;
    public searchCriterias: SearchCriteriaModel[];
    public sortings: SortingModel[]; 
    public genericParams: IHTTPParamsCriteria [];
    
    constructor(
        genericParams: IHTTPParamsCriteria[] = [],
        searchCriterias: SearchCriteriaModel[] =  [] as SearchCriteriaModel[],
        pagination: PaginationModel = new PaginationModel, 
        sortings: SortingModel[] =  [] as SortingModel[],
    ) {
        this.genericParams = genericParams;
        this.pagination = pagination;
        this.searchCriterias = searchCriterias;
        this.sortings = sortings;
    }

    public get hasSearchCriterias(): boolean {
        return this.searchCriterias.length >= 1;
    }

    public get hasSorting(): boolean {
        return this.sortings.length >= 1;
    }
    public get hasPagination(): boolean {
        return (this.pagination.pageIndex !== 0 || this.pagination.pageSize !== 0);
    }

    public get getHTTPParamsCriteria(): IHTTPParamsCriteria [] {
        let array = [...this.genericParams];
        array = this.pushItem(this.hasSearchCriterias, this.searchCriteriaBuilder, array);
        array = this.pushItem(this.hasPagination, this.paginatorBuilder, array);
        array = this.pushItem(this.hasSorting, this.sortingBuilder, array);
        return array;
    }

    private get paginatorBuilder(): IHTTPParamsCriteria {
        return {key: QueryStringEnum.PAGINATION, value: this.pagination.getPaginator} as IHTTPParamsCriteria;
    }

    private get searchCriteriaBuilder(): IHTTPParamsCriteria {
        let search = '';
        this.searchCriterias.forEach( (criteria, indx) => 
            (indx !== this.searchCriterias.length - 1) ? 
            search += `${criteria.convertToSearchItem},` 
            : search += `${criteria.convertToSearchItem}`
        );
        return {key: QueryStringEnum.SEARCH, value: search} as IHTTPParamsCriteria;
    }

    private get sortingBuilder(): IHTTPParamsCriteria {
        let storing = '';
        this.sortings.forEach( (sort, indx) =>    
            (indx !== this.sortings.length - 1) ? 
            storing += `${sort.query},` 
            : storing += `${sort.query}`
        )
        return {key: QueryStringEnum.SORT, value: storing} as IHTTPParamsCriteria; 
    }

    private pushItem(toPush: boolean, value : IHTTPParamsCriteria ,array: IHTTPParamsCriteria[]): IHTTPParamsCriteria[] {
        if(toPush) {
            array.push(value);
        } 
        return array;
    }
}