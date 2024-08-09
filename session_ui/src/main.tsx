import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Sessions } from './containers/sessions/index.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: '/:sessionId',
    element: <Sessions />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
