import { BenchmarkConnector } from "speedometer-utils/benchmark.mjs";
import { AsyncBenchmarkStep, AsyncBenchmarkSuite } from "speedometer-utils/benchmark.mjs";
import { forceLayout } from "speedometer-utils/helpers.mjs";
import { pipeline, env } from '@huggingface/transformers';
/*
Paste below into dev console for manual testing:
window.addEventListener("message", (event) => console.log(event.data));
window.postMessage({ id: "empty-1.0.0", key: "benchmark-connector", type: "benchmark-suite", name: "default" }, "*");
*/

// Disable the loading of remote models from the Hugging Face Hub:
env.allowRemoteModels = false;
env.allowLocalModels = true;

// Set location of .wasm files so the CDN is not used.
env.backends.onnx.wasm.wasmPaths = '';

async function runFeatureExtraction(device) {
    const SENTENCE_1 = `San Francisco has a unique Mediterranean climate characterized by mild,
                        wet winters and dry, cool summers. The city is famous for its persistent
                        fog which keeps temperatures comfortable and often cool near the coast.`
    const output = document.getElementById('embeddingOutput');

    document.getElementById('device').textContent = device;
    document.getElementById('sentenceText').textContent = `"${SENTENCE_1}"`;

    const model = await pipeline('feature-extraction', "Xenova/UAE-Large-V1", { device, dtype: "fp32" },);

    const result = await model(SENTENCE_1, { pooling: 'mean', normalize: true });
    const embedding = Array.from(result.data);

    output.textContent = JSON.stringify(embedding.slice(0, 5) + '...', null, 2);
}

const modelConfigs = {
  'feature-extraction-cpu': {
    description: 'Feature extraction on cpu',
    run: () => { return runFeatureExtraction("wasm"); },
  },
  'feature-extraction-gpu': {
    description: 'Feature extraction on gpu',
    run: () => { return runFeatureExtraction("webgpu"); },
  },
};
const urlParams = new URLSearchParams(window.location.search);
const modelType = urlParams.get('type');
if (![modelConfigs[modelType]]) {
  throw new Error(`Invalid configuration '${modelType}.'`);
}

const appName = modelConfigs[modelType].name;
const appVersion = "1.0.0";
const run =  modelConfigs[modelType].run;

const suites = {
    default: new AsyncBenchmarkSuite("default", [
        new AsyncBenchmarkStep("Extract features in example text", async () => {
            forceLayout();
            await run();
            forceLayout();
        }),
    ], true),
};

const benchmarkConnector = new BenchmarkConnector(suites, appName, appVersion);
benchmarkConnector.connect();
