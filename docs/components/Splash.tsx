import React, { useEffect, useState } from 'react';
import './Splash.css';

type AnimationStatus = 'enter' | 'active' | 'exit' | 'prologue' | 'finish';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Splash: React.FC = () => {
  const [status, setStatus] = useState<AnimationStatus>('enter');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const runAnimation = async () => {
      // 1. Lines extend
      await sleep(50);
      setStatus('active');
      
      // 2. Wait for lines to stay extended
      await sleep(800); 

      // 3. Lines retract & SVG shows up
      setStatus('exit');
      
      // 4. Stay with SVG
      await sleep(2000);
      setStatus('finish');
      
      // 5. Final fade out component
      await sleep(800);
      setVisible(false);
    };

    runAnimation();
  }, []);

  if (!visible) return null;

  return (
    <div className={`splash-container ${status === 'finish' ? 'fade-out' : ''}`}>
      <div className="splash-banner">
        {/* Black Thin Line (Top) */}
        <div className={`banner-line ${status === 'active' ? 'active' : ''} ${status === 'exit' || status === 'finish' ? 'exit' : ''}`} />

        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 320 120" 
          className={`splash-svg-content ${status === 'exit' || status === 'finish' ? 'svg-active' : ''} ${status === 'finish' ? 'svg-exit' : ''}`}
        >
          <g transform="translate(160, 75)">
            {/* Split Motion Layers */}
            <g className={(status === 'exit' || status === 'finish') ? 'text-layer-back' : ''}>
              <text className="title-font" dx="2" dy="2">
                <tspan fill="#f9d5e7">Snow</tspan><tspan fill="#a5c9ff">Luma</tspan>
              </text>
            </g>
            
            <g className={(status === 'exit' || status === 'finish') ? 'text-layer-front' : ''}>
              <text className="title-font" dx="0" dy="0">
                <tspan fill="#a5c9ff">Snow</tspan><tspan fill="#cec1e6">Luma</tspan>
              </text>
            </g>
          </g>

          {/* Floating Stars */}
          <path className="star-fx star-top" d="M265,13 L267.8,21.1 L276,24 L267.8,26.9 L265,35 L262.2,26.9 L254,24 L262.2,21.1 Z"/>
          <path className="star-fx star-bottom" d="M45,84 L47.1,90.2 L53.5,92.2 L47.1,94.2 L45,100 L42.9,94.2 L36.5,92.2 L42.9,90.2 Z"/>
        </svg>

        {/* Black Thin Line (Bottom) */}
        <div className={`banner-line ${status === 'active' ? 'active' : ''} ${status === 'exit' || status === 'finish' ? 'exit' : ''}`} />
      </div>
    </div>
  );
};

export default Splash;
