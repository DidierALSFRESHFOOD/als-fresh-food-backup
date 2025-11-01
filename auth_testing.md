# Auth-Gated App Testing Playbook

## Step 1: Create Test User & Session

```bash
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  role: 'Admin_Directeur',
  division: 'ALS FRESH FOOD',
  region: 'IDF',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend API

```bash
# Test auth endpoint
curl -X GET "$REACT_APP_BACKEND_URL/api/auth/me" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# Test protected endpoints
curl -X GET "$REACT_APP_BACKEND_URL/api/comptes" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

curl -X POST "$REACT_APP_BACKEND_URL/api/comptes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"raison_sociale": "Test Client", "division": "ALS FRESH FOOD", "region": "IDF", "created_by": "test"}'
```

## Step 3: Browser Testing

```javascript
// Set cookie and navigate
await page.context.add_cookies([{
    "name": "session_token",
    "value": "YOUR_SESSION_TOKEN",
    "domain": "your-app.com",
    "path": "/",
    "httpOnly": true,
    "secure": true,
    "sameSite": "None"
}]);
await page.goto("https://your-app.com");
```

## Critical Fix: ID Schema

MongoDB + Pydantic ID Mapping:

```python
# Pydantic Model (uses 'id')
class User(BaseModel):
    id: str  # Pydantic field
    email: str
    name: str
    
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        fields = {"id": "_id"}  # Alias mapping

# OR using Field with alias
class User(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
```

## Checklist
- [ ] User document has id field (stored as _id in MongoDB)
- [ ] Session user_id matches user's id value exactly
- [ ] Both use string IDs (not ObjectId)
- [ ] Backend queries use correct field names
- [ ] API returns user data (not 401/404)
- [ ] Browser loads dashboard (not login page)

## Success Indicators
✅ /api/auth/me returns user data
✅ Dashboard loads without redirect
✅ CRUD operations work

## Failure Indicators
❌ "User not found" errors
❌ 401 Unauthorized responses
❌ Redirect to login page
