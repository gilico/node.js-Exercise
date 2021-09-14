const gotWrapper = require('./gotWrapper'); // using got npm through this module 
const chalk = require("chalk"); // Coloring outputs

// URLs of APIs:
const mainPath = "https://datadashboardapi.health.gov.il/api/queries/";
const perCityUrl = mainPath + "contagionDataPerCityPublic";
const infectedUrl = mainPath + "infectedPerDate";
const vaccinedUrl = mainPath + "vaccinated";

// Use this variables to contain APIs data
let allCities;
let generalData;
let vaccineData

// Activate this method only one time
laodAllData();

// Async method that uses 'gotWrapper' module with the links above.
// The moethod of 'got' will return json type data to the variables below.
async function laodAllData(){
    // Do all of them together 
    try 
    {
        // Represents all the cities data.
        allCities = await gotWrapper.makeRequest(perCityUrl);
        // Represents the the sick data since the covid is in israel - use to check by date if I would like to.
        generalData = await gotWrapper.makeRequest(infectedUrl);
        // Represents the the vaccination data since the vaccine is in israel - use to check by date if I would like to.
        vaccineData = await gotWrapper.makeRequest(vaccinedUrl);
    } 
    catch (error) 
    {
        console.log(chalk.bgRed("Error occured: HTTP request to Israel covid API has failed"+ 
                                 "URL: " + url + "\n" + 
                                 "Full Error message: \n"), error);
    }
};

 /* Incase the user wants to watch data from Israeli city: 
        this function gets from the user's input the name of the city,
        and check if the 'allCities' variable got it. In case it doesn't, it return nothing,
        and notice from the main module will be shown at the output. Incase it does, the method
        will return the city name after reverse it and the city index */
function processCity(cityName){
    // This loop check if the user's input is part of a city name
    for (let index = 0; index < allCities.length; index++) {
        if (allCities[index].city.includes(cityName)) 
        {
            // After the statement is true we send to confirmation the city name 
            return [reverse(allCities[index].city), index];
        }
    }
    return ;
}

/* This method gets two variables and return two data types:
        Boolean - 'isPerCity' - if it's true - the user insert and confimed he's city choise
        Integer - 'cityIndex' - to extract the city's data by it's index from the 'processCity' method
        The first data type is data by city, using 'cityDataStr' method.
        The second data type is the update general data of Israel  */
function callIsraelApi(isPerCity, cityIndex){

    if(isPerCity)
    {
        // After the user confirmed the city's name: send as an object all the city's data
        return cityDataStr(allCities[cityIndex])    
    }
    else
    {
        // Contain the infected data of today
        let lasUpdate = generalData[generalData.length - 1];
        // Contain the infected data from yesterday
        let beforLastUpd = generalData[generalData.length - 2]    
        // Contain the vaccinated data from today
        let lasUpdateVaccine = vaccineData[vaccineData.length - 1];
        
        // Return all three data types after axtract the properties to string
        return generalDataStr(lasUpdate, beforLastUpd, lasUpdateVaccine);
    }
}

/* This method get the city data as an object
   and extract the properties we need to a string */
function cityDataStr(cityObj){
    // Revers the city name to correct order
    let cityName = reverse(cityObj.city)
    // Return all these properties as a string to 'callIsraelApi' method
    return chalk.cyanBright("\n  ---------------------------------------" +
                            "\n                  City: " + cityName + 
                            "\n             Confirmed: " + cityObj.sickCount + 
                            "\n                Active: " + cityObj.actualSick + 
                            "\n   Verifies 7 days ago: " + cityObj.verifiedLast7Days + 
                            "\n  ---------------------------------------");

}

/* This method get the latest Israel's general data in three variables
   and extract the properties we need to a string */

function generalDataStr(covid,covidYestd, vacc){
    // Return all these properties as a string to 'callIsraelApi' method
    return chalk.yellow("\n   -------------------------------------------------------------------" +
                           "\n                            Last Update: " + new Date(covid.date).toLocaleDateString() + 
                           "\n                            Sum of Sick: " + covid.sum + 
                           "\n                   New Confirmed(today): " + covid.amount + 
                           "\n              New Confirmed (yesterday): " + covidYestd.amount +
                           "\n                      Sum Of First Dose: " + vacc.vaccinated_cum + 
                           "\n      Vaccined Percentage Of Population: " + vacc.vaccinated_population_perc + "%" +
                           "\n                     Sum Of Second Dose: " + vacc.vaccinated_seconde_dose_cum + 
                           "\n                      Sum Of Third Dose: " + vacc.vaccinated_third_dose_cum +
                           "\n   ------------------------------------------------------------------");

}

// This method takes the city name and returns it at the readable order
function reverse(city){
    return city.split("").reverse().join("");
}

// Export these tow function - for city name and index and to process the data
module.exports = {
    processCity: processCity,
    callIsraelApi: callIsraelApi
}