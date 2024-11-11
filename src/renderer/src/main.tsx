import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom'
import HomeContainer from './containers/pages/Home/HomeContainer'
import ResultListContainer from './containers/pages/ResultList/ResultListContainer'
import SettingsContainer from './containers/pages/Settings/SettingsContainer'
import HistoryContainer from './containers/pages/History/HistoryContainer'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeContainer />}></Route>
        <Route path="resultList" element={<ResultListContainer />}></Route>
        <Route path="settings" element={<SettingsContainer />}></Route>
        <Route path="/history" element={<HistoryContainer />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
