import cluster from "cluster";
import converter from "./converter/index.js";
import extending from "./extending/index.js";

const dirname = process.argv[2];

// Validate command-line argument
if (!dirname) {
  throw Error('Dirname is missing');
}


if (cluster.isPrimary) {

   await extending(dirname)
 
} else if (cluster.isWorker) {

    const fileGroup = process.env.fileGroup.split(",");

    await converter(fileGroup)

    process.disconnect()
}

