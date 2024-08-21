import { FoodModel } from '../models/foodModel.js';
import { BAD_REQUEST } from '../constants/httpStatus.js';

export const getAllFoods = async (req, res) => {
  const foods = await FoodModel.find({});
  res.send(foods);
};

export const createFood = async (req, res) => {
  const { name, price, tags, favorite, imageUrl, origins, cookTime } = req.body;

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
  res.send(food);
};

export const updateFood = async (req, res) => {
  const { id, name, price, tags, favorite, imageUrl, origins, cookTime } = req.body;

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
};

export const deleteFood = async (req, res) => {
  const { foodId } = req.params;
  await FoodModel.deleteOne({ _id: foodId });
  res.send();
};

export const getTags = async (req, res) => {
  const tags = await FoodModel.aggregate([
    {
      $unwind: '$tags',
    },
    {
      $group: {
        _id: '$tags',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        count: '$count',
      },
    },
  ]).sort({ count: -1 });

  const all = {
    name: 'All',
    count: await FoodModel.countDocuments(),
  };

  tags.unshift(all);

  res.send(tags);
};

export const searchFoods = async (req, res) => {
  const { searchTerm } = req.params;
  const searchRegex = new RegExp(searchTerm, 'i');

  const foods = await FoodModel.find({ name: { $regex: searchRegex } });
  res.send(foods);
};

export const getFoodsByTag = async (req, res) => {
  const { tag } = req.params;
  const foods = await FoodModel.find({ tags: tag });
  res.send(foods);
};

export const getFoodById = async (req, res) => {
  const { foodId } = req.params;
  const food = await FoodModel.findById(foodId);
  res.send(food);
};
