import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { ResultList } from './pages/ResultList'
import { Settings } from './pages/Settings'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="resultList" element={<ResultList />}></Route>
        <Route path="settings" element={<Settings />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
