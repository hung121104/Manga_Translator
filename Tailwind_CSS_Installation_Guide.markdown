# Installing Tailwind CSS v4.1 with Vite and React

This guide outlines the steps to set up Tailwind CSS v4.1 in a new React project using Vite, based on the official documentation and best practices as of July 2025. Tailwind CSS v4.1 requires Node.js 20 or higher.[](https://tailwindcss.com/blog/tailwindcss-v4)[](https://tailwindcss.com/docs/upgrade-guide)

## Prerequisites
- Node.js 20 or higher installed on your system.
- A terminal and a code editor (e.g., VS Code).

## Step 1: Create a Vite Project
1. Open your terminal and run the following command to create a new Vite project with the React template:
   ```bash
   npm create vite@latest tailwind-project -- --template react
   ```
2. When prompted, confirm the installation by typing `y` or pressing Enter.
3. Navigate to the project directory:
   ```bash
   cd tailwind-project
   ```

## Step 2: Install Tailwind CSS
1. Install Tailwind CSS and its peer dependencies:
   ```bash
   npm install -D tailwindcss
   ```
   Note: Tailwind CSS v4.1 has fewer dependencies and does not require PostCSS or Autoprefixer by default, as it leverages modern CSS features like cascade layers and automatic content detection.[](https://tailwindcss.com/blog/tailwindcss-v4)

## Step 3: Add Tailwind to Your CSS
1. Create a `src/index.css` file (or use an existing CSS file) and add the following line to import Tailwind CSS:
   ```css
   @import "tailwindcss";
   ```
   This single import replaces the `@tailwind` directives used in v3 (e.g., `@tailwind base; @tailwind components; @tailwind utilities;`).[](https://tailwindcss.com/blog/tailwindcss-v4)[](https://tailwindcss.com/docs/upgrade-guide)

2. If you need to include specific source files (e.g., for custom templates), you can use the `@source` directive in your CSS, though automatic content detection typically eliminates this need:
   ```css
   @source "./src/**/*.{html,js,jsx,ts,tsx}";
   ```

## Step 4: Configure Your Project (Optional)
Tailwind CSS v4.1 does not require a `tailwind.config.js` file by default, as it automatically detects content and uses modern CSS features. If you need custom configurations (e.g., custom colors, fonts, or breakpoints), create a `tailwind.config.js` file in the project root:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
      },
    },
  },
  plugins: [],
}
```
This step is optional, as Tailwind v4.1 works out of the box without configuration.[](https://tailwindcss.com/blog/tailwindcss-v4)

## Step 5: Run the Development Server
1. Start the Vite development server to compile your CSS and preview the project:
   ```bash
   npm run dev
   ```
2. Vite will process your CSS and generate the necessary styles. The compiled CSS is typically included automatically in Vite projects.

## Step 6: Test Tailwind in Your Project
1. Open `src/App.jsx` and add a Tailwind utility class to test the setup:
   ```jsx
   function App() {
     return (
       <div className="text-3xl font-bold text-blue-600">
         Hello, Tailwind CSS!
       </div>
     );
   }
   export default App;
   ```
2. Save the file and open your browser to the Vite development server URL (usually `http://localhost:5173`). You should see the text styled with Tailwind’s utility classes (large, bold, and blue).

## Step 7: Build for Production
1. To create an optimized production build with unused CSS removed:
   ```bash
   npm run build
   ```
2. The compiled CSS will be output to the `dist` folder, typically as `dist/assets/index-[hash].css`. Tailwind v4.1 ensures the final CSS bundle is minimal, often under 10kB.[](https://tailwindcss.com/)

## Notes
- **Browser Support**: Tailwind CSS v4.1 targets modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+). For older browsers, stick with Tailwind v3.4 or use a compatibility mode (if available in the future).[](https://tailwindcss.com/docs/upgrade-guide)
- **Upgrading from v3**: If upgrading from Tailwind v3, use the automated upgrade tool (`npx tailwindcss upgrade`) to migrate dependencies and configurations. Refer to the official upgrade guide for details.[](https://tailwindcss.com/docs/upgrade-guide)
- **Vite Plugin**: Tailwind v4.1 includes a first-party Vite plugin for optimal performance, automatically integrated when using Vite.[](https://tailwindcss.com/blog/tailwindcss-v4)
- **Troubleshooting**: If Tailwind classes don’t apply, ensure `npm run dev` is running and the CSS file is correctly linked in your HTML or imported in your JavaScript. Check the browser console for errors.[](https://thatgirl.hashnode.dev/tailwind-css-installation-guide-step-by-step)

## Additional Resources
- Official Tailwind CSS Documentation: [tailwindcss.com](https://tailwindcss.com)
- Vite Documentation: [vitejs.dev](https://vitejs.dev)