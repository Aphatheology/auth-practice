import config from '../config/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export default cloudinary;
