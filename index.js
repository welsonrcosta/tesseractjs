const tessrect = require('tesseract.js')
const fs = require('fs')
const path = require('path')
const os = require('os')

let worker = null

async function init() {
    worker = await tessrect.createWorker({
        langPath: path.join(__dirname, 'lang_data'),
        cachePath: os.tmpdir(),
        gzip: false,
        workerBlobURL: false
    })
    await worker.loadLanguage('deuf')
    await worker.initialize('deuf')
}


async function detect(img){
    console.time("detect")
    const result = await worker.recognize(img)
    console.timeLog("detect", result.data.text)
    console.timeEnd("detect")
}

async function main() {
    console.time("Init tesseract")
    await init()
    console.timeEnd("Init tesseract")

    if (fs.existsSync(process.argv[2])){
        const img = fs.readFileSync(process.argv[2])
        await detect(img)
    }
}

main().finally(() => worker.terminate())
