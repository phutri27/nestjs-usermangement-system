import { TransformInterceptor } from './transform.interceptor';
import { describe, expect, it } from '@jest/globals';

 
describe('TransformInterceptor', () => {
  it('should be defined', () => {
    expect(new TransformInterceptor()).toBeDefined();
  });
});
