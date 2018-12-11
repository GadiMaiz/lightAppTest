const metricTypes = require('./types');
const moment = require('moment');
const filters = require('./filters')


class Systems {
    constructor(systemsConfiguration) {
        this.systemDic = {};
        this.systemData = {};
        this.invalidSamplesTimeStamps = {};

        for (const sysId in systemsConfiguration) {
            this.systemData[sysId] = {};
            this.invalidSamplesTimeStamps[sysId] = {};
            for (const metricId of systemsConfiguration[sysId]) {
                this.systemDic[metricId] = sysId;
            }
        }
    }

    addMetric(metricId, timestamp, metricType, value) {
        const sysId = this.systemDic[metricId];
        const metricTypeEnum = metricTypes[metricType];
        if (!this.systemData[sysId][metricTypeEnum]) {
            this.systemData[sysId][metricTypeEnum] = [];
        }
        if (Number(value) === 0 && value !== '0' ){
            this.invalidSamplesTimeStamps[sysId][timestamp] = true; // if one of the parameters is invalid, then the whole sample of the current timestamp is invalid
        }
        const tsDate =  moment(timestamp).format(filters.dateFilter); //were added for group by, at the naive implementation they werent needed
        const tsHour =  moment(timestamp).format(filters.hourFilter); 
        this.systemData[sysId][metricTypeEnum].push({ metricId: metricId, timestamp: timestamp, value: value, tsDate : tsDate, tsHour: tsHour  });
    }

    isValidSample(sysId, timestamp) {
        return !this.invalidSamplesTimeStamps[sysId][timestamp]
    }

    getDataByType(sysId, type) { 

        return this.systemData[sysId][type];
    }

}


module.exports = Systems;