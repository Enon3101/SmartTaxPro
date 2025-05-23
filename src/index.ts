import { checkFileAccess, ensureDirectoryExists } from './utils/fileChecker';
import path from 'path';

const filePath = path.join(__dirname, '..', 'plan.md');

// Ensure the directory exists
ensureDirectoryExists(filePath);

// Check if file is accessible
if (!checkFileAccess(filePath)) {
    console.error('Unable to access the plan.md file. Creating it now...');
    // Add code here to create the file if needed
} else {
    console.log('File is accessible and ready to use');
}
