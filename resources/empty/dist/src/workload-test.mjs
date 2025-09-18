import { BenchmarkStep, BenchmarkSuite } from "./speedometer-utils/benchmark.mjs";
import { getAllElements, getElement } from "./speedometer-utils/helpers.mjs";

export const appName = "empty-postmessage";
export const appVersion = "1.0.0";

const suites = {
    default: new BenchmarkSuite("default", [
        new BenchmarkStep("Nop", () => {
        }),
        new BenchmarkStep("Add paragraph to body", () => {
            const body = getElement("body");
            const paragraph = document.createElement("p");
            paragraph.textContent = "This is a paragraph.";
            body.appendChild(paragraph);
        }),
    ]),
};

export default suites;
