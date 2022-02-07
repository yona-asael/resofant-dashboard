import { Model } from "./model";
import { TypeModel } from "./type.model";

export class ProductModel extends Model {
    slug: string;
    price: number;
    name: string;
    description: string;
    status: string;
    types: TypeModel[] | String [];

    constructor() {
        super();
        this.slug = "";
        this.price = 0;
        this.name = "";
        this.description = "";
        this.status = "";
        this.types = []; 
    }
}