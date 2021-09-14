/*
    Covid-19 data app.
    I used several APIs to show current data from around the world and in Israel.
    The app is using three modules that process data from Israel cities or countries around the globe.
    I tried to minimize the api's calls to make the app runs faster.
*/
const readline = require('readline'); // Using the abilty to insert inputs and read outputs
const util = require("util"); // Using the ability of promisfy and bind
const chalk = require("chalk");
// usind module exported methods
const processWorldWideData = require("./modules/processWorldWideData"); 
const processIsreal = require("./modules/processIsrael");

// Add read line standart input+output 
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//  Use 'promisify' to async method with question 
const question = util.promisify(rl.question).bind(rl);

// Activate the main function
getInputFromUser();

/* The main function of the app - the app will run until the user will stop it.
    This methd goal is to show the user covid-19 data araound the world and in Israel.
    The user will choose by himself which data to show. */
async function getInputFromUser(){
    // The main loop - runs until the user choose to exit the app
    while (true) {

        // This variable keeps user's selection:
        // 0 - world wide info
        // 1 - Israel info
        let infoType;

        // Check if the user insert an answer by boolean variable
        let inputValid = false;

        // The second loop - runs until the user insert a valid char of the options
        while (!inputValid) {

            // First question: Worldwide/Israel/quit the app.
            // The user needs to input one of thies letters
            const answer1 = await question("Please select information coverage:\n" +
            "   w for Worldwide\n" + 
            "   i for Israel\n" +
            "   q to Quit\n"
            );

            // Switch the input to infoType
            switch (answer1) {
                // If the user Press w/W: "infoType" will be equal to 0 (worldwide)
                case 'w':
                case 'W':
                    console.log("Your choise: " + chalk.bgBlue("WorldWide"));
                    infoType = 0; // zero for worldwide
                    inputValid = true;
                    break;
                // If the user Press i/I: "infoType" will be equal to 1 (israel)
                case 'i':
                case 'I':
                    console.log("Your choise: " + chalk.bgBlue("Israel"));
                    infoType = 1; // one for israel
                    inputValid = true;
                    break;
                // If the user Press q/Q: the app will stop
                case 'q':
                case 'Q':
                    console.log("Goodbye");
                    process.exit(0);
                // If the user Press invalid letter - the app returns to the first question
                default:
                    console.log(chalk.bgRed("Answer is invalid, try again..."));
                    break;
            }
        }

        /* ----At this point we know which data type----  */

        // The 'CovidData' variable will contain the data from each data type 
        let finalOutputData;

        // wait the data to return from one of the methods
        if (infoType === 0) 
        {
            finalOutputData = await WorldWideFunc();
        }
        else
        {
            finalOutputData = await IsraelFunc();
        }

        // Print the data that the user wanted
        console.log(finalOutputData);

        
    } // Repeat the while loop
}

/* This method process the user's input and turn it to data output, 
    using 'processWorldWideData' module. At this method the user needs to insert
    part of a country name and confirm the country name that will return. */
async function WorldWideFunc(){
    while (true) {
        // The user needs to insert a country name (or some of it). 
       // The app will wait until the user do that
       const answer2 = await question("Enter Country name: ");
   
       // Send the user answer to check if the name is valid.
       // After the process, 'state' variable will contain an object with all the country details.
       // Using 'await' to position the data. 
       let state = await processWorldWideData.processLocation(answer2);
   
       // If nothing returned form the 'processLocation' method: back to "answer2" 
       if (state === undefined) 
       {
           console.log("No results were found. try different search.")
       }
       else
       {
           // Asking the user if the country name is he's/her's choise
           let answer3 = await question("Found: " + state.englishShortName + 
           "\nIs this OK? (press 'n' for no): ");
   
           // The user can press 'n' to try different search
           if (answer3.toLowerCase() != 'n') 
           {
               // containd the country data by send the country code to 'processWorldWideData' module
               let wwData = await processWorldWideData.callCoronaWWApi(state.alpha2Code);
   
               // Only if 'tempData is defined: return the variable
               if(wwData != undefined)
               {
                    return wwData;
               }
           }
       }
    }
}

/* This method process the user's input and turn it to data output, 
    using 'processIsreal' module. At this method the user needs to insert
    part of a Israel's city name and confirm the country name that will return.
    if the user choose to press Enter intead of city name, then the method will return
    a general information of Israel*/
async function IsraelFunc(){
    while(true){
        // The second question: the user needs to insert a city name in Hebrew.
        // If the user will press Enter: general data will appear.
        const answer2 = await question("Enter city name or press 'Enter' for general information: ");
        
        // 'answer2' will be empty if the user pressed Enter
        if(answer2 === "")
        {
            // Wait to 'callIsraelApi' method to return the relevant data from the module
            // The data will show the today's currnet and updated data of sick and vaccinated.
            return processIsreal.callIsraelApi(false);
        }
        else // If 'answer2' contains anything:
        {
            // Acitvate a method from module to return an array containing a city name and index number
            // The number is the index of the city in the array of all the cities in israel at the API
            let cityNameAndIndex = processIsreal.processCity(answer2);

            // If the user's city choise is not at the API: he will try a different search
            if(cityNameAndIndex === undefined)
            {
                console.log("No results were found. try different search.");
            }
            else // If the user's city choise is in the API's array
            {
                // // Asking the user if the city name is he's/her's choise
                let answer3 = await question("Found: " + cityNameAndIndex[0] + "\nIs this OK? (press 'n' for no): ");

                // Asking the user if the city name is he's/her's choise
                if(answer3.toLowerCase() != 'n')
                {
                    // Calling the method from the module with parameters(explanation of the parmas at the module)
                    return processIsreal.callIsraelApi(true, cityNameAndIndex[1]);
                }
            }                    
        }
    }
}