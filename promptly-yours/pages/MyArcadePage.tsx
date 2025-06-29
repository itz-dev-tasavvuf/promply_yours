
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { FirebaseUser, WebAppConfig, MiniGameType, DeploymentStep } from '../types';
import { getArcadeConfig } from '../services/configService';
import { Icon } from '../components/Icons';
import Button from '../components/Button';
import { generateReactProject } from '../services/projectGenerator'; 

// --- GAME COMPONENTS ---

const CrashGame: React.FC<{ config: WebAppConfig['crashConfig'], primaryColor: string, conductor?: any }> = ({ config, primaryColor, conductor }) => {
    type GameState = 'betting' | 'starting' | 'running' | 'crashed';
    
    const [gameState, setGameState] = useState<GameState>('betting');
    const [betAmount, setBetAmount] = useState(config.baseStake);
    const [autoCashout, setAutoCashout] = useState(2.0);
    const [multiplier, setMultiplier] = useState(1.0);
    const [crashPoint, setCrashPoint] = useState(1.0);
    const [countdown, setCountdown] = useState(5);
    const [history, setHistory] = useState<number[]>([1.23, 4.56, 2.01, 1.00, 8.90, 3.14, 1.59, 2.65]);
    const [hasCashedOut, setHasCashedOut] = useState(false);
    const [payout, setPayout] = useState(0);

    const startTimeRef = useRef<number | null>(null);
    const frameRef = useRef<number | null>(null);
    const graphPointsRef = useRef<{x: number, y: number}[]>([]);

    // Game Loop
    const gameLoop = (timestamp: number) => {
        if (!startTimeRef.current) {
            startTimeRef.current = timestamp;
        }

        const elapsed = (timestamp - startTimeRef.current) / 1000; // in seconds
        const currentMultiplier = Math.pow(Math.E, config.growthFactor * elapsed);
        setMultiplier(currentMultiplier);

        const graphTime = Math.min(elapsed, 10);
        graphPointsRef.current.push({ x: graphTime, y: currentMultiplier });

        if (!hasCashedOut && autoCashout > 1 && currentMultiplier >= autoCashout) {
            cashOut();
        }

        if (currentMultiplier >= crashPoint) {
            setGameState('crashed');
            setHistory(h => [parseFloat(crashPoint.toFixed(2)), ...h.slice(0, 14)]);
            setTimeout(resetForNextRound, 3000);
        } else {
            frameRef.current = requestAnimationFrame(gameLoop);
        }
    };

    // Game State Transitions
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (gameState === 'starting') {
            timer = setInterval(() => {
                setCountdown(c => {
                    if (c <= 1) {
                        clearInterval(timer);
                        startGame();
                        return 0;
                    }
                    return c - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'running') {
            frameRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [gameState, crashPoint, hasCashedOut]);

    const placeBet = () => {
        setGameState('starting');
        setCountdown(5);
    };

    const startGame = () => {
        // Reset per-round state
        setHasCashedOut(false);
        setPayout(0);
        setMultiplier(1.0);
        graphPointsRef.current = [];
        startTimeRef.current = null;
        
        // Determine crash point (simple logic, conductor could enhance this)
        const newCrashPoint = 1 + Math.random() * 10; // Crash between 1x and 11x
        setCrashPoint(newCrashPoint);
        setGameState('running');
    };

    const cashOut = () => {
        if (hasCashedOut || gameState !== 'running') return;
        setHasCashedOut(true);
        setPayout(betAmount * multiplier);
    };

    const resetForNextRound = () => {
        setGameState('betting');
        setMultiplier(1.0);
    };
    
    const getButton = () => {
        switch(gameState) {
            case 'betting':
                return <Button onClick={placeBet} className="w-full" style={{backgroundColor: primaryColor}}>Place Bet</Button>;
            case 'starting':
                return <Button disabled className="w-full">Starting in {countdown}s...</Button>;
            case 'running':
                if (hasCashedOut) {
                    return <Button disabled variant="secondary" className="w-full">Cashed Out @ {payout.toFixed(2)}</Button>
                }
                return <Button onClick={cashOut} variant="secondary" className="w-full">Cash Out @ {multiplier.toFixed(2)}x</Button>;
            case 'crashed':
                return <Button onClick={placeBet} className="w-full" style={{backgroundColor: primaryColor}}>Place Bet for Next Round</Button>;
        }
    }

    const multiplierColor = useMemo(() => {
        if (gameState === 'crashed') return 'text-red-500';
        if (hasCashedOut) return 'text-green-400';
        return 'dark:text-white text-neutral-800';
    }, [gameState, hasCashedOut]);
    
    // SVG Graph rendering
    const viewBox = { width: 500, height: 250 };
    const maxTime = 10; // seconds
    const maxMultiplierY = 10;
    
    const linePath = useMemo(() => {
        if (graphPointsRef.current.length < 2) return `M 0 ${viewBox.height}`;
        return "M " + graphPointsRef.current.map(p => {
            const x = (p.x / maxTime) * viewBox.width;
            const y = viewBox.height - ((Math.min(p.y, maxMultiplierY) - 1) / (maxMultiplierY - 1)) * viewBox.height;
            return `${x.toFixed(2)} ${y.toFixed(2)}`;
        }).join(" L ");
    }, [multiplier]);

    const areaPath = linePath + ` L ${ (graphPointsRef.current[graphPointsRef.current.length - 1]?.x / maxTime) * viewBox.width || 0 } ${viewBox.height} L 0 ${viewBox.height}`;

    return (
        <div className="bg-neutral-800 dark:bg-neutral-900/50 rounded-xl shadow-2xl border border-neutral-700/50 text-white p-2 sm:p-4">
             <div className="flex items-center space-x-2 overflow-x-auto p-2 mb-2 bg-black/20 rounded-md">
                <span className="text-xs font-bold text-neutral-400 flex-shrink-0">History:</span>
                {history.map((h, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded-full ${h < 1.5 ? 'text-red-400' : h < 3 ? 'text-yellow-400' : 'text-green-400'} bg-neutral-700`}>{h.toFixed(2)}x</span>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Left Panel */}
                <div className="lg:col-span-1 p-4 bg-black/20 rounded-lg flex flex-col space-y-4">
                    <div>
                        <label className="text-xs text-neutral-400">Bet Amount</label>
                        <input type="number" value={betAmount} onChange={e => setBetAmount(parseFloat(e.target.value))} disabled={gameState !== 'betting'} className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"/>
                    </div>
                     <div>
                        <label className="text-xs text-neutral-400">Auto Cashout</label>
                        <input type="number" value={autoCashout} onChange={e => setAutoCashout(parseFloat(e.target.value))} disabled={gameState !== 'betting'} placeholder="Optional" className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"/>
                    </div>
                    {getButton()}
                    <div className="text-xs text-center text-neutral-500">
                        Profit on win: { hasCashedOut ? payout.toFixed(2) : ((betAmount * autoCashout) - betAmount).toFixed(2) }
                    </div>
                </div>

                {/* Right Panel - Graph */}
                <div className="lg:col-span-3 min-h-[300px] bg-black/20 rounded-lg relative flex items-center justify-center p-2">
                    <svg width="100%" height="100%" viewBox={`0 0 ${viewBox.width} ${viewBox.height}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0">
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={primaryColor} stopOpacity={0.4}/>
                                <stop offset="100%" stopColor={primaryColor} stopOpacity={0.05}/>
                            </linearGradient>
                             <filter id="glow">
                                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        {/* Grid lines */}
                        {[...Array(5)].map((_, i) => <line key={i} x1={0} y1={i * viewBox.height/4} x2={viewBox.width} y2={i * viewBox.height/4} stroke="rgba(255,255,255,0.05)" />)}
                        {[...Array(5)].map((_, i) => <line key={i} x1={i * viewBox.width/4} y1={0} x2={i * viewBox.width/4} y2={viewBox.height} stroke="rgba(255,255,255,0.05)" />)}

                        {gameState === 'running' && (
                            <>
                                <path d={areaPath} fill="url(#areaGradient)" />
                                <path d={linePath} fill="none" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'url(#glow)' }} />
                            </>
                        )}
                    </svg>

                    <div className="z-10 text-center">
                        {gameState === 'starting' && (
                            <>
                                <h2 className="text-2xl font-bold text-neutral-400">Starting in</h2>
                                <p className="text-6xl font-bold" style={{color: primaryColor}}>{countdown}</p>
                            </>
                        )}
                         {(gameState === 'running' || gameState === 'crashed') && (
                            <h2 className={`text-6xl font-bold transition-colors ${multiplierColor}`}>{multiplier.toFixed(2)}x</h2>
                         )}
                         {gameState === 'crashed' && <p className="font-bold text-red-500 text-2xl mt-2 animate-pulse">Crashed!</p>}
                    </div>
                </div>
            </div>
        </div>
    )
};


const MinesGame: React.FC<{ config: WebAppConfig['minesConfig'], conductor?: any }> = ({ config, conductor }) => {
    const [grid, setGrid] = useState<( 'safe' | 'mine' | 'cleared' )[][]>([]);
    const [safeClicks, setSafeClicks] = useState(0);
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'lost' | 'won'>('ready');

    const generateGrid = () => {
        const newGrid = Array.from({ length: config.rows }, () => Array(config.cols).fill('safe'));
        let minesToPlace = conductor ? conductor.getMineCount(config.mines) : config.mines;
        
        let minesPlaced = 0;
        while (minesPlaced < minesToPlace) {
            const r = Math.floor(Math.random() * config.rows);
            const c = Math.floor(Math.random() * config.cols);
            if (newGrid[r][c] === 'safe') {
                newGrid[r][c] = 'mine';
                minesPlaced++;
            }
        }
        setGrid(newGrid as any);
    };
    
    const resetGame = () => {
        setSafeClicks(0);
        setGameState('ready');
        setGrid([]);
    }

    const handleCellClick = (r: number, c: number) => {
        if (gameState !== 'playing' || grid[r][c] === 'cleared') return;

        if (grid[r][c] === 'mine') {
            setGameState('lost');
            conductor?.logEvent('mines_hit');
        } else {
            const newGrid = grid.map(row => [...row]);
            newGrid[r][c] = 'cleared';
            setGrid(newGrid as any);
            const newSafeClicks = safeClicks + 1;
            setSafeClicks(newSafeClicks);
            
            if (newSafeClicks >= config.rows * config.cols - config.mines) {
                setGameState('won');
                conductor?.logEvent('mines_cleared');
            }
        }
    };

    const currentPayout = config.baseStake * (1 + safeClicks * config.multiplierPerSafe);

    return (
        <div className="p-4 border rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50">
            <h3 className="font-bold text-lg mb-2">Minefield Runner</h3>
             {gameState === 'ready' && (
                <Button onClick={() => { generateGrid(); setGameState('playing'); }}>Start (Stake: {config.baseStake})</Button>
            )}
            {gameState === 'playing' && (
                <div>
                    <p>Current Payout: {currentPayout.toFixed(2)}</p>
                    <div className="grid gap-1 mt-2" style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`}}>
                        {grid.map((row, r) => row.map((cell, c) => (
                            <button key={`${r}-${c}`} onClick={() => handleCellClick(r,c)} className={`w-10 h-10 rounded ${cell === 'cleared' ? 'bg-green-500' : 'bg-neutral-400 hover:bg-neutral-500'}`}></button>
                        )))}
                    </div>
                </div>
            )}
            {gameState === 'lost' && (
                 <div className="text-red-600 dark:text-red-400">
                    <p className="font-bold">BOOM! You hit a mine.</p>
                    <Button onClick={resetGame} className="mt-2">Play Again</Button>
                 </div>
            )}
             {gameState === 'won' && (
                 <div className="text-green-600 dark:text-green-400">
                    <p className="font-bold">You cleared the field!</p>
                     <p>Final Payout: {currentPayout.toFixed(2)}</p>
                    <Button onClick={resetGame} className="mt-2">Play Again</Button>
                 </div>
            )}
        </div>
    );
}

const Retro777Slot: React.FC<{ config: WebAppConfig['slot777Config'], conductor?: any }> = ({ config, conductor }) => {
    const [reels, setReels] = useState<string[]>(['?', '?', '?']);
    const [gameState, setGameState] = useState<'ready' | 'spinning' | 'result'>('ready');
    const [payout, setPayout] = useState(0);

    const handleSpin = () => {
        setGameState('spinning');
        setPayout(0);
        
        setTimeout(() => {
            const newReels = Array.from({ length: config.reels }, () => 
                config.symbols[Math.floor(Math.random() * config.symbols.length)]
            );
            setReels(newReels);

            const resultKey = newReels.join('-');
            const winMultiplier = config.paytable[resultKey] || 0;
            const finalPayout = config.baseStake * winMultiplier;
            
            setPayout(finalPayout);
            setGameState('result');
            conductor?.logEvent(finalPayout > 0 ? 'slot_win' : 'slot_loss');
        }, 1000);
    };

    return (
        <div className="p-4 border rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 text-center">
            <h3 className="font-bold text-lg mb-2">Retro 777 Slot</h3>
            <div className="flex justify-center space-x-2 my-4">
                {reels.map((symbol, i) => (
                    <div key={i} className={`w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg ${gameState === 'spinning' ? 'animate-pulse' : ''} bg-white dark:bg-neutral-700 shadow-inner`}>
                        {gameState === 'spinning' ? '?' : symbol}
                    </div>
                ))}
            </div>
            {gameState === 'result' && (
                <p className={`font-bold mb-2 ${payout > 0 ? 'text-green-500' : 'text-neutral-500'}`}>
                    {payout > 0 ? `You won ${payout.toFixed(2)}!` : 'No win this time.'}
                </p>
            )}
            <Button onClick={handleSpin} disabled={gameState === 'spinning'}>
                {gameState === 'spinning' ? 'Spinning...' : `Spin (Stake: ${config.baseStake})`}
            </Button>
        </div>
    );
};


const BalloonPumpChallenge: React.FC<{ config: WebAppConfig['balloonPumpConfig'], conductor?: any }> = ({ config, conductor }) => {
    const [pumps, setPumps] = useState(0);
    const [popThreshold, setPopThreshold] = useState(0);
    const [multiplier, setMultiplier] = useState(1.0);
    const [gameState, setGameState] = useState<'ready' | 'pumping' | 'popped' | 'cashed_out'>('ready');

    const startGame = () => {
        const threshold = conductor ? conductor.getBalloonPopThreshold(config.maxSafePumps) : Math.floor(Math.random() * config.maxSafePumps) + 1;
        setPopThreshold(threshold);
        setPumps(0);
        setMultiplier(1.0);
        setGameState('pumping');
    };

    const handlePump = () => {
        const newPumps = pumps + 1;
        if (newPumps >= popThreshold) {
            setGameState('popped');
            conductor?.logEvent('balloon_pop');
        } else {
            setPumps(newPumps);
            setMultiplier(1.0 + newPumps * config.multiplierPerPump);
        }
    };

    const handleCashout = () => {
        setGameState('cashed_out');
        conductor?.logEvent('balloon_cashout', { pumps });
    };

    const payout = config.baseStake * multiplier;

    return (
        <div className="p-4 border rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50">
            <h3 className="font-bold text-lg mb-2">Balloon Pump Challenge</h3>
            {gameState === 'ready' && <Button onClick={startGame}>Start Game (Stake: {config.baseStake})</Button>}
            {gameState === 'pumping' && (
                <div className="space-y-2">
                    <p>Pumps: {pumps}</p>
                    <p>Multiplier: {multiplier.toFixed(2)}x</p>
                    <p>Current Payout: {payout.toFixed(2)}</p>
                    <div className="flex space-x-2">
                        <Button onClick={handlePump}>Pump</Button>
                        <Button onClick={handleCashout} variant="secondary">Cash Out</Button>
                    </div>
                </div>
            )}
            {gameState === 'popped' && (
                 <div className="text-red-600 dark:text-red-400">
                    <p className="font-bold">POP! You pumped too far.</p>
                    <Button onClick={startGame} className="mt-2">Play Again</Button>
                 </div>
            )}
            {gameState === 'cashed_out' && (
                 <div className="text-green-600 dark:text-green-400">
                    <p className="font-bold">You cashed out safely!</p>
                    <p>Final Payout: {payout.toFixed(2)}</p>
                    <Button onClick={startGame} className="mt-2">Play Again</Button>
                 </div>
            )}
        </div>
    );
};


interface MyArcadePageProps {
  currentUser: FirebaseUser | null;
}

const MyArcadePage: React.FC<MyArcadePageProps> = ({ currentUser }) => {
    const [config, setConfig] = useState<WebAppConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentLog, setDeploymentLog] = useState<DeploymentStep[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            const savedConfig = getArcadeConfig(currentUser.uid);
            setConfig(savedConfig);
        }
        setIsLoading(false);
    }, [currentUser]);

    const handleDownloadZip = async () => {
        if (!config) return;
        const project = generateReactProject(config);
        const zip = new JSZip();

        project.files.forEach(file => {
            zip.file(file.path, file.content);
        });

        const blob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = project.zipName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeploy = async () => {
        setIsDeploying(true);
        setDeploymentLog([]);
        const logStep = (step: DeploymentStep) => {
            setDeploymentLog(prev => [...prev, step]);
        };

        const steps: DeploymentStep[] = [
            { status: 'info', message: 'Starting deployment process...' },
            { status: 'provider', message: 'Creating new GitHub repository...', provider: 'GitHubIcon' },
            { status: 'success', message: 'Successfully created repo: "my-awesome-arcade".' },
            { status: 'provider', message: 'Connecting to Supabase...', provider: 'SupabaseIcon' },
            { status: 'success', message: 'Database & Auth configured.' },
            { status: 'provider', message: 'Deploying to Netlify...', provider: 'NetlifyIcon' },
            { status: 'info', message: 'Build started: `npm run build`' },
            { status: 'info', message: 'Site is live!' },
            { status: 'success', message: 'Deployment complete! Your site is available at my-awesome-arcade.netlify.app (simulated).' }
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 700));
            logStep(step);
        }
    };

    if (isLoading) {
        return <div className="text-center p-10"><Icon icon="RefreshIcon" className="w-10 h-10 animate-spin mx-auto"/></div>
    }

    if (!config) {
        return (
            <div className="container mx-auto text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Your Arcade is Empty!</h2>
                <p className="mb-6">You haven't customized your arcade yet. Go to the customizer to get started.</p>
                <Button onClick={() => navigate('/chatbot-builder')}>
                    <Icon icon="CubeIcon" className="w-5 h-5 mr-2" />
                    Go to Arcade Customizer
                </Button>
            </div>
        )
    }

    const { games } = config;

    return (
        <div className="animate-fadeIn">
            {/* Personalized Header */}
            <header className="py-10" style={{ backgroundColor: `${config.primaryColor}20` }}>
                <div className="container mx-auto px-4 text-center">
                    <img src={config.logoUrl} alt={`${config.appName} logo`} className="w-24 h-24 rounded-full mx-auto mb-4 border-4" style={{borderColor: config.primaryColor}}/>
                    <h1 className="text-4xl font-bold" style={{color: config.primaryColor}}>{config.appName}</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {games.crash && <CrashGame config={config.crashConfig} primaryColor={config.primaryColor} />}
                    {games.mines && <MinesGame config={config.minesConfig} />}
                    {games.slot777 && <Retro777Slot config={config.slot777Config} />}
                    {games.balloonPump && <BalloonPumpChallenge config={config.balloonPumpConfig} />}
                 </div>
                 {!Object.values(games).some(g => g) && (
                     <div className="text-center py-10 text-neutral-500">
                         <p>No games selected! Go back to the customizer to add some.</p>
                         <Button onClick={() => navigate('/chatbot-builder')} variant="secondary" className="mt-4">
                             Edit Arcade
                         </Button>
                     </div>
                 )}

                 {/* Export & Deploy Section */}
                 <div className="mt-12 pt-8 border-t border-neutral-300/50 dark:border-neutral-700/50">
                    <h2 className="text-2xl font-bold text-center mb-6">Export Your Arcade</h2>
                    <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={handleDownloadZip} size="lg" variant="primary">
                            <Icon icon="DownloadIcon" className="w-5 h-5 mr-2"/>
                            Download ZIP
                        </Button>
                         <Button onClick={handleDeploy} size="lg" variant="secondary" disabled={isDeploying}>
                            <Icon icon="CloudUploadIcon" className="w-5 h-5 mr-2"/>
                            Deploy to Web
                        </Button>
                    </div>
                     {isDeploying && (
                        <div className="max-w-2xl mx-auto mt-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-inner">
                            <h3 className="font-semibold text-lg mb-2">Deployment Log</h3>
                            <div className="font-mono text-xs space-y-1 max-h-60 overflow-y-auto">
                                {deploymentLog.map((log, i) => (
                                    <p key={i} className={`${log.status === 'success' ? 'text-green-500' : log.status === 'error' ? 'text-red-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                        <span className="mr-2">{log.status === 'provider' && log.provider && <Icon icon={log.provider} className="w-4 h-4 inline mr-1"/>} &gt;</span>{log.message}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
            </main>
        </div>
    );
};

export default MyArcadePage;
