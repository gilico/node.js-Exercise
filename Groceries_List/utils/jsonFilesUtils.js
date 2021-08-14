const fs = require('fs');
const chalk = require('chalk');

 // This function gets the data from the main module - gets it one arguments each time
function addCategory(category_name, category_items){
    // Gets an empty array or array with ocjects
    const all_categories = getAllCats(); 

    //Convert the array to string
    let items = category_items.toString();  
    
    let isSimilarCat = checkSimilarCategory(category_name,all_categories,items)

    //Only if the function returned 'false' to it's vaieble then it will set a new category
    if (!isSimilarCat) 
    {
        all_categories.push({
            Category: category_name,
            products: items
        })
    }
    //Send the update data to this function
    saveCategory(all_categories);

    console.log(chalk.green("Category added - ") + chalk.yellow(category_name + ": ") + category_items);
}

//Exports only the main function
module.exports = {
    addCategory: addCategory
}

/*
 This function try to read from JSON file
 - if it's empty it will return empty array
 - if it's not empty it return an array with objects of the lists
 */
function getAllCats(){
    try 
    {
        return JSON.parse(fs.readFileSync("./data/jsonFile.json").toString());
    } 
    catch (error)
    {
        return []
    }
}
/*
 -Boolean function that checks if the category is already in the file
 -The varieble 'listObj' contains all the file's data
 -If a category from an element is equals to the current catagory name -
  then the items will added to the same element's products,
  and the function return true to it's varieble from the main function
*/
function checkSimilarCategory(category_name,listObj, items){
    let isSame = false;
    listObj.forEach(element => {
        if (category_name === element.Category) {
            element.products += "," + items;
            isSame = true;
        }
    })
    return isSame;
}

// A function the write to a JSON file
function saveCategory(category){
    fs.writeFileSync("./data/jsonFile.json", JSON.stringify(category))
}
