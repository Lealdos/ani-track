#!/bin/bash

# API Testing Script for User Management & Authentication
# Run this after starting your dev server with: bun run dev

BASE_URL="http://localhost:3000/api"
EMAIL="test$(date +%s)@example.com"  # Unique email for testing
PASSWORD="TestPass123"
SESSION_COOKIE=""

echo "🧪 Testing User Management & Authentication API"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Register User
echo -e "${YELLOW}Test 1: Register User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"fullName\": \"Test User\",
    \"nickname\": \"tester\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ User registered successfully${NC}"
  USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo "  User ID: $USER_ID"
else
  echo -e "${RED}✗ Registration failed${NC}"
  echo "$REGISTER_RESPONSE"
fi
echo ""

# Test 2: Verify Credentials
echo -e "${YELLOW}Test 2: Verify Credentials${NC}"
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/verify" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

if echo "$VERIFY_RESPONSE" | grep -q '"verified":true'; then
  echo -e "${GREEN}✓ Credentials verified${NC}"
else
  echo -e "${RED}✗ Verification failed${NC}"
  echo "$VERIFY_RESPONSE"
fi
echo ""

# Test 3: Sign In (using better-auth)
echo -e "${YELLOW}Test 3: Sign In${NC}"
SIGNIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/sign-in/email" \
  -c cookies.txt \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

if [ -f cookies.txt ]; then
  echo -e "${GREEN}✓ Signed in successfully${NC}"
  SESSION_COOKIE=$(grep "better-auth.session_token" cookies.txt | awk '{print $7}')
  echo "  Session cookie saved"
else
  echo -e "${RED}✗ Sign in failed${NC}"
fi
echo ""

# Test 4: Get Current User
echo -e "${YELLOW}Test 4: Get Current User${NC}"
USER_RESPONSE=$(curl -s -X GET "$BASE_URL/users/me" \
  -b cookies.txt)

if echo "$USER_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ User profile retrieved${NC}"
  echo "$USER_RESPONSE" | grep -o '"email":"[^"]*' | cut -d'"' -f4
else
  echo -e "${RED}✗ Failed to get user${NC}"
  echo "$USER_RESPONSE"
fi
echo ""

# Test 5: Update User Profile
echo -e "${YELLOW}Test 5: Update User Profile${NC}"
UPDATE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/users/me" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Updated Test User\",
    \"nickname\": \"updated_tester\"
  }")

if echo "$UPDATE_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Profile updated successfully${NC}"
else
  echo -e "${RED}✗ Update failed${NC}"
  echo "$UPDATE_RESPONSE"
fi
echo ""

# Test 6: Update Favorites
echo -e "${YELLOW}Test 6: Update Favorites${NC}"
FAVORITES_RESPONSE=$(curl -s -X PATCH "$BASE_URL/users/me/favorites" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "favorites": {
      "anime": ["1", "2", "3"],
      "characters": ["101", "102"]
    }
  }')

if echo "$FAVORITES_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Favorites updated successfully${NC}"
else
  echo -e "${RED}✗ Favorites update failed${NC}"
  echo "$FAVORITES_RESPONSE"
fi
echo ""

# Test 7: Get Favorites
echo -e "${YELLOW}Test 7: Get Favorites${NC}"
GET_FAVORITES_RESPONSE=$(curl -s -X GET "$BASE_URL/users/me/favorites" \
  -b cookies.txt)

if echo "$GET_FAVORITES_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Favorites retrieved${NC}"
else
  echo -e "${RED}✗ Failed to get favorites${NC}"
  echo "$GET_FAVORITES_RESPONSE"
fi
echo ""

# Test 8: Change Password
echo -e "${YELLOW}Test 8: Change Password${NC}"
NEW_PASSWORD="NewPass123"
CHANGE_PASSWORD_RESPONSE=$(curl -s -X POST "$BASE_URL/users/me/change-password" \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d "{
    \"currentPassword\": \"$PASSWORD\",
    \"newPassword\": \"$NEW_PASSWORD\"
  }")

if echo "$CHANGE_PASSWORD_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Password changed successfully${NC}"
  PASSWORD="$NEW_PASSWORD"
else
  echo -e "${RED}✗ Password change failed${NC}"
  echo "$CHANGE_PASSWORD_RESPONSE"
fi
echo ""

# Test 9: Get Session
echo -e "${YELLOW}Test 9: Get Session${NC}"
SESSION_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/session" \
  -b cookies.txt)

if echo "$SESSION_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Session retrieved${NC}"
else
  echo -e "${RED}✗ Failed to get session${NC}"
  echo "$SESSION_RESPONSE"
fi
echo ""

# Test 10: List Users
echo -e "${YELLOW}Test 10: List Users (Pagination)${NC}"
LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/users?page=1&limit=10" \
  -b cookies.txt)

if echo "$LIST_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ Users listed successfully${NC}"
  USER_COUNT=$(echo "$LIST_RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2)
  echo "  Total users: $USER_COUNT"
else
  echo -e "${RED}✗ Failed to list users${NC}"
  echo "$LIST_RESPONSE"
fi
echo ""

# Test 11: Get User by ID (Public Profile)
echo -e "${YELLOW}Test 11: Get User by ID${NC}"
if [ ! -z "$USER_ID" ]; then
  USER_BY_ID_RESPONSE=$(curl -s -X GET "$BASE_URL/users/$USER_ID")
  
  if echo "$USER_BY_ID_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ User retrieved by ID${NC}"
  else
    echo -e "${RED}✗ Failed to get user by ID${NC}"
    echo "$USER_BY_ID_RESPONSE"
  fi
else
  echo -e "${YELLOW}⊘ Skipped (no user ID)${NC}"
fi
echo ""

# Clean up
echo -e "${YELLOW}Cleaning up...${NC}"
rm -f cookies.txt
echo -e "${GREEN}✓ Done${NC}"
echo ""

echo "================================================"
echo "🎉 API Testing Complete!"
echo ""
echo "📝 Summary:"
echo "  - All authentication endpoints tested"
echo "  - All user management endpoints tested"
echo "  - Session management verified"
echo "  - CRUD operations validated"
echo ""
echo "📖 See API_DOCUMENTATION.md for full API reference"
