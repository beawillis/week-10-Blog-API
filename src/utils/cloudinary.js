const cloudinary = require('../config/cloudinary');
const config = require('../config/env');

const uploadImage = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: config.cloudinary.folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });

const deleteImage = (publicId) => {
  if (!publicId) {
    return Promise.resolve();
  }

  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

module.exports = {
  uploadImage,
  deleteImage,
};