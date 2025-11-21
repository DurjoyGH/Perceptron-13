#!/usr/bin/env node

/**
 * Gallery Upload Setup Verification Script
 * 
 * This script checks if all necessary components for gallery upload
 * and display are properly configured.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Gallery Upload Setup...\n');

let hasIssues = false;

// Check 1: Backend dependencies
console.log('1️⃣  Checking backend dependencies...');
try {
  const backendPackage = require('./backend/package.json');
  const hasMulter = backendPackage.dependencies.multer || backendPackage.devDependencies.multer;
  const hasCloudinary = backendPackage.dependencies.cloudinary || backendPackage.devDependencies.cloudinary;
  
  if (hasMulter && hasCloudinary) {
    console.log('   ✅ multer and cloudinary are installed\n');
  } else {
    console.log('   ❌ Missing dependencies:');
    if (!hasMulter) console.log('      - multer');
    if (!hasCloudinary) console.log('      - cloudinary');
    console.log('   Run: cd backend && npm install multer cloudinary\n');
    hasIssues = true;
  }
} catch (err) {
  console.log('   ❌ Cannot read backend/package.json\n');
  hasIssues = true;
}

// Check 2: Cloudinary config file
console.log('2️⃣  Checking Cloudinary configuration...');
const cloudinaryConfigPath = path.join(__dirname, 'backend/configs/cloudinary.js');
if (fs.existsSync(cloudinaryConfigPath)) {
  const config = fs.readFileSync(cloudinaryConfigPath, 'utf8');
  if (config.includes('cloudinary.config') && config.includes('upload')) {
    console.log('   ✅ Cloudinary config file exists and looks correct\n');
  } else {
    console.log('   ⚠️  Cloudinary config file exists but may be incomplete\n');
  }
} else {
  console.log('   ❌ Cloudinary config file not found at backend/configs/cloudinary.js\n');
  hasIssues = true;
}

// Check 3: Environment variables
console.log('3️⃣  Checking environment variables...');
const envPath = path.join(__dirname, 'backend/.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasCloudName = envContent.includes('CLOUDINARY_CLOUD_NAME=');
  const hasApiKey = envContent.includes('CLOUDINARY_API_KEY=');
  const hasApiSecret = envContent.includes('CLOUDINARY_API_SECRET=');
  
  if (hasCloudName && hasApiKey && hasApiSecret) {
    // Check if they have values
    const cloudName = envContent.match(/CLOUDINARY_CLOUD_NAME=(.+)/)?.[1]?.trim();
    const apiKey = envContent.match(/CLOUDINARY_API_KEY=(.+)/)?.[1]?.trim();
    const apiSecret = envContent.match(/CLOUDINARY_API_SECRET=(.+)/)?.[1]?.trim();
    
    if (cloudName && apiKey && apiSecret) {
      console.log('   ✅ All Cloudinary environment variables are set');
      console.log(`      Cloud Name: ${cloudName}`);
      console.log(`      API Key: ${apiKey}\n`);
    } else {
      console.log('   ⚠️  Cloudinary variables exist but some are empty\n');
      hasIssues = true;
    }
  } else {
    console.log('   ❌ Missing Cloudinary environment variables:');
    if (!hasCloudName) console.log('      - CLOUDINARY_CLOUD_NAME');
    if (!hasApiKey) console.log('      - CLOUDINARY_API_KEY');
    if (!hasApiSecret) console.log('      - CLOUDINARY_API_SECRET');
    console.log('\n');
    hasIssues = true;
  }
} else {
  console.log('   ❌ .env file not found at backend/.env\n');
  hasIssues = true;
}

// Check 4: Tour schedule routes
console.log('4️⃣  Checking tour schedule routes...');
const routesPath = path.join(__dirname, 'backend/routes/tourScheduleRoutes.js');
if (fs.existsSync(routesPath)) {
  const routes = fs.readFileSync(routesPath, 'utf8');
  if (routes.includes("upload.single('image')") && routes.includes('/gallery')) {
    console.log('   ✅ Tour schedule routes include gallery upload endpoint\n');
  } else {
    console.log('   ⚠️  Tour schedule routes may be missing gallery endpoints\n');
  }
} else {
  console.log('   ❌ Tour schedule routes file not found\n');
  hasIssues = true;
}

// Check 5: Controller implementation
console.log('5️⃣  Checking controller implementation...');
const controllerPath = path.join(__dirname, 'backend/controllers/tourScheduleController.js');
if (fs.existsSync(controllerPath)) {
  const controller = fs.readFileSync(controllerPath, 'utf8');
  const hasAddGallery = controller.includes('addGalleryImage');
  const hasUpdateGallery = controller.includes('updateGalleryImage');
  const hasDeleteGallery = controller.includes('deleteGalleryImage');
  
  if (hasAddGallery && hasUpdateGallery && hasDeleteGallery) {
    console.log('   ✅ All gallery controller methods exist\n');
  } else {
    console.log('   ⚠️  Some gallery controller methods may be missing:');
    if (!hasAddGallery) console.log('      - addGalleryImage');
    if (!hasUpdateGallery) console.log('      - updateGalleryImage');
    if (!hasDeleteGallery) console.log('      - deleteGalleryImage');
    console.log('\n');
  }
} else {
  console.log('   ❌ Tour schedule controller file not found\n');
  hasIssues = true;
}

// Check 6: Frontend API service
console.log('6️⃣  Checking frontend API service...');
const apiServicePath = path.join(__dirname, 'frontend/src/services/tourScheduleApi.js');
if (fs.existsSync(apiServicePath)) {
  const apiService = fs.readFileSync(apiServicePath, 'utf8');
  if (apiService.includes('addGalleryImage') && apiService.includes('FormData')) {
    console.log('   ✅ Frontend API service has gallery upload function\n');
  } else {
    console.log('   ⚠️  Frontend API service may be missing gallery functions\n');
  }
} else {
  console.log('   ❌ Frontend API service file not found\n');
  hasIssues = true;
}

// Check 7: ManageGallery component
console.log('7️⃣  Checking ManageGallery component...');
const manageGalleryPath = path.join(__dirname, 'frontend/src/pages/Admin/ManageGallery.jsx');
if (fs.existsSync(manageGalleryPath)) {
  const component = fs.readFileSync(manageGalleryPath, 'utf8');
  if (component.includes('addGalleryImage') && component.includes('handleUploadImage')) {
    console.log('   ✅ ManageGallery component has upload functionality\n');
  } else {
    console.log('   ⚠️  ManageGallery component may be incomplete\n');
  }
} else {
  console.log('   ❌ ManageGallery component not found\n');
  hasIssues = true;
}

// Check 8: HomePage component
console.log('8️⃣  Checking HomePage gallery display...');
const homePagePath = path.join(__dirname, 'frontend/src/pages/Public/HomePage.jsx');
if (fs.existsSync(homePagePath)) {
  const component = fs.readFileSync(homePagePath, 'utf8');
  if (component.includes('gallery') && component.includes('tourSchedule')) {
    console.log('   ✅ HomePage component includes gallery display\n');
  } else {
    console.log('   ⚠️  HomePage component may not display gallery correctly\n');
  }
} else {
  console.log('   ❌ HomePage component not found\n');
  hasIssues = true;
}

// Summary
console.log('\n' + '='.repeat(60));
if (!hasIssues) {
  console.log('✅ All checks passed! Gallery upload should work.');
  console.log('\n📝 Next steps:');
  console.log('   1. Start backend: cd backend && npm start');
  console.log('   2. Start frontend: cd frontend && npm run dev');
  console.log('   3. Login as admin');
  console.log('   4. Go to ManageGallery and upload an image');
  console.log('   5. Check homepage to see the image in gallery');
  console.log('\n💡 Check GALLERY_DEBUG_GUIDE.md for detailed debugging');
} else {
  console.log('⚠️  Some issues were found. Please review the checks above.');
  console.log('\n📝 Fix the issues and run this script again.');
}
console.log('='.repeat(60) + '\n');
