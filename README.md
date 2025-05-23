# PNG, AVIF & JPEG to WebP Converter

A modern, fast, and user-friendly web application that converts PNG, AVIF, and JPEG images to WebP format with adjustable quality settings. Built with React, TypeScript, Vite, and Tailwind CSS for optimal performance and beautiful design.

![PNG to WebP Converter](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎯 Core Functionality
- **Multi-File Upload**: Drag and drop or select multiple PNG, AVIF, and JPEG files at once
- **Real-Time Preview**: See thumbnails of your selected images before conversion
- **Quality Control**: Adjustable quality slider (10-100%) for optimal file size vs quality balance
- **Batch Processing**: Convert multiple images simultaneously with the same quality settings
- **Compression Analysis**: Real-time display of compression ratios and file size savings

### 📦 Download Options
- **Individual Downloads**: Download each converted WebP file separately
- **Bulk Download**: Download all converted files at once
- **ZIP Archive**: Package all converted images into a single ZIP file for easy sharing

### 🎨 User Experience
- **Modern UI**: Beautiful gradient backgrounds and clean card-based layout
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Progress Indicators**: Clear loading states and conversion progress
- **Error Handling**: Helpful error messages and validation

### 🔧 Technical Features
- **Client-Side Processing**: All conversions happen in your browser - no server required
- **Memory Efficient**: Proper cleanup and memory management
- **Type Safe**: Built with TypeScript for reliability and maintainability
- **Fast Performance**: Optimized with Vite for lightning-fast development and builds

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd converter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to use the application

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📖 How to Use

1. **Upload Images**
   - Drag and drop PNG, AVIF, or JPEG files onto the upload area, or
   - Click "Choose Files" to select PNG, AVIF, or JPEG files from your computer
   - Multiple files can be selected at once

2. **Adjust Quality**
   - Use the quality slider to set your desired compression level
   - Lower values = smaller file sizes
   - Higher values = better image quality

3. **Convert Images**
   - Click "Convert X Images to WebP" to start the batch conversion
   - Watch the progress as each image is processed

4. **Download Results**
   - View before/after comparisons with compression statistics
   - Download individual files or use "Download All" for separate files
   - Use "Download ZIP" to get all files in a single archive

## 🛠️ Tech Stack

### Frontend Framework
- **React 19** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework for rapid styling
- **Custom CSS** - Enhanced slider styles and animations

### File Processing
- **HTML5 Canvas API** - For image processing and WebP conversion
- **JSZip** - Client-side ZIP file creation
- **File API** - Modern browser file handling

### Development Tools
- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS processing and optimization

## 📂 Project Structure

```
converter/
├── public/                 # Static assets
├── src/
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   ├── index.css          # Global styles and Tailwind imports
│   └── vite-env.d.ts      # Vite type definitions
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## 🏗️ Architecture & Code Structure

The application follows modern React best practices with a clean, modular architecture:

### 📁 Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── Header/          # Application header
│   ├── FileUpload/      # Drag & drop file upload zone
│   ├── FilePreview/     # File preview grid
│   ├── QualityControl/  # Quality slider and convert button
│   ├── ConversionResults/ # Results display and download
│   ├── ErrorDisplay/    # Error message component
│   └── Footer/          # Application footer
├── hooks/               # Custom React hooks
│   ├── useFileManagement.ts  # File state management
│   └── useDragAndDrop.ts     # Drag & drop functionality
├── services/            # Business logic services
│   ├── conversionService.ts  # Image conversion logic
│   └── downloadService.ts    # File download utilities
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx             # Main application component
```

### 🎯 Key Design Principles
- **Component Separation**: Each UI section is its own reusable component
- **Custom Hooks**: Business logic extracted into reusable hooks
- **Service Layer**: Core functionality separated from UI components
- **Type Safety**: Full TypeScript implementation with proper type imports
- **Single Responsibility**: Each module has one clear purpose
- **Clean Architecture**: Dependencies flow inward, UI depends on services

## 🎨 Design Philosophy

This application follows modern web development best practices:

- **Component-Based Architecture**: Clean, reusable React components
- **Type Safety**: Full TypeScript implementation for reliability
- **Utility-First CSS**: Tailwind CSS for consistent and maintainable styling
- **Performance Optimized**: Client-side processing for privacy and speed
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Mobile-First**: Responsive design that works on all devices

## 🔒 Privacy & Security

- **No Server Required**: All image processing happens in your browser
- **No Data Upload**: Your images never leave your device
- **No Tracking**: No analytics or user data collection
- **Offline Capable**: Works without internet connection after initial load

## 🌟 Browser Support

This application works on all modern browsers that support:
- HTML5 Canvas API
- File API
- ES6+ JavaScript features
- CSS Grid and Flexbox

**Recommended browsers:**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **WebP Format**: Developed by Google for efficient web images
- **React Team**: For the amazing React framework
- **Vite Team**: For the lightning-fast build tool
- **Tailwind CSS**: For the utility-first CSS framework

---

**Built with ❤️ using modern web technologies**
  },
})
