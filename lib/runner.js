const projectDir = process.cwd();
const path = require('path');
const jsonfile = require('jsonfile');
const Loader = require("./loader");
const Zipper = require("./zipper");
const Shell = require("./shell");
const defaultJson = path.resolve(__dirname + "/../store/dn.json");

const Runner = (function(args){
    const [_, o, command ] = args
    const isDefaultCmd = !command;
    const availableCommands = ['init']
    
    const Commands = {
        init: () => {
            jsonfile.readFile(defaultJson, function(err, content){
                if (err) throw err;
                jsonfile.writeFile(`${projectDir}/deploy-now.json`, content, { spaces: 2, EOL: '\r\n' }, (err) => {
                    if (err) throw err;
                    console.log("[DEPLOY-NOW] Initialization Complete!");
                });
            })
        }
    };

    const Deploy = async () => {
        Loader.Init();
        try {
            let config = await Loader.Config();
            var zipped = await Zipper(config).Archive();
            config = { ...config, zipped }
            Shell(config).Start();
        } catch (error) {
            console.error("[DEPLOY-NOW] ERROR: "+ error)
        }
    };

    const Start = () => {
        if (isDefaultCmd) return Deploy();
        if (availableCommands.includes(command) && Commands[command]) return Commands[command]();
        return console.error(`Invalid command. Availale commands are (${availableCommands.join(', ')})`)
    };

    return {
        Start
    }
});

module.exports = Runner;

