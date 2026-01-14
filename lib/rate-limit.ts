/**
 * Simple in-memory rate limiter for API routes.
 * Note: In production (serverless/edge), use Redis (e.g. Upstash) for shared state.
 */

interface RateLimitConfig {
    interval: number // milliseconds
    uniqueTokenPerInterval: number // max number of unique tokens
}

const LRU = new Map<string, number[]>()

export function rateLimit(options: RateLimitConfig) {
    return {
        check: (limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = (LRU.get(token) || [0])[0]
                const currentUsage = tokenCount + 1

                if (currentUsage > limit) {
                    return reject()
                }

                // In a real implementation with LRU, we'd handle eviction
                // For this simple version, we just increment
                LRU.set(token, [currentUsage])
                resolve()
            }),
    }
}

export const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
})
