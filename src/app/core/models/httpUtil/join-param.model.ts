export class JoinParamModel {
    public join: string;
    public operation: string;
    public key: string;

    constructor(join: string , operation: string, key: string) {
        this.join = join;
        this.operation = operation;
        this.key = key;
    }
    
    public static getJoin(join: string , operation: string, key: string): string {
        return `${join}/${operation}/${key}`;
    }

    get toString(){
        return `${this.join}/${this.operation}/${this.key}`;
    }
}