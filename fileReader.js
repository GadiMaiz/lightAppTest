const fs = require('fs');
var xlsx = require('node-xlsx').default;

var XLSX = require('xlsx-extract').XLSX;


class FileReader {

    readJsonFile(path) {
        return JSON.parse(fs.readFileSync(path));
    }

    readCsvFile2(path) {
        return xlsx.parse(path);
    }

    readCsvFile(path, cb) {
        let answer = [];
        new XLSX().extract(path, { sheet_id: 1 }) // or sheet_name or sheet_nr
            .on('row', function (row) {
                answer.push(row);
            })
            .on('end', function (err) {
                cb(answer);
            });
    }
}
    
module.exports = FileReader;
