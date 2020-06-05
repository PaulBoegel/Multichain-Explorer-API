const fs = require('fs');

function ConfigurationHandler(){

    function getFullnodeConfiguration(path){
        return JSON.parse(fs.readFileSync(path));
    }

    return { getFullnodeConfiguration }
}

module.exports = ConfigurationHandler;
