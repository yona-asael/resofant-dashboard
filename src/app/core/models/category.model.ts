import { Model } from "./model";

export class CategoryModel extends Model {
    public slug: string;
    public status: string;
    public name: string;
    public description: string;

    constructor() {
        super();
        this.slug = "";
        this.status = "";
        this.name = "";
        this.description = "";
    }
}