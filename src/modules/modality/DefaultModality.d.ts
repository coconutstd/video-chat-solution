import Modality from './Modality';
export default class DefaultModality implements Modality {
    private _id;
    private static MODALITY_SEPARATOR;
    static MODALITY_CONTENT: string;
    constructor(_id: string);
    id(): string;
    base(): string;
    modality(): string;
    hasModality(modality: string): boolean;
    withModality(modality: string): Modality;
}
