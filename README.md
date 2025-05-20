# 3D Avatar Fitting App
A simple 3D web application that allows users to upload a 3D avatar and clothing model, fit the clothing onto the avatar, and interact with the 3D scene. Built with Next.js, React, Three.js, and Material UI.

## Core functionality
- Upload 3D avatar model (.glb / .gltf)
- Upload clothing model (.glb / .gltf)
- Basic auto-fit positioning of clothing on avatar (no rigging)
- 3D scene interaction with OrbitControls (rotate, pan, zoom)
- Drag-and-drop upload
- Color picker to change garment color
- UI Panel (via MUI) to:
- Upload Avatar
- Upload Clothing
- Toggle Clothing Visibility
- Reset Scene

## 3D Scene Behavior
- Avatar is centered in the scene upon upload
- Clothing is positioned relative to the avatar
- Scene uses ambient and directional lighting
- Orbit camera supports rotation, zooming, and panning

### 🚀 Live Demo
- [3D-Avatar-Fitting-App](3d-avatar-fitting.netlify.app)



## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
