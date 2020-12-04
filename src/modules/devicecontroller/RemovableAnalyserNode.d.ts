/**
 * An `AnalyserNode` that knows how to remove the inputs with which it was
 * created. This allows us to safely clean up in Safari, which has issues
 * if an analyzer is left hanging around.
 */
export default interface RemovableAnalyserNode extends AnalyserNode {
    removeOriginalInputs(): void;
}
