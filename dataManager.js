class DataManager {
    constructor(rawData, systems){
        this.systems = systems;
        for (const entry of rawData)
        {
            if (isNaN(Number(entry[0])) ){
                continue;
            }
            this.systems.addMetric(entry[0], entry[1], entry[2], entry[3])

        }
    }

    getDataByType(sysId, type) {
        return this.systems.getDataByType(sysId, type)
    }

    isValidSample(sysId, timestamp) {
        return this.systems.isValidSample(sysId, timestamp);
    }
}

module.exports = DataManager;