import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BudgetProvider } from "./context/BudgetContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*se importa el context para que pueda encapsular toda la app y el state y dispatch quedan globales*/}
    <BudgetProvider>
      <App />
    </BudgetProvider>
  </StrictMode>,
)
