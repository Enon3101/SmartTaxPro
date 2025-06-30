# SmartTaxPro

A modern web application for tax filing and management, built with React and TypeScript.

## Features

- User-friendly interface for tax filing
- ITR (Income Tax Return) filing support
- Tax calculation and management
- Secure document handling
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Custom components with TailwindCSS
- **Form Handling**: React Hook Form
- **State Management**: React Query
- **Rich Text Editor**: Tiptap
- **Payment Processing**: Stripe

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Enon3101/SmartTaxPro.git
   cd SmartTaxPro
   ```

2. Install dependencies:
   ```bash
   cd client
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
SmartTaxPro/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Application entry point
│   └── ...
└── README.md               # Project documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
