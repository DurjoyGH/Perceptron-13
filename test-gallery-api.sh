#!/bin/bash

# Quick test script to check gallery API
# Usage: ./test-gallery-api.sh

echo "🧪 Testing Gallery API..."
echo ""

# Check if backend is running
echo "1. Checking if backend is running on port 5000..."
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend is NOT running"
    echo "   Start it with: cd backend && npm start"
    exit 1
fi

echo ""
echo "2. Testing public schedules endpoint (no auth required)..."
RESPONSE=$(curl -s http://localhost:5000/api/tour/schedules)

if echo "$RESPONSE" | grep -q "success"; then
    echo "   ✅ API is responding"
    
    # Parse and show schedule count
    COUNT=$(echo "$RESPONSE" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    echo "   📊 Found $COUNT tour schedules"
    
    # Check for gallery images
    echo ""
    echo "3. Checking gallery images in schedules..."
    if echo "$RESPONSE" | grep -q '"gallery"'; then
        echo "   ℹ️  Gallery field exists in response"
        
        # Try to count images (rough estimate)
        IMAGE_COUNT=$(echo "$RESPONSE" | grep -o '"url":"https://res.cloudinary.com' | wc -l)
        echo "   📸 Total gallery images across all days: $IMAGE_COUNT"
        
        if [ "$IMAGE_COUNT" -eq 0 ]; then
            echo ""
            echo "   💡 No images found yet. Upload some through ManageGallery!"
        fi
    else
        echo "   ⚠️  No gallery field in response"
    fi
    
    echo ""
    echo "4. Showing schedule summary..."
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null | head -100 || echo "$RESPONSE" | jq '.' 2>/dev/null | head -100 || echo "   (Install jq or python3 for pretty output)"
    
else
    echo "   ❌ API error or unexpected response"
    echo "   Response: $RESPONSE"
    exit 1
fi

echo ""
echo "============================================"
echo "✅ API test complete!"
echo ""
echo "📝 To test upload (requires admin auth token):"
echo "   1. Login as admin in the browser"
echo "   2. Open DevTools → Application → Local Storage"
echo "   3. Copy the 'token' value"
echo "   4. Run:"
echo "      TOKEN='your_token_here'"
echo "      curl -X POST http://localhost:5000/api/tour/schedules/1/gallery \\"
echo "        -H \"Authorization: Bearer \$TOKEN\" \\"
echo "        -F \"image=@path/to/image.jpg\" \\"
echo "        -F \"caption=Test Image\""
echo "============================================"
