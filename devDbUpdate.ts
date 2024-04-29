import {MongoClient} from "mongodb"
import { exit } from "process"

export const config = {
    local: "mongodb://127.0.0.1:27017/volumeBets",
    dev: "mongodb+srv://mondayScaries-user:fQWARBE512jFtRKo@mondayscariesserverless.elhzdmd.mongodb.net/volumeBets-dev?retryWrites=true&w=majority",
    live: "mongodb+srv://mondayScaries-user:fQWARBE512jFtRKo@mondayscariesserverless.elhzdmd.mongodb.net/volumeBets?retryWrites=true&w=majority"
}

async function connectToDb(db: string) {
    return await MongoClient.connect(db)
}

async function refreshDevDb() {
    const devDb = (await connectToDb(config.dev)).db()
    const liveDb = (await connectToDb(config.live)).db()

    const devCollections = await devDb.listCollections().toArray()
    const liveCollections = await liveDb.listCollections().toArray()
    for (const liveCollection of liveCollections) {
        console.log("-".repeat(20))
        const collectionName = liveCollection.name
        const devCollection = devCollections.find(c => c.name === collectionName)
        const liveCollectionItems = await liveDb.collection(collectionName).find().toArray()
        if (liveCollectionItems.length === 0) {
            console.log(`${collectionName} has no items in the live database. Skipping transfer...`)
            continue
        }
        if (devCollection) {
            console.log(`Dropping ${collectionName} from dev database.`)
            await devDb.collection(collectionName).drop()
        } else {
            console.log(`${collectionName} does not exist in dev database. Skipping drop...`)
        }
        console.log(`Copying ${liveCollectionItems.length} records from live collection to dev collection`)
        await devDb.collection(collectionName).insertMany(liveCollectionItems)
        console.log(`${collectionName} successfully transferred from live to dev`)
    }

}

refreshDevDb()
    .then(() => exit())
    .catch(e => console.log("Error: ", e))