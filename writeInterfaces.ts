import {Project} from "ts-morph"
import * as fs from "fs"
import * as path from "path"
import {ModelConstants} from "./src/models/constants"

function makeReplacements(str: string) {
    return str.replace("mongoose.Types.ObjectId", "string")
}

const auxiliaryModelNames = ["BettorDeposit", "WagerDetail", "Wager"]
const modelNamesToIgnore: string[] = []

function includeModel(modelName: string, sourceFilename: string) {
    if (sourceFilename.includes("data.ts")) {
        return true
    }
    const myModels = Object.values(ModelConstants).map(mc => mc.modelName)
    const isAuxiliary = auxiliaryModelNames.includes(modelName)
    const shouldIgnore = modelNamesToIgnore.includes(modelName)
    const isMyModel = myModels.includes(modelName)
    const isNested = myModels.some(m => `${m}Nested` === modelName)
    return isAuxiliary || !shouldIgnore && (isMyModel || isNested)
}

function writeTypeInterfaces() {
    const project = new Project()
    const sourceFile = project.addSourceFileAtPath("./src/interfaces/mongoose.gen.ts")
    const typeAliases = sourceFile.getTypeAliases()
    let str = ""
    for (const typeAlias of typeAliases) {
        if (includeModel(typeAlias.getName(), sourceFile.getFilePath())) {
            str += makeReplacements(typeAlias.getText())
            str += "\n\n"
        }  
    }
    const dataFiles = readDataFiles("./src/routes")
    for (const dataFile of dataFiles) {
        const typeAliases = project.addSourceFileAtPath(dataFile).getTypeAliases()
        for (const typeAlias of typeAliases) {
            if (includeModel(typeAlias.getName(), dataFile)) {
                str += makeReplacements(typeAlias.getText())
                str += "\n\n"
            }  
        }
    }
    fs.writeFileSync("../frontend2/src/types.ts", str)
}

function readDataFiles(rootDir: string): string[] {
    const dataFiles: string[] = [];
    function traverseDirectory(currentDir: string) {
      const files = fs.readdirSync(currentDir)
      files.forEach(file => {
        const filePath = path.join(currentDir, file)
        const stats = fs.statSync(filePath)
  
        if (stats.isDirectory()) {
          traverseDirectory(filePath);
        } else if (stats.isFile() && file === 'data.ts') {
          dataFiles.push(filePath);
        }
      })
    }
    traverseDirectory(rootDir)
    return dataFiles
}

writeTypeInterfaces()
