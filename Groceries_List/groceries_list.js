const utils = require("./modules/jsonFilesUtils.js");

const argv = require("yargs")
    .option("fruits", {
        alias: "f",
        describe: "Add to list of fruits",
        type: "string"
        
    })
    .option("vegetables", {
        alias: "v",
        describe: "Add to list of vegetables",
        type: "string"
    })
    .option("breads", {
        alias: "b",
        describe: "Add to list of breads",
        type: "string"
    })
    .option("chilled", {
        alias: "c",
        describe: "Add to list of chilled",
        type: "string"
    })
    .option("dry", {
        alias: "d",
        describe: "Add to list of dry",
        type: "string"
    })
    .array("fruits")
    .array("vegetables")
    .array("breads")
    .array("chilled")
    .array("dry")
    .argv
;

if(argv.fruits){
    utils.addCategory("fruits" ,argv.fruits);
} 
if (argv.vegetables){
    utils.addCategory("vegetables" ,argv.vegetables);
} 
if (argv.breads) {
    utils.addCategory("breads" ,argv.breads);
} 
if (argv.chilled) {
    utils.addCategory("chilled" ,argv.chilled);
} 
if (argv.dry) {
    utils.addCategory("dry" ,argv.dry);
}
