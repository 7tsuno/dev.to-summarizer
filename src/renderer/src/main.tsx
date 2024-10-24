import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { AiTrendTranslator } from './components/ai-trend-translator'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AiTrendTranslator />
  </React.StrictMode>
)
