package middleware

import (
	"net/http"

	"github.com/contextcloud/backend/internal/repository"
	"github.com/gin-gonic/gin"
	"time"
)

// RateLimitMiddleware enforces per-tenant rate limits using Redis.
func RateLimitMiddleware(cache *repository.RedisCache, requestsPerMinute int) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID := GetTenantID(c)
		key := "ratelimit:" + tenantID.String()

		allowed, err := cache.CheckRateLimit(c.Request.Context(), key, requestsPerMinute, time.Minute)
		if err != nil {
			// If Redis is down, fail open (allow the request)
			c.Next()
			return
		}

		if !allowed {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Rate limit exceeded",
				"code":  "RATE_LIMIT_EXCEEDED",
			})
			return
		}

		c.Next()
	}
}
