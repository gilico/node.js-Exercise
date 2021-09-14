const got = require("got");
const chulk = require("chalk");

async function makeRequest(url){
    try {
        //call got() to issue a GET request
        const body = await got(url).json(); 
        //console.log(body);
        return body;
    } catch (err) {
        console.log(chulk.bgBlue("Error occured: HTTP request has failed.\n" + 
                                 "URL: " + url + "\n" + 
                                 "Full Error message: \n"), err);

        process.exit(-1); //program exit with failure - Kills the server
    }
}

module.exports = {
    makeRequest: makeRequest
}