const fs = require('fs');
const companies = [
  { name: 'TCS', color: '#0066cc' },
  { name: 'Infosys', color: '#007cc3' },
  { name: 'Reliance', color: '#003da5' },
  { name: 'Wipro', color: '#12aac8' }, 
  { name: 'HDFC', color: '#004c8f' },
  { name: 'Airtel', color: '#ed1c24' },
  { name: 'ITC', color: '#035093' },
  { name: 'SBI', color: '#2d5da7' },
  { name: 'ICICI', color: '#f7931e' },
  { name: 'HUL', color: '#1e4597' },
  { name: 'LT', color: '#0033a0' },
  { name: 'Kotak', color: '#e41e26' },
  { name: 'Axis', color: '#97144d' },
  { name: 'Adani', color: '#007236' },
  { name: 'Tata', color: '#486aad' }
];

companies.forEach(company => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">
    <rect width="200" height="100" fill="white"/>
    <text x="100" y="55" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="${company.color}">${company.name}</text>
  </svg>`;
  
  fs.writeFileSync(`${company.name.toLowerCase()}.svg`, svg);
});
