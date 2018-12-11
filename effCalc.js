const metricTypes = require('./types');
const moment = require('moment');
const groupBy = require('json-groupby')

class EfficiencyCalculator {

    constructor(dataManager) {
        this.dataManager = dataManager;
    }


    rawEff(sysId) {
        const cfmData = this.dataManager.getDataByType(sysId, metricTypes.cfm);
        const kwData = this.dataManager.getDataByType(sysId, metricTypes.kw);

        let cfmSum = 0;
        let kwSum = 0;
        for (const entry of cfmData) {
            if (this.dataManager.isValidSample(sysId, entry.timestamp)) {
                cfmSum += Number(entry.value);
            }

        }

        for (const entry of kwData) {
            if (this.dataManager.isValidSample(sysId, entry.timestamp)) {
                kwSum += Number(entry.value);
            }

        }
        return cfmSum / kwSum;
    }

    rawEff2(sysId) {
        const cfmData = this.dataManager.getDataByType(sysId, metricTypes.cfm);
        const kwData = this.dataManager.getDataByType(sysId, metricTypes.kw);

        let cfmSum = cfmData.reduce(function (sum, entry) {
            return Number(sum) + Number(entry.value);
        }, 0);

        let kwSum = kwData.reduce(function (sum, entry) {
            return Number(sum) + Number(entry.value);
        }, 0);
        return cfmSum / kwSum;
    }

    // 'YYYY-MM-DD' or 'YYYY-MM-DD HH'
    effFilter(sysId, filter) {
        let sums = {};
        const cfmData = this.dataManager.getDataByType(sysId, metricTypes.cfm);
        const kwData = this.dataManager.getDataByType(sysId, metricTypes.kw);

        for (const entry of cfmData) {
            if (this.dataManager.isValidSample(sysId, entry.timestamp)) {
                const date = moment(entry.timestamp).format(filter);
                if (!sums[date]) {
                    sums[date] = {};
                    sums[date][metricTypes.cfm] = 0;
                    sums[date][metricTypes.kw] = 0;
                }

                if (isNaN(Number(entry.value))) {
                }
                sums[date][metricTypes.cfm] += Number(entry.value);
            }
        }

        for (const entry of kwData) {
            if (this.dataManager.isValidSample(sysId, entry.timestamp)) {
                const date = moment(entry.timestamp).format(filter);
                if (!sums[date]) {
                    sums[date] = {};
                    sums[date][metricTypes.cfm] = 0;
                    sums[date][metricTypes.kw] = 0;
                }

                if (isNaN(Number(entry.value))) {
                }
                sums[date][metricTypes.kw] += Number(entry.value);
            }
        }

        for (const ts in sums) {
            let efficiency = sums[ts][metricTypes.cfm] / sums[ts][metricTypes.kw]
            if (isNaN(efficiency)) {
                efficiency = 0; // happends when both numerator and denominator are 0
            }
            sums[ts] = efficiency;
        }
        return sums;
    }


    // effFilter(sysId, filter) {
    //     let sums = {};
    //     const cfmData = this.dataManager.getDataByType(sysId, metricTypes.cfm);
    //     const kwData = this.dataManager.getDataByType(sysId, metricTypes.kw);
    // }

    effByDate(sysId) {
        let sums = {};
        const cfmData = this.dataManager.getDataByType(sysId, metricTypes.cfm);
        const kwData = this.dataManager.getDataByType(sysId, metricTypes.kw);

        let cfmgroup = groupBy(cfmData, ['tsDate'], ['value'])
        let kwgroup = groupBy(kwData, ['tsDate'], ['value'])

        for (const date in cfmgroup) {
            cfmgroup[date] = cfmgroup[date].value.reduce(function (sum, val) {
                return Number(sum) + Number(val);
            }, 0);
        }

        for (const date in kwgroup) {
            kwgroup[date] = kwgroup[date].value.reduce(function (sum, val) {
                return Number(sum) + Number(val);
            }, 0);
        }

        for (const date in kwgroup) {
            sums[date] = cfmgroup[date]/ kwgroup[date];
        }

        return sums
    }

    effByHour(sysId) {
        let sums = {};
        const cfmData = this.dataManager.getDataByType(sysId, metricTypes.cfm);
        const kwData = this.dataManager.getDataByType(sysId, metricTypes.kw);

        let cfmgroup = groupBy(cfmData, ['tsHour'], ['value'])
        let kwgroup = groupBy(kwData, ['tsHour'], ['value'])

        for (const date in cfmgroup) {
            cfmgroup[date] = cfmgroup[date].value.reduce(function (sum, val) {
                return Number(sum) + Number(val);
            }, 0);
        }

        for (const date in kwgroup) {
            kwgroup[date] = kwgroup[date].value.reduce(function (sum, val) {
                return Number(sum) + Number(val);
            }, 0);
        }

        for (const date in kwgroup) {
            sums[date] = cfmgroup[date]/ kwgroup[date];
        }

        return sums
    }
}

module.exports = EfficiencyCalculator;