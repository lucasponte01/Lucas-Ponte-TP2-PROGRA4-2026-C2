
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    private readonly API_KEY = process.env.CLOUDINARY_API_KEY;
    private readonly API_SECRET = process.env.CLOUDINARY_API_SECRET;
    private readonly API_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

  async subirArchivo(file: Express.Multer.File): Promise<string> {
     cloudinary.config({
      api_key: this.API_KEY,
      api_secret: this.API_SECRET,
      cloud_name: this.API_CLOUD_NAME,
    });
   
    if (!file) return '';

    const base64 = file.buffer.toString('base64');
    const uri = `data:${file.mimetype};base64,${base64}`;

    const uploadStream = await cloudinary.uploader.upload(uri, {
      folder: 'red-social-tp',
      public_id: `${Date.now()}-perfil`,
    });

    return uploadStream.url; 
  }
}
