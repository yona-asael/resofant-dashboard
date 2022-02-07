import { ITranslation } from "./translation.interface";
import { IType } from "./type.interface";

export interface IProduct {
    slug: string;
    price: number;
    types: IType[];
    translations: ITranslation[];
}