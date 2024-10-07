const express = require("express");
const app = express();
app.use(express.json());

let recipes = [
	{ 
		 'id': 1, 
		 'name': 'Spaghetti Bolognese', 
		 'cuisine': 'Italian', 
		 'difficulty': 'Medium' 
	},
  { 
		  'id': 2, 
		  'name': 'Chicken Tikka Masala', 
		  'cuisine': 'Indian', 
		  'difficulty': 'Hard' 
	}
];

// function to get all recipes
async function getAllRecipes(){
  return recipes;
}

// function to get recipe by Id
async function getRecipeById(id){
  return recipes.find(recipe => recipe.id === id);
}

// function to add recipe
async function addRecipe(data){
  data.id = recipes.length + 1;
  recipes.push(data);
  return data;
}

// Api to get all recipes
app.get("/recipes", async (req, res) => {
  const recipes = await getAllRecipes();
  res.json(recipes);
});

// Api to get a recipe by Id
app.get("/recipes/details/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  const recipe = await getRecipeById(id);
  if(!recipe) return res.status(404).send("Recipe not found");
  res.status(200).json(recipe);
});

app.post("/recipes/new", async (req, res) => {
  const newRecipe = await addRecipe(req.body);
  res.status(201).json(newRecipe); 
});

module.exports = {
  app,
  getAllRecipes,
  getRecipeById,
  addRecipe
};