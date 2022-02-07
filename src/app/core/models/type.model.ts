import { Model } from "./model";

export class TypeModel extends Model {
    public slug: string;
    public status: string;
    public name: string;
    public description: string;
    public category: string;

    constructor() {
        super();
        this.slug = "";
        this.status = "";
        this.name = "";
        this.description = "";
        this.category = '';
    }

    public clear() {
        this.slug = "";
        this.status = "";
        this.name = "";
        this.description = "";
        this.category = '';
    }
}