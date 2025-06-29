
import { WebAppConfig, GeneratedProject } from '../types';

const generatePackageJson = (config: WebAppConfig): string => `{
  "name": "${config.appName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app", "react-app/jest"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  },
  "devDependencies": {
    "react-scripts": "5.0.1",
    "tailwindcss": "^3.3.3"
  }
}`;

const generateIndexHtml = (config: WebAppConfig): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-g" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <title>${config.appName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>`;

const generateGameConductor = (): string => `// src/GameConductor.js
// This is a simple AI conductor to make games feel more dynamic.
class GameConductor {
  constructor() {
    this.events = [];
    console.log("Smart AI Conductor Initialized");
  }

  logEvent(type, data = {}) {
    this.events.unshift({ type, data, timestamp: Date.now() });
    if (this.events.length > 50) {
      this.events.pop();
    }
  }

  // Example for Crash, though not used in the simplified generated component
  getCrashPoint() {
     // A more complex algorithm could go here based on past events
     return 1 + Math.random() * 10;
  }

  getBalloonPopThreshold(maxPumps) {
     // If the last few games popped early, make this one last longer.
     const recentPops = this.events.filter(e => e.type === 'balloon_pop');
     if (recentPops.length > 2) {
         return Math.floor(maxPumps / 2) + Math.floor(Math.random() * (maxPumps / 2));
     }
     return Math.floor(Math.random() * maxPumps) + 1;
  }
  
  getMineCount(baseMines) {
    const recentHits = this.events.filter(e => e.type === 'mines_hit').length;
    // If many recent hits, slightly reduce mine count for a better experience.
    if (recentHits > 3) {
      return Math.max(2, baseMines - 1);
    }
    return baseMines;
  }
}

export const conductor = new GameConductor();
`;

const generateCrashGameComponent = (useConductor: boolean): string => `// src/components/CrashGame.js
import React, { useState, useEffect, useRef } from 'react';
${useConductor ? `import { conductor } from '../GameConductor';` : ''}

const CrashGame = ({ config }) => {
    const [gameState, setGameState] = useState('betting');
    const [multiplier, setMultiplier] = useState(1.0);
    const [crashPoint, setCrashPoint] = useState(1.0);
    const frameRef = useRef();

    const gameLoop = (startTime) => {
        const elapsed = (Date.now() - startTime) / 1000;
        const currentMultiplier = Math.pow(Math.E, config.growthFactor * elapsed);

        if (currentMultiplier >= crashPoint) {
            setMultiplier(crashPoint);
            setGameState('crashed');
            setTimeout(() => setGameState('betting'), 2000);
        } else {
            setMultiplier(currentMultiplier);
            frameRef.current = requestAnimationFrame(() => gameLoop(startTime));
        }
    };

    const startGame = () => {
        setMultiplier(1.0);
        const newCrashPoint = ${useConductor ? 'conductor.getCrashPoint()' : '(1 + Math.random() * 10)'};
        setCrashPoint(newCrashPoint);
        setGameState('running');
        frameRef.current = requestAnimationFrame(() => gameLoop(Date.now()));
    };

    const cashOut = () => {
        if (gameState !== 'running') return;
        setGameState('betting');
        // In a real game, you'd handle the payout here.
        alert(\`Cashed out at \${multiplier.toFixed(2)}x!\`);
    };

    useEffect(() => {
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return (
        <div className="p-4 border rounded-lg bg-gray-800 text-white">
            <h3 className="font-bold text-lg mb-2">Crash</h3>
            <div className="h-48 bg-gray-900 rounded-md flex items-center justify-center mb-4">
                <p className={\`text-5xl font-bold \${gameState === 'crashed' ? 'text-red-500' : 'text-white'}\`}>
                    {multiplier.toFixed(2)}x
                </p>
            </div>
            {gameState === 'betting' && <button onClick={startGame} className="w-full px-4 py-2 bg-green-500 rounded">Place Bet (Stake: {config.baseStake})</button>}
            {gameState === 'running' && <button onClick={cashOut} className="w-full px-4 py-2 bg-yellow-500 rounded">Cash Out</button>}
            {gameState === 'crashed' && <button disabled className="w-full px-4 py-2 bg-red-500 rounded">Crashed!</button>}
        </div>
    );
};
export default CrashGame;`;


const generateAppJs = (config: WebAppConfig): string => {
    const gameImports = [];
    const gameComponents = [];

    if (config.games.crash) {
        gameImports.push(`import CrashGame from './components/CrashGame';`);
        gameComponents.push(`<CrashGame config={config.crashConfig} />`);
    }
    // Add other games here...

    return `import React from 'react';
${gameImports.join('\n')}

function App() {
  const config = ${JSON.stringify(config, null, 2)};

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="py-6" style={{ backgroundColor: \`\${config.primaryColor}20\` }}>
        <div className="container mx-auto px-4 text-center">
            {/* In a real app, you'd handle logoFile upload, but we'll use logoUrl for simplicity */}
            <img src={config.logoUrl} alt={\`\${config.appName} logo\`} className="w-24 h-24 rounded-full mx-auto mb-4 border-4" style={{borderColor: config.primaryColor}}/>
            <h1 className="text-4xl font-bold" style={{color: config.primaryColor}}>{config.appName}</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${gameComponents.join('\n          ')}
        </div>
      </main>
    </div>
  );
}
export default App;`;
}

const generateIndexJs = (): string => `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);`;

export const generateReactProject = (config: WebAppConfig): GeneratedProject => {
    const files = [
        { path: 'package.json', content: generatePackageJson(config) },
        { path: 'public/index.html', content: generateIndexHtml(config) },
        { path: 'src/index.js', content: generateIndexJs() },
        { path: 'src/App.js', content: generateAppJs(config) },
    ];

    if (config.games.crash) {
        files.push({ path: 'src/components/CrashGame.js', content: generateCrashGameComponent(config.gameConductor) });
    }
    // We would add other game files here similarly
    
    if (config.gameConductor) {
        files.push({ path: 'src/GameConductor.js', content: generateGameConductor() });
    }

    return {
        files,
        zipName: `${config.appName.toLowerCase().replace(/\s+/g, '-')}.zip`,
    };
};
