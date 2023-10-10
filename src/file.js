const fs = require('fs');

module.exports = {
    readFile,
    writeFile
};

function readFile (name) {
    try {
        let data = fs.readFileSync(name, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.log(err);
        return [];
    }
}

function writeFile (name, data) {
    try {
        fs.writeFileSync(name, JSON.stringify(data));
        return true;
    } catch (err) {
        console.log(err);
    }
}