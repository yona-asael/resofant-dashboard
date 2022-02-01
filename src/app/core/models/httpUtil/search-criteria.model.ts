export class SearchCriteriaModel {
    private key: string;
    private value: string | number ;
    private operation: string;
    private isOrPredicated: boolean;

    constructor(key: string, operation: string, value: string | number, isOrPredicated: boolean = false) { 
        this.key = key;
        this.value = value;
        this.operation = operation;
        this.isOrPredicated = isOrPredicated;
    }

    public set Value(value: string | number) {
        this.value = value;
    }

    public get Key(): string {
        return this.key;
    }

    public get convertToSearchItem(): string {
        return `${this.key}!${this.operation}!${this.value}`;
    }

}