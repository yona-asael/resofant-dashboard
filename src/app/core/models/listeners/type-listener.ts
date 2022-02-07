import { ListenerOperation } from "../../enum/Listener.enu";
import { TypeModel } from "../type.model";
import { Listener } from "./listener";

export class TypeListener extends Listener<TypeModel> {

    constructor(data: TypeModel, operation: ListenerOperation) {
        super(data, operation);
    }
}