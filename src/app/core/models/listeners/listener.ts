import { ListenerOperation } from "../../enum/Listener.enu";

export abstract class Listener<T> {
    public data: T;
    public operation: ListenerOperation;

    constructor(data: T, operation: ListenerOperation) {
        this.data = data;
        this.operation = operation;
    }
}