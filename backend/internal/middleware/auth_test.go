package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/contextcloud/backend/config"
	"github.com/contextcloud/backend/internal/middleware"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"time"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestAuthMiddleware_MissingHeader(t *testing.T) {
	cfg := &config.Config{JWTSecret: "test-secret"}
	r := gin.New()
	r.Use(middleware.AuthMiddleware(cfg))
	r.GET("/test", func(c *gin.Context) { c.JSON(200, gin.H{"ok": true}) })

	req := httptest.NewRequest("GET", "/test", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("Status = %d, want %d", w.Code, http.StatusUnauthorized)
	}
}

func TestAuthMiddleware_InvalidFormat(t *testing.T) {
	cfg := &config.Config{JWTSecret: "test-secret"}
	r := gin.New()
	r.Use(middleware.AuthMiddleware(cfg))
	r.GET("/test", func(c *gin.Context) { c.JSON(200, gin.H{"ok": true}) })

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Basic invalid")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("Status = %d, want %d", w.Code, http.StatusUnauthorized)
	}
}

func TestAuthMiddleware_InvalidToken(t *testing.T) {
	cfg := &config.Config{JWTSecret: "test-secret"}
	r := gin.New()
	r.Use(middleware.AuthMiddleware(cfg))
	r.GET("/test", func(c *gin.Context) { c.JSON(200, gin.H{"ok": true}) })

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer invalid.jwt.token")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("Status = %d, want %d", w.Code, http.StatusUnauthorized)
	}
}

func TestAuthMiddleware_ValidToken(t *testing.T) {
	secret := "test-secret"
	tenantID := uuid.New()
	cfg := &config.Config{JWTSecret: secret}

	claims := &middleware.Claims{
		TenantID: tenantID.String(),
		UserID:   "user-1",
		Role:     "admin",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("Sign token: %v", err)
	}

	var capturedTenantID uuid.UUID

	r := gin.New()
	r.Use(middleware.AuthMiddleware(cfg))
	r.GET("/test", func(c *gin.Context) {
		capturedTenantID = middleware.GetTenantID(c)
		c.JSON(200, gin.H{"ok": true})
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Status = %d, want %d", w.Code, http.StatusOK)
	}
	if capturedTenantID != tenantID {
		t.Errorf("TenantID = %s, want %s", capturedTenantID, tenantID)
	}
}

func TestDevAuthBypass_SetsTenantID(t *testing.T) {
	var capturedTenantID uuid.UUID
	var capturedRole string

	r := gin.New()
	r.Use(middleware.DevAuthBypass())
	r.GET("/test", func(c *gin.Context) {
		capturedTenantID = middleware.GetTenantID(c)
		role, _ := c.Get("role")
		capturedRole = role.(string)
		c.JSON(200, gin.H{"ok": true})
	})

	req := httptest.NewRequest("GET", "/test", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Status = %d, want %d", w.Code, http.StatusOK)
	}

	expectedTenant, _ := uuid.Parse("a0000000-0000-0000-0000-000000000001")
	if capturedTenantID != expectedTenant {
		t.Errorf("TenantID = %s, want %s", capturedTenantID, expectedTenant)
	}
	if capturedRole != "admin" {
		t.Errorf("Role = %q, want %q", capturedRole, "admin")
	}
}

func TestGetTenantID_MissingContext(t *testing.T) {
	r := gin.New()
	r.GET("/test", func(c *gin.Context) {
		tenantID := middleware.GetTenantID(c)
		if tenantID != uuid.Nil {
			t.Errorf("Expected uuid.Nil, got %s", tenantID)
		}
		c.JSON(200, gin.H{"ok": true})
	})

	req := httptest.NewRequest("GET", "/test", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
}
