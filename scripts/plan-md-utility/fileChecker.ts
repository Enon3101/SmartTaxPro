// This utility was originally located at /src/utils/fileChecker.ts
// It provides helper functions for file access and directory creation.
import fs from 'fs';
import path from 'path';

export const checkFileAccess = (filePath: string): boolean => {
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error(`File does not exist: ${filePath}`);
            return false;
        }

        // Check if we can read the file
        fs.accessSync(filePath, fs.constants.R_OK);
        return true;
    } catch (err) {
        console.error(`Error accessing file: ${err}`);
        return false;
    }
};

export const ensureDirectoryExists = (filePath: string): void => {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Created directory: ${directory}`);
    }
};
