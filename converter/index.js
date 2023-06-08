import csv from 'csv-parser'
import fs from "fs"
import { pipeline } from "stream/promises";
import path from "path";



export default async (fileGroup) => {
    for (const file of fileGroup) {
        let results = [];
        await pipeline(
            fs.createReadStream(file).map((chunk)=>{
                return chunk.toString()
            }),
            csv(),
            async function* (source) {
                yield "["
                let i = 0;
                for await (const chunk of source) {
                    yield i ? "," + JSON.stringify(chunk, null, 2) : JSON.stringify(chunk, null, 2)
                    i++
                }
                yield "]"
            }, 
            fs.createWriteStream(path.join('converted', path.basename(file, ".csv") + ".json"))
        )
    }
}