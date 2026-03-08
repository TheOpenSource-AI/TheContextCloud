package middleware

import (
	"net/http"
	"strings"

	"github.com/contextcloud/backend/config"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type Claims struct {
	TenantID string `json:"tenantId"`
	UserID   string `json:"userId"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// AuthMiddleware validates JWT tokens and injects tenant context.
func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization header"})
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenStr == authHeader {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		tenantID, err := uuid.Parse(claims.TenantID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid tenant ID in token"})
			return
		}

		// Inject into request context
		c.Set("tenantID", tenantID)
		c.Set("userID", claims.UserID)
		c.Set("role", claims.Role)
		c.Next()
	}
}

// DevAuthBypass is a middleware for local development that sets a default tenant.
// Remove in production.
func DevAuthBypass() gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID, _ := uuid.Parse("a0000000-0000-0000-0000-000000000001")
		c.Set("tenantID", tenantID)
		c.Set("userID", "dev-user")
		c.Set("role", "admin")
		c.Next()
	}
}

// GetTenantID extracts tenant ID from gin context (set by auth middleware).
func GetTenantID(c *gin.Context) uuid.UUID {
	val, exists := c.Get("tenantID")
	if !exists {
		return uuid.Nil
	}
	return val.(uuid.UUID)
}
