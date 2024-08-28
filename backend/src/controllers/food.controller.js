import { FoodModel } from '../models/foodModel.js';

// Get all foods
const getAllFoods = async (req, res) => {
  try {
    const foods = await FoodModel.find({});
    console.log("food loading");
    res.send(foods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).send('Server error');
  }
};

// Create a new food
const createFood = async (req, res) => {
  const { name, price, tags, favorite, imageUrl, origins, cookTime } = req.body;
  console.log("admin");
  try {
    const food = new FoodModel({
      name,
      price,
      tags: tags.split ? tags.split(',') : tags,
      favorite,
      imageUrl,
      origins: origins.split ? origins.split(',') : origins,
      cookTime,
    });

    await food.save();
    console.log(food);
    console.log("food saved");
    res.send(food);
  } catch (error) {
    console.error('Error creating food:', error);
    res.status(500).send('Server error');
  }
};

// Update a food item
const updateFood = async (req, res) => {
  const { id, name, price, tags, favorite, imageUrl, origins, cookTime } = req.body;

  try {
    await FoodModel.updateOne(
      { _id: id },
      {
        name,
        price,
        tags: tags.split ? tags.split(',') : tags,
        favorite,
        imageUrl,
        origins: origins.split ? origins.split(',') : origins,
        cookTime,
      }
    );
    res.send();
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(500).send('Server error');
  }
};

// Delete a food item
const deleteFood = async (req, res) => {
  const { foodId } = req.params;

  try {
    await FoodModel.deleteOne({ _id: foodId });
    res.send();
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).send('Server error');
  }
};

// Get all food tags
const getTags = async (req, res) => {
  try {
    const tags = await FoodModel.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: '$count' } },
    ]).sort({ count: -1 });

    const all = { name: 'All', count: await FoodModel.countDocuments() };
    tags.unshift(all);

    res.send(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).send('Server error');
  }
};

// Search food by name
const searchFood = async (req, res) => {
  const { searchTerm } = req.params;
  const searchRegex = new RegExp(searchTerm, 'i');

  try {
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  } catch (error) {
    console.error('Error searching food:', error);
    res.status(500).send('Server error');
  }
};

// Get food by tag
const getFoodByTag = async (req, res) => {
  const { tag } = req.params;

  try {
    const foods = await FoodModel.find({ tags: tag });
    res.send(foods);
  } catch (error) {
    console.error('Error fetching food by tag:', error);
    res.status(500).send('Server error');
  }
};

// Get food by ID
const getFoodById = async (req, res) => {
  const { foodId } = req.params;

  try {
    const food = await FoodModel.findById(foodId);
    if (!food) return res.status(404).send('Food not found');
    res.send(food);
  } catch (error) {
    console.error('Error fetching food by ID:', error);
    res.status(500).send('Server error');
  }
};

export {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood,
  getTags,
  searchFood,
  getFoodByTag,
  getFoodById
};
