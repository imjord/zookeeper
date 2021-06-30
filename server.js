const express = require('express');
const app = express();
const { animals } = require('./data/animals');


app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query){
        results = filterByQuery(req.query, results);
    }
    res.json(results);
  });


app.listen(3001, () => {
    console.log('API server now on port 3001!');
})

function filterByQuery(query, animalsArray){
    let personalityTraitsArray = [];
    // note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if(query.personalityTraits){
        // save personalityTraits as a dedicated array
        // if personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string'){
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // loop through each trait in the personalityTraits array :
        personalityTraitsArray.forEach(trait => {
            // check the trait against each animal in the filteredResults array 
            // remember it is initally a copy of the animals array 
            // but here were updating it for each trait in the .forEach() loop 
            // for each trait being targeted by the filter the filteredresults array will then 
            // contain only the entries that contain the trait 
            // so at the end well have an array of animals that have every one of the
            // traits when the foreach loop is finished
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
        })
    }
    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);

    } if(query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);

    } if(query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;

}