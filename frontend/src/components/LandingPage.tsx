import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Sparkles, Zap, Code } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/workspace', { state: { prompt } });
    }
  };

  const floatingIcons = [
    { Icon: Sparkles, delay: 0, x: 100, y: 100 },
    { Icon: Zap, delay: 2, x: -100, y: -50 },
    { Icon: Code, delay: 4, x: 50, y: -100 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden gradient-bg">
      {/* Floating background elements */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute opacity-20"
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{
            x: [0, x, 0],
            y: [0, y, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            delay: delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: `${20 + index * 30}%`,
            top: `${30 + index * 20}%`,
          }}
        >
          <Icon size={60} className="text-neon-blue" />
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full text-center"
        >
          {/* Hero title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-6 gradient-text float"
          >
            Aurora Dev
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Transform your ideas into reality with AI-powered development
          </motion.p>

          {/* Input form */}
          <motion.form
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="glass rounded-2xl p-8">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="relative"
              >
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your project idea..."
                  className="w-full bg-input border-2 border-glass-border rounded-xl p-6 text-lg 
                           placeholder-muted-foreground focus:outline-none focus:border-primary 
                           focus:glow-blue transition-all duration-300 resize-none h-32"
                  required
                />
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0"
                  whileFocus={{ opacity: 1 }}
                  style={{
                    background: 'linear-gradient(45deg, transparent, hsl(var(--primary) / 0.1), transparent)',
                  }}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-6"
              >
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  disabled={!prompt.trim()}
                  className="w-full sm:w-auto min-w-48"
                >
                  <Zap className="mr-2" />
                  Generate
                </Button>
              </motion.div>
            </div>
          </motion.form>

          {/* Features showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: Sparkles, title: 'AI-Powered', desc: 'Intelligent code generation' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Instant development workflow' },
              { icon: Code, title: 'Full Stack', desc: 'Complete project scaffolding' }
            ].map(({ icon: Icon, title, desc }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-xl p-6 hover:glow-purple transition-all duration-300"
              >
                <Icon className="text-neon-purple mx-auto mb-4" size={32} />
                <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;