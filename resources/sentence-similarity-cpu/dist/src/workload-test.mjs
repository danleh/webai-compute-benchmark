import { BenchmarkStep, AsyncBenchmarkStep, AsyncBenchmarkSuite } from "./speedometer-utils/benchmark.mjs";
import { getAllElements, getElement, forceLayout } from "./speedometer-utils/helpers.mjs";
import { pipeline, dot } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

export const appName = "Sentence similarity on cpu";
export const appVersion = "1.0.0";


async function runSentenceSimilarity() {
    const SENTENCES = ["San Francisco has a unique Mediterranean climate characterized by mild, wet winters and dry, cool summers.",
                        "The city is famous for its persistent fog which keeps temperatures comfortable and often cool near the coast."]

    const output = document.getElementById('similarityOutput');

    document.getElementById('sentenceText').textContent = `"${SENTENCES}"`;

    const model = await pipeline('feature-extraction', "Alibaba-NLP/gte-base-en-v1.5", { device: "cpu", dtype: "fp16" },);

    const result = await model(SENTENCES, { pooling: 'cls', normalize: true });
    
    const [source_embeddings, ...document_embeddings ] = result.tolist();
    const similarities = document_embeddings.map(x => 100 * dot(source_embeddings, x));

    output.textContent = similarities;
}

const suites = {
    default: new AsyncBenchmarkSuite("default", [
        new AsyncBenchmarkStep("Sentence similarity between two sentences", async () => {
            forceLayout();
            await runSentenceSimilarity();
            forceLayout();   
        }),
    ], true),
};

export default suites;
