import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { diskStorage} from 'multer'

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
      })
    };
  }
}