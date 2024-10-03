const express = require('express');
const { resolve } = require('path');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
let cors = require('cors');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());

let db;

(async () => {
  db = await open({
    filename: process.env.DATABASE_URL || './BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.get(query, [id]);

  return { restaurant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await fetchRestaurantsById(id);
    if (!result.restaurant) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await fetchRestaurantsByCuisine(cuisine);

    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterRestaurants(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [
    isVeg ? 'true' : 'false',
    hasOutdoorSeating ? 'true' : 'false',
    isLuxury ? 'true' : 'false',
  ]);

  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg === 'true';
  let hasOutdoorSeating = req.query.hasOutdoorSeating === 'true';
  let isLuxury = req.query.isLuxury === 'true';

  try {
    let result = await filterRestaurants(isVeg, hasOutdoorSeating, isLuxury);

    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await fetchRestaurantsByRating();

    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();

    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchDishesById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.get(query, [id]);

  return { dish: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await fetchDishesById(id);
    if (!result.dish) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterDishes(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg ? 'true' : 'false']);

  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg === 'true';
  try {
    let result = await filterDishes(isVeg);

    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchDishesByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await fetchDishesByPrice();

    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
