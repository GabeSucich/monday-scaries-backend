export const ModelConstants = {
    USER: {
        modelName: "User",
        collectionName: "users"
    },
    BETTOR: {
        modelName: "Bettor",
        collectionName: "bettors"
    },
    BETTOR_GROUP: {
        modelName: "BettorGroup",
        collectionName: "bettorGroups"
    },
    SERVER_ERROR: {
        modelName: "ServerError",
        collectionName: "errors"
    },
    WAGER: {
        modelName: "Wager",
        collectionName: "wagers",
        betTypes: ["Game Total", "Money Line", "Against the Spread", "Prop", "Parlay", "Future", "Other"],
        sports: ["NFL", "NBA", "PGA", "NCAA Basketball", "NCAA Football", "NCAA Baseball", "MLB", "UFC", "Soccer", "Tennis", "Hockey", "Multi", "Other"]
    },
}