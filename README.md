# ClipEdit AI

ClipEdit AI is a powerful, multi-row image transformation tool powered by Gemini AI. It allows you to paste images, describe the changes you want, and generate new versions in parallel.

## Features

- **Multi-Row Workflow**: Process up to 10 images simultaneously.
- **Direct Paste**: Focus a row and press `Ctrl+V` to paste an image from your clipboard.
- **AI-Powered Transformations**: Uses `gemini-2.5-flash-image` for high-quality image-to-image editing.
- **Click-to-Copy**: Instantly copy generated results back to your clipboard with a single click.
- **Parallel Processing**: Each row operates independently with its own loading state and error handling.
- **Responsive Design**: Clean, dark-themed brutalist UI that works on all screen sizes.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- A Google Gemini API Key

## Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd clipedit-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   *Note: You can get an API key from the [Google AI Studio](https://aistudio.google.com/).*

## Running the App

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## How to Use

1. **Set Row Count**: Use the "Rows" input at the top to add or remove processing slots.
2. **Focus a Row**: Click anywhere on a row to make it active (highlighted in orange).
3. **Paste Image**: Press `Ctrl+V` to paste the image you want to transform.
4. **Enter Prompt**: Describe the transformation (e.g., "Make it look like a 1950s oil painting").
5. **Process**: Click "Process Row" to start the generation.
6. **Copy Result**: Once generated, click the result image to copy it to your clipboard.

## Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Motion (framer-motion)
- **AI SDK**: @google/genai
