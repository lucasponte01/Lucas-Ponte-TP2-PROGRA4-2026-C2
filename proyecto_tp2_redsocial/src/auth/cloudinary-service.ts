
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    private readonly APY_KEY = process.env.CLOUDINARY_APY_KEY || '';
    private readonly APY_SECRET = process.env.CLOUDINARY_APY_SECRET || '';
    private readonly APY_CLOUD_NAME = process.env.CLOUDINARY_APY_CLOUD_NAME || '';

  async subirArchivo(file: Express.Multer.File): Promise<string> {
     cloudinary.config({
      api_key: this.APY_KEY,
      api_secret: this.APY_SECRET,
      cloud_name: this.APY_CLOUD_NAME,
    });
    cloudinary.api.ping().then(console.log).catch(console.log);
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
