const Post = require('../models/post');
const Tag = require('../models/tag');
const { createOrUpdateTags } = require('./tagController');

const validateBase64Image = (base64String) => {
  const base64Regex = /^data:image\/(png|jpg|jpeg|gif);base64,/;
  if (!base64Regex.test(base64String)) {
    throw new Error('Invalid image format. Must be base64 encoded image.');
  }
};

const getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      keyword,
      tag
    } = req.query;

    // Validate query parameters
    const allowedParams = ['page', 'limit', 'sortBy', 'sortOrder', 'keyword', 'tag'];
    const receivedParams = Object.keys(req.query);
    const invalidParams = receivedParams.filter(param => !allowedParams.includes(param));

    if (invalidParams.length > 0) {
      return res.status(400).json({
        error: `Invalid parameters: ${invalidParams.join(', ')}`
      });
    }

    // Build query
    let query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (tag) {
      const tagDoc = await Tag.findOne({ name: tag });
      if (tagDoc) {
        query.tags = tagDoc._id;
      }
    }

    // Execute query with pagination and sorting
    const posts = await Post.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('tags');

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, description, image, tags } = req.body;

    // Validate image
    validateBase64Image(image);

    // Process tags
    const tagArray = Array.isArray(tags) ? tags : JSON.parse(tags);
    const tagIds = await createOrUpdateTags(tagArray);

    // Create post
    const post = new Post({
      title,
      description,
      image,
      tags: tagIds
    });

    await post.save();
    await post.populate('tags');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPosts,
  createPost
};