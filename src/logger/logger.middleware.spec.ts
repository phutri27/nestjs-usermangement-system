import { LoggerMiddleware } from './logger.middleware';
import { describe, expect, it } from '@jest/globals';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggerMiddleware()).toBeDefined();
  });
});
