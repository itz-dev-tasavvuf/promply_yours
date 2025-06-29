
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone-esm';
import { FirebaseUser, WebAppConfig, MiniGameType, CrashConfig, MinesConfig, Slot777Config, BalloonPumpConfig } from '../types';
import { Icon, IconType } from '../components/Icons';
import Button from '../components/Button';
import { generateLogoPromptForGemini } from '../services/geminiService';
import { saveArcadeConfig } from '../services/configService';

interface ArcadeCustomizerPageProps {
  currentUser: FirebaseUser | null;
}

type BuilderPhase = 'design' | 'saving' | 'complete';
const TOTAL_STEPS = 4;

const DEFAULT_CRASH_CONFIG: CrashConfig = { type: 'crash', baseStake: 100, growthFactor: 0.06, autoCashoutAllowed: true };
const DEFAULT_MINES_CONFIG: MinesConfig = { type: 'mines', rows: 5, cols: 5, mines: 5, baseStake: 50, multiplierPerSafe: 0.1 };
const DEFAULT_SLOT777_CONFIG: Slot777Config = { type: 'slot777', reels: 3, symbols: ["7", "BAR", "CHERRY", "LEMON"], paytable: { "7-7-7": 50, "BAR-BAR-BAR": 20, "CHERRY-CHERRY-CHERRY": 10, "LEMON-LEMON-LEMON": 5 }, baseStake: 10, wildSymbol: null };
const DEFAULT_BALLOON_PUMP_CONFIG: BalloonPumpConfig = { type: 'balloonPump', maxSafePumps: 20, baseStake: 20, multiplierPerPump: 0.1 };

const DEFAULT_CONFIG: WebAppConfig = {
    appName: 'My Awesome Arcade',
    tagline: 'High Scores & Good Times',
    logoType: 'generate',
    logoPrompt: 'A retro pixel art joystick with vibrant colors',
    logoFile: null,
    logoUrl: `https://i.pravatar.cc/150?u=defaultlogo`,
    primaryColor: '#F97316', // Default orange
    games: { crash: true, mines: true, slot777: false, balloonPump: false },
    crashConfig: DEFAULT_CRASH_CONFIG,
    minesConfig: DEFAULT_MINES_CONFIG,
    slot777Config: DEFAULT_SLOT777_CONFIG,
    balloonPumpConfig: DEFAULT_BALLOON_PUMP_CONFIG,
    gameConductor: true,
};

const gameMeta: Record<MiniGameType, { name: string, icon: IconType }> = {
    crash: { name: 'Crash', icon: 'TrendingUpIcon' },
    mines: { name: 'Minefield Runner', icon: 'FireIcon' },
    slot777: { name: 'Retro 777 Slot', icon: 'TicketIcon' },
    balloonPump: { name: 'Balloon Pump', icon: 'PlusCircleIcon' },
}

// --- Configuration Modal Components ---

const FormRow: React.FC<{ label: string, children: React.ReactNode, helpText?: string }> = ({ label, children, helpText }) => (
    <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{label}</label>
        {children}
        {helpText && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{helpText}</p>}
    </div>
);

