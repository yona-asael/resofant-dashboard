import { Model } from "./model";

export class TranslationModel extends Model {
    public text: string;
    public lang: string;
    public type: string;
    
    constructor() {
        super();
        this.text = "";
        this.lang = "";
        this.type = "";
    }
}



