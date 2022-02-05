import { IBase } from "./base.interface";
import { ITranslation } from "./translation.interface";

export interface ICategory extends IBase {
    slug: string;
    translations: ITranslation[]
}