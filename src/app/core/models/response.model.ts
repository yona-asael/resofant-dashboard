export class Response<T> {
    public data: T;
    public code: number;
    public status: string;
    public message: string;
    public timestamp: string;
    public type: string

    constructor(data: T) {
        this.message = "";
        this.code = 0;
        this.status = "";
        this.message = "";
        this.timestamp = "";
        this.type = "";
        this.data = data;
    }

}