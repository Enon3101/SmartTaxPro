// This utility was originally located at /src/index.ts
// It checks for the existence and accessibility of plan.md in the project root.
import path from 'path';

import { checkFileAccess, ensureDirectoryExists } from './utils/fileChecker';

const filePath = path.join(__dirname, '..', '..', 'plan.md'); // Adjusted path for new location

// Ensure the directory exists
ensureDirectoryExists(filePath);

// Check if file is accessible
if (!checkFileAccess(filePath)) {
    console.error('Unable to access the plan.md file. Creating it now...');
    // Add code here to create the file if needed
} else {
    console.log('File is accessible and ready to use');
}
