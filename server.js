const express = require('express');
const PORT = process.env.port || 3001;
const fs = require('fs');
const path = require('path');
const app = express();
const { animals } = require('./data/animals');
//parse incoming string or array data
app.use(express.urlencoded({ extended: true}));

// parse incoming json data
app.use(express.json());

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray){

    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(_dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    return animal;
  
}

function validateAnimal(animal){
    if(!animal.name || typeof animal.name !== 'string'){
        return false;
    } 
    if(!animal.species || typeof animal.species !== 'string'){
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false;
    }
    return true;

}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query){
        results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

  app.get('/api/animals/:id', (req,res) => {
      const result = findById(req.params.id, animals);
      if(result){
          res.json(result);
      } else {
          res.send(404);
      }
      
  })


app.post('/api/animals', (req,res) => { 

    req.body.id = animals.length.toString();

    if(!validateAnimal(req.body)) {
        res.status(400).send('the animal is not properly formatted');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
  
})

app.listen(PORT, () => {
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