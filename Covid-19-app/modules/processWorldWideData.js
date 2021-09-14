const fs = require('fs'); // using fs for readFilesSync
const gotWrapper = require('./gotWrapper'); // using got npm through this module 
const chalk = require("chalk"); // Coloring outputs

// Containd all the file data - this file got all the countries by their code
const data = JSON.parse(fs.readFileSync("./data/ISO3166-1.json").toString()); 

//This method return to the main module the user's search result.
function processLocation(country){
    for (let i = 0; i < data.length; i++) {
        // This loop check if the user's input is part of a country name
        if (data[i].englishShortName.toLowerCase().includes(country)) 
        {
            // returns the object of the country to use country name and it's code.
            return data[i]; 
        }
    }
    // if the user input invalid name - nothing returns.
}

// Async function that calls 'gotWrapper' with the country code' only after the user confitmed it.
async function callCoronaWWApi(stateCode){
    // Combining the two parts of the api url.
    const ApiPath = "https://corona-api.com/countries/"; 
    let url = ApiPath + stateCode;

    try {
        // Try to make request to the api using 'got' and contain the country's covid data in variable
        let covidData = await gotWrapper.makeRequest(url);
        // This statement will be true only if there is data about the country
        if (covidData.data  != "") {
            // Send the country's covid data to string method
            return covidDataStr(covidData.data);
        }
    } catch (error) {
        console.log(chalk.bgRed("Error occured: HTTP request to WorldWide Api has failed"+ 
                                 "URL: " + url + "\n" + 
                                 "Full Error message: \n"), error);
    }
}

// Method that converts the country's properties to string
function covidDataStr(data){
    // Insert this to 'try-catch' to catch the errer if there is any property missing
    // To see this work type: at worldwide 'saba'
    try 
    {
        return chalk.greenBright(" ----------------------------------" +
                                    "\n  Current data for: " + data.name + 
                                    "\n        Population: " + data.population + 
                                    "\n         Update at: " + new Date(data.updated_at).toLocaleDateString() + 
                                    "\n   Total Confirmed: " + data.timeline[0].confirmed + 
                                    "\n     New Confirmed: " + data.timeline[0].new_confirmed + 
                                    "\n            Active: " + data.timeline[0].active + 
                                    "\n            Deaths: " + data.timeline[0].deaths +
                                    "\n        New Deaths: " + data.timeline[0].new_deaths + 
                                    "\n ----------------------------------");

    } 
    catch (error) 
    {
        console.log(chalk.red("Something went wrong, cannot process data for this country\n"+ error));
    }
}

// // Export these tow function - for country code and to process the data
module.exports = {
    processLocation: processLocation,
    callCoronaWWApi: callCoronaWWApi
}