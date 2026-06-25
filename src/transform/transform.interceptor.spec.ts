import { TransformInterceptor } from './transform.interceptor'
import { describe, expect, it, beforeEach, jest } from '@jest/globals'
import { ExecutionContext, CallHandler } from '@nestjs/common'
import { lastValueFrom, of } from 'rxjs'

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor
  beforeEach(() => {
    interceptor = new TransformInterceptor()
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  it('should return data in form', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue({
          success: 'test message',
          statusCode: 200,
        }),
      }),
    } as unknown as ExecutionContext

    const mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    } as CallHandler

    const testResult = await lastValueFrom(
      interceptor.intercept(mockContext, mockCallHandler),
    )

    expect(testResult).toEqual({
      data: { data: 'test' },
      meta: {
        status: 'test message',
        statusCode: 200,
      },
    })
  })
})
