const http = require('http');
const { execSync } = require('child_process');

// Check if required packages are installed
function checkDependencies() {
    try {
        const packages = execSync('npm list --depth=0').toString();
        console.log('✓ Dependencies are installed correctly');
    } catch (error) {
        console.error('✗ Missing dependencies. Running npm install...');
        try {
            execSync('npm install');
            console.log('✓ Dependencies installed successfully');
        } catch (err) {
            console.error('✗ Failed to install dependencies:', err.message);
        }
    }
}

// Check if port 5000 is available
function checkPort() {
    const testServer = http.createServer();
    
    testServer.listen(5000, () => {
        console.log('✓ Port 5000 is available');
        testServer.close();
    });

    testServer.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error('✗ Port 5000 is already in use');
            console.log('Try running: lsof -i :5000 (on Unix) or netstat -ano | findstr :5000 (on Windows)');
        }
    });
}

console.log('=== Server Environment Check ===');
checkDependencies();
checkPort();
