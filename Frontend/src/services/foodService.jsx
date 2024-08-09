import axios from 'axios';

// Get all foods
export const getAll = async () => {
  try {
    const { data } = await axios.get('/api/foods');
    return data;
  } catch (error) {
    console.error('Error fetching all foods:', error);
    throw new Error('Failed to fetch foods. Please try again later.');
  }
};

// Search foods by term
export const search = async (searchTerm) => {
  try {
    const { data } = await axios.get(`/api/foods/search/${encodeURIComponent(searchTerm)}`);
    return data;
  } catch (error) {
    console.error('Error searching foods:', error);
    throw new Error('Failed to search foods. Please try again later.');
  }
};

// Get all tags
export const getAllTags = async () => {
  try {
    const { data } = await axios.get('/api/foods/tags');
    return data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags. Please try again later.');
  }
};

// Get all foods by tag
export const getAllByTag = async (tag) => {
  try {
    if (tag === 'All') return getAll();
    const { data } = await axios.get(`/api/foods/tag/${encodeURIComponent(tag)}`);
    return data;
  } catch (error) {
    console.error('Error fetching foods by tag:', error);
    throw new Error('Failed to fetch foods by tag. Please try again later.');
  }
};

// Get food by ID
export const getById = async (foodId) => {
  try {
    const { data } = await axios.get(`/api/foods/${foodId}`);
    return data;
  } catch (error) {
    console.error('Error fetching food by ID:', error);
    throw new Error('Failed to fetch food details. Please try again later.');
  }
};

// Delete food by ID
export const deleteById = async (foodId) => {
  try {
    await axios.delete(`/api/foods/${foodId}`);
  } catch (error) {
    console.error('Error deleting food by ID:', error);
    throw new Error('Failed to delete food. Please try again later.');
  }
};

// Update food
export const update = async (food) => {
  try {
    await axios.put('/api/foods', food);
  } catch (error) {
    console.error('Error updating food:', error);
    throw new Error('Failed to update food. Please try again later.');
  }
};

// Add new food
export const add = async (food) => {
  try {
    const { data } = await axios.post('/api/foods', food);
    return data;
  } catch (error) {
    console.error('Error adding new food:', error);
    throw new Error('Failed to add new food. Please try again later.');
  }
};
