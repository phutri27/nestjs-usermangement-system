import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler'

export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  createThrottlerOptions():
    | Promise<ThrottlerModuleOptions>
    | ThrottlerModuleOptions {
    return {
      throttlers: [
        {
          ttl: 300,
          limit: 10,
        },
      ],
    }
  }
}
