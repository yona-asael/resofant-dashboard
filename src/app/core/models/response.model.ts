import { MessageModel } from "./message.model";


export class Response<T> {
    public data: T
    public message: MessageModel;
    public status: number;

    constructor(data: T, status: number) {
        this.data = data;
        this.status = status;
    }
}