const CrashConfigForm: React.FC<{ config: CrashConfig, setConfig: (c: CrashConfig) => void }> = ({ config, setConfig }) => (
    <div className="space-y-4">
        <FormRow label="Base Stake">
            <input type="number" value={config.baseStake} onChange={e => setConfig({ ...config, baseStake: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" />
        </FormRow>
        <FormRow label="Growth Factor" helpText="A higher value makes the multiplier grow faster. A value around 0.06 is standard.">
            <input type="number" step="0.01" value={config.growthFactor} onChange={e => setConfig({ ...config, growthFactor: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" />
        </FormRow>
        <label className="flex items-center space-x-2">
            <input type="checkbox" checked={config.autoCashoutAllowed} onChange={e => setConfig({ ...config, autoCashoutAllowed: e.target.checked })} className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500"/>
            <span>Allow Auto-Cashout feature for players</span>
        </label>
    </div>
);

const MinesConfigForm: React.FC<{ config: MinesConfig, setConfig: (c: MinesConfig) => void }> = ({ config, setConfig }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormRow label="Grid Rows"><input type="number" value={config.rows} onChange={e => setConfig({ ...config, rows: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" /></FormRow>
            <FormRow label="Grid Columns"><input type="number" value={config.cols} onChange={e => setConfig({ ...config, cols: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" /></FormRow>
        </div>
        <FormRow label="Number of Mines"><input type="number" value={config.mines} onChange={e => setConfig({ ...config, mines: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" /></FormRow>
        <FormRow label="Base Stake"><input type="number" value={config.baseStake} onChange={e => setConfig({ ...config, baseStake: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" /></FormRow>
        <FormRow label="Multiplier Per Safe Tile" helpText="How much the payout multiplier increases for each safe tile revealed."><input type="number" step="0.01" value={config.multiplierPerSafe} onChange={e => setConfig({ ...config, multiplierPerSafe: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" /></FormRow>
    </div>
);

const Slot777ConfigForm: React.FC<{ config: Slot777Config, setConfig: (c: Slot777Config) => void }> = ({ config, setConfig }) => {
    const [paytableError, setPaytableError] = useState('');
    
    const handlePaytableChange = (text: string) => {
        try {
            const parsed = JSON.parse(text);
            if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                setConfig({ ...config, paytable: parsed });
                setPaytableError('');
            } else {
                setPaytableError('Paytable must be a valid JSON object.');
            }
        } catch (e) {
            setPaytableError('Invalid JSON format.');
        }
    };
    
    return (
        <div className="space-y-4">
            <FormRow label="Reels"><input type="number" value={config.reels} onChange={e => setConfig({ ...config, reels: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" /></FormRow>
            <FormRow label="Symbols" helpText="Enter symbols separated by commas (e.g., A,B,C,D)">
                <input type="text" value={config.symbols.join(',')} onChange={e => setConfig({ ...config, symbols: e.target.value.split(',').map(s => s.trim()) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" />
            </FormRow>
            <FormRow label="Paytable" helpText='Valid JSON object. Key is the combo (e.g., "7-7-7"), value is the payout multiplier.'>
                 <textarea
                    defaultValue={JSON.stringify(config.paytable, null, 2)}
                    onChange={e => handlePaytableChange(e.target.value)}
                    className={`w-full p-2 font-mono text-sm bg-white/80 dark:bg-neutral-900/80 border rounded-md min-h-[120px] ${paytableError ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'}`}
                />
                {paytableError && <p className="text-xs text-red-500 mt-1">{paytableError}</p>}
            </FormRow>
            <FormRow label="Base Stake"><input type="number" value={config.baseStake} onChange={e => setConfig({ ...config, baseStake: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" /></FormRow>
        </div>
    );
};

const BalloonPumpConfigForm: React.FC<{ config: BalloonPumpConfig, setConfig: (c: BalloonPumpConfig) => void }> = ({ config, setConfig }) => (
    <div className="space-y-4">
        <FormRow label="Max Safe Pumps" helpText="The highest possible number of pumps before the balloon might pop. The actual pop point will be random up to this number."><input type="number" value={config.maxSafePumps} onChange={e => setConfig({ ...config, maxSafePumps: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" /></FormRow>
        <FormRow label="Base Stake"><input type="number" value={config.baseStake} onChange={e => setConfig({ ...config, baseStake: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" /></FormRow>
        <FormRow label="Multiplier Per Pump"><input type="number" step="0.01" value={config.multiplierPerPump} onChange={e => setConfig({ ...config, multiplierPerPump: Number(e.target.value) })} className="w-full p-2 bg-white/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-600 rounded-md" /></FormRow>
    </div>
);


const GameConfigurationModal: React.FC<{
    gameType: MiniGameType,
    config: WebAppConfig,
    onSave: (newGameConfig: any) => void,
    onClose: () => void,
}> = ({ gameType, config, onSave, onClose }) => {
    const gameConfig = config[`${gameType}Config`];
    const [localConfig, setLocalConfig] = useState(gameConfig);
    
    useEffect(() => {
        setLocalConfig(gameConfig);
    }, [gameConfig]);

    const handleSave = () => {
        onSave(localConfig);
    };

    const renderForm = () => {
        switch (gameType) {
            case 'crash': return <CrashConfigForm config={localConfig as CrashConfig} setConfig={setLocalConfig} />;
            case 'mines': return <MinesConfigForm config={localConfig as MinesConfig} setConfig={setLocalConfig} />;
            case 'slot777': return <Slot777ConfigForm config={localConfig as Slot777Config} setConfig={setLocalConfig} />;
            case 'balloonPump': return <BalloonPumpConfigForm config={localConfig as BalloonPumpConfig} setConfig={setLocalConfig} />;
            default: return <p>No configuration available for this game.</p>;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-xl font-bold flex items-center"><Icon icon={gameMeta[gameType].icon} className="w-6 h-6 mr-2 text-orange-500" /> Configure {gameMeta[gameType].name}</h2>
                    <Button onClick={onClose} variant="ghost" size="sm" className="!p-2"><Icon icon="XIcon" className="w-5 h-5" /></Button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {renderForm()}
                </div>
                <div className="flex justify-end p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-b-xl">
                    <Button onClick={onClose} variant="secondary" className="mr-2">Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
};


const ChatbotBuilderPage: React.FC<ArcadeCustomizerPageProps> = ({ currentUser }) => {
  const [phase, setPhase] = useState<BuilderPhase>('design');
  const [wizardStep, setWizardStep] = useState(1);
  const [config, setConfig] = useState<WebAppConfig>(DEFAULT_CONFIG);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [configuringGame, setConfiguringGame] = useState<MiniGameType | null>(null);
  const navigate = useNavigate();

  const handleNext = () => setWizardStep(s => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => setWizardStep(s => Math.max(s - 1, 1));
  
  const handleSaveAndGoToArcade = () => {
      setIsLoading(true);
      setError(null);
      setPhase('saving');
      
      setTimeout(() => {
          if (currentUser) {
              saveArcadeConfig(currentUser.uid, config);
              navigate('/my-arcade');
          } else {
              setError("You must be logged in to save an arcade.");
              setPhase('design');
          }
          setIsLoading(false);
      }, 1000); // Simulate saving
  };
  
  const handleConfigSave = (newGameConfig: any) => {
    if (!configuringGame) return;

    setConfig(prevConfig => ({
        ...prevConfig,
        [`${configuringGame}Config`]: newGameConfig,
    }));
    setConfiguringGame(null);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 md:py-8 flex flex-col h-full animate-fadeIn">
       <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-2">AI Arcade Builder</h1>
        <p className="text-md md:text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Design your personal gaming hub. Your choices will create a unique arcade page just for you!
        </p>
      </div>

      {phase === 'design' && (
        <WizardView 
            step={wizardStep} 
            config={config} 
            setConfig={setConfig}
            onNext={handleNext}
            onBack={handleBack}
            onGenerate={handleSaveAndGoToArcade}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setConfiguringGame={setConfiguringGame}
        />
      )}
      
      {(phase === 'saving') && (
        <div className="text-center p-10">
            <Icon icon="RefreshIcon" className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4"/>
            <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200">Saving your masterpiece...</h3>
            <p className="text-neutral-500 dark:text-neutral-400">Get ready to play!</p>
        </div>
      )}

      {configuringGame && (
        <GameConfigurationModal
            gameType={configuringGame}
            config={config}
            onSave={handleConfigSave}
            onClose={() => setConfiguringGame(null)}
        />
      )}
    </div>
  );
};

// --- Wizard Sub-components ---
const WizardView: React.FC<{
    step: number,
    config: WebAppConfig,
    setConfig: (config: WebAppConfig) => void,
    onNext: () => void,
    onBack: () => void,
    onGenerate: () => void,
    isLoading: boolean,
    setIsLoading: (loading: boolean) => void,
    setConfiguringGame: (game: MiniGameType | null) => void;
}> = ({ step, config, setConfig, onNext, onBack, onGenerate, isLoading, setIsLoading, setConfiguringGame }) => {
    const renderStep = () => {
        switch (step) {
            case 1: return <StepBranding config={config} setConfig={setConfig} />;
            case 2: return <StepLogo config={config} setConfig={setConfig} setIsLoading={setIsLoading} isLoading={isLoading}/>;
            case 3: return <StepGames config={config} setConfig={setConfig} setConfiguringGame={setConfiguringGame} />;
            case 4: return <StepReview config={config} />;
            default: return null;
        }
    }
    
    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-orange-700 dark:text-white">Step {step} of {TOTAL_STEPS}</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5 dark:bg-neutral-700">
                    <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}></div>
                </div>
            </div>
            
            <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 md:p-8 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30">
                {renderStep()}
            </div>
            
            <div className="mt-8 flex justify-between">
                <Button onClick={onBack} variant="secondary" disabled={step === 1}>Back</Button>
                {step < TOTAL_STEPS ? (
                    <Button onClick={onNext}>Next</Button>
                ) : (
                    <Button onClick={onGenerate} isLoading={isLoading}>Save & Go to My Arcade</Button>
                )}
            </div>
        </div>
    );
};

const StepBranding: React.FC<{ config: WebAppConfig, setConfig: (c: WebAppConfig) => void }> = ({ config, setConfig }) => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Your Arcade's Brand</h2>
         <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Arcade Name</label>
                <input type="text" value={config.appName} onChange={e => setConfig({...config, appName: e.target.value})} placeholder="e.g., Nova's Game Room" className="w-full p-2 bg-white/80 dark:bg-neutral-700/80 border border-neutral-300 dark:border-neutral-600 rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Primary Color</label>
                <div className="flex items-center space-x-3">
                    <input type="color" value={config.primaryColor} onChange={e => setConfig({...config, primaryColor: e.target.value})} className="p-1 h-10 w-10 block bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 cursor-pointer rounded-lg" />
                    <input type="text" value={config.primaryColor} onChange={e => setConfig({...config, primaryColor: e.target.value})} className="w-full p-2 bg-white/80 dark:bg-neutral-700/80 border border-neutral-300 dark:border-neutral-600 rounded-md" />
                </div>
            </div>
        </div>
    </div>
);

const StepLogo: React.FC<{ config: WebAppConfig, setConfig: (c: WebAppConfig) => void, isLoading: boolean, setIsLoading: (l: boolean) => void }> = ({ config, setConfig, isLoading, setIsLoading }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const logoUrl = URL.createObjectURL(file);
            setConfig({
                ...config,
                logoFile: file,
                logoUrl: logoUrl,
            });
        }
    }, [config, setConfig]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []}, multiple: false });

    const handleGeneratePrompt = async () => {
        setIsLoading(true);
        try {
            const prompt = await generateLogoPromptForGemini(config.appName, config.tagline);
            setConfig({ ...config, logoPrompt: prompt });
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Arcade Logo</h2>
            <div className="flex space-x-4 mb-4">
                <label className="flex items-center"><input type="radio" name="logoType" value="generate" checked={config.logoType === 'generate'} onChange={() => setConfig({...config, logoType: 'generate'})} className="mr-2" /> AI Generated</label>
                <label className="flex items-center"><input type="radio" name="logoType" value="upload" checked={config.logoType === 'upload'} onChange={() => setConfig({...config, logoType: 'upload'})} className="mr-2" /> Upload</label>
            </div>
            {config.logoType === 'generate' ? (
                <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">AI Logo Prompt</label>
                    <textarea value={config.logoPrompt} onChange={e => setConfig({...config, logoPrompt: e.target.value})} className="w-full p-2 bg-white/80 dark:bg-neutral-700/80 border border-neutral-300 dark:border-neutral-600 rounded-md" rows={3}></textarea>
                    <Button onClick={handleGeneratePrompt} isLoading={isLoading} variant="ghost" size="sm">
                        <Icon icon="SparklesIcon" className="w-4 h-4 mr-2"/>
                        Help me with a prompt
                    </Button>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Note: This only generates a prompt. Use this prompt in an image generator of your choice and upload the result.</p>
                </div>
            ) : (
                <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-orange-500' : 'border-neutral-300 dark:border-neutral-600'}`}>
                    <input {...getInputProps()} />
                    {config.logoUrl && config.logoType === 'upload' ? <img src={config.logoUrl} alt="logo preview" className="h-20 mx-auto mb-2"/> : <Icon icon="UploadIcon" className="w-10 h-10 mx-auto text-neutral-400 mb-2"/> }
                    <p>{isDragActive ? 'Drop the logo here...' : 'Drag & drop logo, or click to select'}</p>
                </div>
            )}
        </div>
    );
};

const StepGames: React.FC<{
    config: WebAppConfig,
    setConfig: (c: WebAppConfig) => void,
    setConfiguringGame: (game: MiniGameType) => void;
}> = ({ config, setConfig, setConfiguringGame }) => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Select & Configure Your Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(config.games) as MiniGameType[]).map(gameKey => (
                <div key={gameKey} className={`p-4 rounded-lg border-2 transition-all ${config.games[gameKey] ? 'border-orange-500 bg-orange-500/10' : 'border-transparent bg-neutral-100/70 dark:bg-neutral-700/70'}`}>
                    <label className="flex items-start cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={config.games[gameKey]} 
                            onChange={e => setConfig({...config, games: {...config.games, [gameKey]: e.target.checked}})} 
                            className="h-5 w-5 rounded text-orange-600 focus:ring-orange-500 border-neutral-300 mt-1 flex-shrink-0"
                        />
                        <div className="ml-3 flex-grow">
                           <div className="flex items-center">
                             <Icon icon={gameMeta[gameKey].icon} className="w-5 h-5 mr-2" />
                             <span className="font-semibold">{gameMeta[gameKey].name}</span>
                           </div>
                        </div>
                    </label>
                    {config.games[gameKey] && (
                        <div className="mt-3 text-right">
                             <Button variant="secondary" size="sm" onClick={() => setConfiguringGame(gameKey)}>
                                <Icon icon="CogIcon" className="w-4 h-4 mr-1"/>
                                Configure
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
        <div className="mt-6 border-t pt-4 border-neutral-300/50 dark:border-neutral-600/50">
             <label className="flex items-center p-2 rounded-lg cursor-pointer transition-all hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50">
                <input 
                    type="checkbox" 
                    checked={config.gameConductor} 
                    onChange={e => setConfig({...config, gameConductor: e.target.checked})} 
                    className="h-5 w-5 rounded text-orange-600 focus:ring-orange-500 border-neutral-300"
                />
                <div className="ml-3">
                   <div className="flex items-center">
                     <Icon icon="SparklesIcon" className="w-5 h-5 mr-2 text-orange-500" />
                     <span className="font-semibold">Enable Smart AI Conductor</span>
                   </div>
                   <p className="text-xs text-neutral-500 dark:text-neutral-400">Makes games feel more dynamic and fair by simulating a live environment.</p>
                </div>
            </label>
        </div>
    </div>
);

const StepReview: React.FC<{ config: WebAppConfig }> = ({ config }) => (
    <div>
        <h2 className="text-2xl font-bold mb-4">Review & Finish</h2>
        <div className="space-y-4 p-4 bg-neutral-100/70 dark:bg-neutral-900/50 rounded-lg">
            <p><strong>Arcade Name:</strong> {config.appName}</p>
            <p className="flex items-center"><strong>Primary Color:</strong> <span className="inline-block w-5 h-5 rounded-full ml-2" style={{backgroundColor: config.primaryColor}}></span> <span className="ml-2 font-mono">{config.primaryColor}</span></p>
            <div className="flex items-start">
                <strong className="mr-2">Logo:</strong>
                <img src={config.logoUrl} alt="logo" className="w-16 h-16 rounded-md bg-neutral-200" />
            </div>
            <div>
                <strong>Selected Games:</strong>
                <ul className="list-disc list-inside mt-1">
                    {Object.entries(config.games).filter(([,v]) => v).map(([k]) => <li key={k} className="capitalize">{gameMeta[k as MiniGameType].name}</li>)}
                </ul>
            </div>
            <p><strong>Smart AI Conductor:</strong> <span className={`font-semibold ${config.gameConductor ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{config.gameConductor ? 'Enabled' : 'Disabled'}</span></p>
        </div>
        <p className="mt-6 text-center text-neutral-600 dark:text-neutral-300">Looks good? Click the button below to create your arcade!</p>
    </div>
);

export default ChatbotBuilderPage;
