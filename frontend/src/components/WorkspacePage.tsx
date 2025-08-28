import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Button } from '@/components/ui/enhanced-button';
import axios from "axios";
import { 
  Code, 
  FileText, 
  Play, 
  Settings, 
  Folder, 
  ChevronRight,
  ChevronDown,
  File,
  Home,
  Eye,
  CheckCircle
} from 'lucide-react';
import { BACKEND_URL } from '@/config';
import { Step } from '@/types';
import { IconRight } from 'react-day-picker';
import { parseXml } from '@/lib/parser';

const WorkspacePage: React.FC = () => {
  const location = useLocation();
  const prompt = location.state?.prompt || '';
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [isExplorerExpanded, setIsExplorerExpanded] = useState(true);
  const [activeView, setActiveView] = useState<'code' | 'preview'>('code');
  const [code, setCode] = useState(`// Welcome to Aurora Dev
// Your project: ${prompt}

function App() {
  return (
    <div className="container">
      <h1>Hello, Aurora Dev!</h1>
      <p>Your AI-powered development workspace</p>
    </div>
  );
}

export default App;`);

    async function init(){
      const response = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt
      });

      const {prompts, uiPrompt} = response.data;
      setSteps(parseXml(uiPrompt[0]))
      const stepResponse = await axios.post(`${BACKEND_URL}/chat`, {
        messages: [...prompts, prompt].map(x=> ({
          role: "user", 
          prompt: x
        }))
      })
    }

    useEffect(()=>{
      init();
    }, [])

  // const steps = [
  //   { icon: Code, title: 'Initialize', desc: 'Project setup', active: true },
  //   { icon: FileText, title: 'Generate', desc: 'Code generation', active: false },
  //   { icon: Play, title: 'Preview', desc: 'Live testing', active: false },
  //   { icon: Settings, title: 'Deploy', desc: 'Go live', active: false },
  // ];

  const fileTree = [
    {
      name: 'src',
      type: 'folder',
      expanded: true,
      children: [
        { name: 'App.tsx', type: 'file', active: true },
        { name: 'index.tsx', type: 'file', active: false },
        { name: 'styles.css', type: 'file', active: false },
      ]
    },
    {
      name: 'public',
      type: 'folder',
      expanded: false,
      children: [
        { name: 'index.html', type: 'file', active: false },
      ]
    },
    { name: 'package.json', type: 'file', active: false },
  ];

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item, index) => (
      <motion.div
        key={`${item.name}-${level}-${index}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div
          className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-secondary/50 cursor-pointer transition-colors ${
            item.active ? 'bg-secondary text-primary' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {item.type === 'folder' ? (
            <>
              {item.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Folder size={14} className="text-neon-blue" />
            </>
          ) : (
            <>
              <div className="w-3.5" />
              <File size={14} className="text-muted-foreground" />
            </>
          )}
          <span className="text-sm">{item.name}</span>
        </div>
        {item.children && item.expanded && (
          <div>{renderFileTree(item.children, level + 1)}</div>
        )}
      </motion.div>
    ));
  };

  return (
    <div className="h-screen bg-background text-foreground">
      {/* Main layout with resizable panels */}
      <PanelGroup direction="horizontal" className="h-full">
        {/* Left Sidebar - Steps */}
        <Panel defaultSize={15} minSize={12} maxSize={20}>
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="h-full glass border-r border-glass-border p-4"
          >
            <div className="mb-6">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <Home size={16} className="mr-2" />
                Home
              </Button>
            </div>
            
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Workflow
            </h2>
            
            <div className="space-y-2">
               {steps?.map((step, index) => {
        
        const isActive = index === currentStep;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
              isActive
                ? "glass glow-blue border border-primary/50"
                : "hover:bg-secondary/30"
            }`}
            onClick={() => setCurrentStep(index)}
          >
            <div className="flex items-center gap-3">
              <CheckCircle
                className={isActive ? "text-primary" : "text-muted-foreground"}
              />
              <div>
                <div
                  className={`text-sm font-medium ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
            </div>
          </motion.div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />

        {/* File Explorer */}
        <Panel defaultSize={20} minSize={15} maxSize={30}>
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full glass border-r border-glass-border"
          >
            <div className="p-4 border-b border-glass-border">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Explorer</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExplorerExpanded(!isExplorerExpanded)}
                >
                  {isExplorerExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </Button>
              </div>
            </div>
            
            {isExplorerExpanded && (
              <div className="p-2">
                {renderFileTree(fileTree)}
              </div>
            )}
          </motion.div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />

        {/* Center - Code Editor / Preview */}
        <Panel defaultSize={45} minSize={30}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-full flex flex-col"
          >
            <div className="p-4 border-b border-glass-border glass">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold gradient-text">
                    {activeView === 'code' ? 'Code Editor' : 'Live Preview'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {activeView === 'code' ? 'App.tsx' : 'Real-time output'}
                  </p>
                </div>
                <Button variant="neon" size="sm">
                  <Play size={14} className="mr-2" />
                  Run
                </Button>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex gap-2">
                <Button
                  variant={activeView === 'code' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('code')}
                  className="transition-all duration-200"
                >
                  <Code size={14} className="mr-2" />
                  Code
                </Button>
                <Button
                  variant={activeView === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('preview')}
                  className="transition-all duration-200"
                >
                  <Eye size={14} className="mr-2" />
                  Preview
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              {activeView === 'code' ? (
                <Editor
                  height="100%"
                  defaultLanguage="typescript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                  }}
                />
              ) : (
                <div className="p-4 h-full bg-card">
                  <div className="glass rounded-lg p-6 h-full flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-4xl mb-4"
                      >
                        🚀
                      </motion.div>
                      <h3 className="text-xl font-semibold gradient-text mb-2">
                        Hello, Aurora Dev!
                      </h3>
                      <p className="text-muted-foreground">
                        Your AI-powered development workspace
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default WorkspacePage;