const express = require('express')
const app = express()
const port = 3000

const FileReader = require('./fileReader');
const DataManager = require('./dataManager');
const Systems = require('./systems');
const EfficiencyCalculator = require('./effCalc');
const filters = require('./filters');



const fileReader = new FileReader();
const config = fileReader.readJsonFile('./config.json');

var effCalc = null;

fileReader.readCsvFile(config.dataFile, (rawData) => {
    const systems = new Systems(config.systemMetrices);
    const dataManager = new DataManager(rawData, systems);
    effCalc = new EfficiencyCalculator(dataManager);
    
    effCalc.effByDate('A')
    app.listen(port, () => console.log(`app listening on port ${port}!`))
});





app.get('/rawEfficiency/:sysId', (req, res) => {
    res.json(effCalc.rawEff(req.params.sysId))
});

app.get('/rawEfficiency2/:sysId', (req, res) => {
    res.json(effCalc.rawEff2(req.params.sysId))
});

app.get('/efficiencyByDate/:sysId', (req, res) => {
    res.json(effCalc.effFilter(req.params.sysId,  filters.dateFilter));
});

app.get('/efficiencyByHour/:sysId', (req, res) => {
    res.json(effCalc.effFilter(req.params.sysId,  filters.hourFilter));
});

app.get('/efficiencyByDate2/:sysId', (req, res) => {
    res.json(effCalc.effByDate(req.params.sysId,  filters.dateFilter));
});

app.get('/efficiencyByHour2/:sysId', (req, res) => {
    res.json(effCalc.effByHour(req.params.sysId));
});