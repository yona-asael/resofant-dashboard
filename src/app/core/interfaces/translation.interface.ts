import { IBase } from "./base.interface";

export interface ITranslation extends IBase {
    text: string,
    lang: string,
    type: string,
}