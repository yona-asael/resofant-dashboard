import { IBase } from "./base.interface";
import { ICategory } from "./category.interface";
import { ITranslation } from "./translation.interface";

export interface IType  extends IBase {
    slug: string;
    category: ICategory;
    translations: ITranslation[]
}