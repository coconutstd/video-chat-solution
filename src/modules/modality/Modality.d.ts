export default interface Modality {
    /**
     * The participant Id
     */
    id(): string;
    /**
     * The base of the Id
     */
    base(): string;
    /**
     * The modality of the Id
     */
    modality(): string;
    /**
     * Check whether the current Id contains the input modality
     */
    hasModality(modality: string): boolean;
    /**
     * Create a new Id using the base of the current Id and the input modality
     */
    withModality(modality: string): Modality;
}
