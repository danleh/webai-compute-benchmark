import { BenchmarkStep, AsyncBenchmarkStep, AsyncBenchmarkSuite } from "./speedometer-utils/benchmark.mjs";
import { getAllElements, getElement, forceLayout } from "./speedometer-utils/helpers.mjs";
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.5';

export const appName = "Speech recognition on cpu";
export const appVersion = "1.0.0";


async function runSpeechRecognition() {
    const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';

    const output = document.getElementById('speechRecognitionOutput');

    const model = await pipeline('automatic-speech-recognition', "distil-whisper/distil-large-v3", { device: "wasm" },);

    const result = await model(url);

    output.textContent = result;
}

const suites = {
    default: new AsyncBenchmarkSuite("default", [
        new AsyncBenchmarkStep("Speech recognition", async () => {
            forceLayout();
            await runSpeechRecognition();
            forceLayout();   
        }),
    ], true),
};

export default suites;
