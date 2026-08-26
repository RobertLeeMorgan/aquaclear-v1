import { generate } from "./generate";
import { pruneContent } from "./content/prune";

const metadata = generate();

pruneContent(metadata);

console.log("");
console.log("\nSync complete.");