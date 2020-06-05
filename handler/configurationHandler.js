const fs = require('fas');

function handleConfigurations(){

    function getFullnodeConfiguration(path){
        return JSON.parse(fs.readFileSync(path));
    }

    return { getFullnodeConfiguration }
}

module.exports = handleConfigurations();