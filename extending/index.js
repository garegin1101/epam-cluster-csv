import fs from "fs/promises";
import cluster from "cluster";
import { availableParallelism } from "os";
import path from "path";

export default async (dirname) => {
    let start = Date.now()


    const cpus = availableParallelism();

    let files = [];

    try {

        (await fs.readdir(dirname, { withFileTypes: true }))
            .forEach((file) => {
                if (!file.isDirectory()) if (path.extname(file.name) === ".csv") files.push(file.name)
            })

        if(files.length == 0) console.log("There is no csv file in this directory") 
            
        let arr = Array.from({ length: cpus }, () => [])

        let i = 0;
        for (const file of files) {
            if (i >= cpus) i = 0
            arr[i].push(file)
            i++
        }

        arr = arr.filter(val => val.length)

        let j = 1;
        for (const fileGroup of arr) {
            cluster.fork({ fileGroup })
            .on("disconnect", ()=> console.log(`cluster ${j++} : duration ${Date.now() - start} milisecond`))

        }


    } catch (err) {

        console.log(err.message);

    }
}