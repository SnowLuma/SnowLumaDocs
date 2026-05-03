import React, { useState } from 'react';
import { MainLayout, type Page } from './components/layout/MainLayout';
import WelcomeDoc from './pages/welcome.mdx';
import ConfigDoc from './pages/config.mdx';
import DeveloperDoc from './pages/developer.mdx';

function App() {
  const [activePage, setActivePage] = useState<Page>('指南');

  return (
    <MainLayout 
      activePage={activePage} 
      onNavigate={(p) => setActivePage(p)} 
      status="SnowLuma Docs" 
      onLogout={() => {}}
    >
      <div className="prose max-w-none">
        {activePage === '指南' && <WelcomeDoc />}
        {activePage === '配置' && <ConfigDoc />}
        {activePage === '开发者' && <DeveloperDoc />}
      </div>
    </MainLayout>
  );
}

export default App;
