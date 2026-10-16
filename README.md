# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Menu 3D previews

Every menu item can launch camera-based AR directly from **View with camera** on supported mobile devices. The menu models are preloaded so the launch happens in the original button tap. The site must be served over HTTPS (localhost is allowed for development), and the user must grant camera access. AR-capable mobile hardware and a compatible browser are required; desktop browsers will report when AR is unavailable.

Items in the same category currently use that category's menu photo as a textured 3D card. These are camera-placeable previews, not individual 3D food models. To show each dish as a realistic 3D object, add a separate 3D model for each menu item.

To regenerate the preview models after changing category images or IDs, run:

```sh
node tools/3d-generation/generate_menu_models.js
```
