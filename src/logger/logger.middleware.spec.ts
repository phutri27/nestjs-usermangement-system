import { LoggerMiddleware } from './logger.middleware';
import { describe, beforeEach, expect, it } from '@jest/globals';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggerMiddleware()).toBeDefined();
  });
});
