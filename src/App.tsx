import React, { useState } from 'react';
import { MainLayout, type Page } from './components/layout/MainLayout';
import WelcomeDoc from './pages/welcome.mdx';

function App() {
  const [activePage, setActivePage] = useState<Page>('指南');

  return (
    <MainLayout 
      activePage={activePage} 
      onNavigate={(p) => setActivePage(p)} 
      status="SnowLuma Docs" 
      onLogout={() => {}}
    >
      <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
        {activePage === '指南' && <WelcomeDoc />}
        {activePage === '配置' && <div>配置文档正在编写中...</div>}
        {activePage === '开发者' && <div>开发者文档正在编写中...</div>}
      </div>
    </MainLayout>
  );
}

export default App;
