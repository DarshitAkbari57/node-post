const Tag = require('../models/tag');

const createOrUpdateTags = async (tagNames) => {
  try {
    const tagIds = await Promise.all(
      tagNames.map(async (tagName) => {
        const tag = await Tag.findOneAndUpdate(
          { name: tagName },
          { name: tagName },
          { upsert: true, new: true }
        );
        return tag._id;
      })
    );
    return tagIds;
  } catch (error) {
    throw new Error('Error processing tags: ' + error.message);
  }
};

module.exports = {
  createOrUpdateTags
};