// Redis-based rate limiter for API endpoints using Upstash
import { Redis } from "@upstash/redis"

interface RateLimitResult {
  allowed: boolean
  resetTime?: number
  remaining?: number
}

class RedisRateLimiter {
  private redis: Redis
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests = 100, windowMs = 60 * 60 * 1000) {
    // Updated to 100 requests per hour for testing
    this.redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  async isAllowed(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const key = `rate_limit:${identifier}`
    const resetTime = now + this.windowMs

    try {
      const pipeline = this.redis.pipeline()
      pipeline.incr(key)
      pipeline.expire(key, Math.ceil(this.windowMs / 1000))

      const results = await pipeline.exec()
      const count = results[0] as number

      if (count <= this.maxRequests) {
        return {
          allowed: true,
          resetTime,
          remaining: this.maxRequests - count,
        }
      } else {
        return {
          allowed: false,
          resetTime,
          remaining: 0,
        }
      }
    } catch (error) {
      console.error("[x402-halloween] Redis rate limiter error:", error)
      return {
        allowed: true,
        resetTime,
        remaining: this.maxRequests - 1,
      }
    }
  }
}

// 100 requests per hour per IP (testing - increase for production once settlement verified)
export const rateLimiter = new RedisRateLimiter(100, 60 * 60 * 1000) // 100 requests per hour for testing

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  // Fallback for development
  return "unknown"
}
