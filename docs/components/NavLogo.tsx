import React, { useEffect } from 'react';
import './NavLogo.css';

const NavLogo: React.FC = () => {
  useEffect(() => {
    // 动态查找 Rspress 的 Logo 容器并注入自定义内容，以保证布局不崩坏
    const logoLink = document.querySelector('.rspress-nav-left a');
    if (logoLink) {
      // 清空原有内容（即隐藏的 img）
      const container = document.createElement('div');
      container.className = 'custom-nav-logo';
      container.innerHTML = '<span class="snow">Snow</span><span class="luma">Luma</span>';
      
      // 检查是否已经注入过
      if (!logoLink.querySelector('.custom-nav-logo')) {
        logoLink.appendChild(container);
      }
    }
  }, []);

  return null; // 该组件只负责逻辑注入，不直接在渲染树中占位破坏布局
};

export default NavLogo;
