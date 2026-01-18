import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ReportPage() {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState<string>('');
  const [displayText, setDisplayText] = useState<string>('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('latest_report');
      if (stored) {
        const data = JSON.parse(stored);
        setReport(data.report);
      }
    }
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!report) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(report.slice(0, i));
      i += 3; // Speed up by showing 3 chars at a time
      if (i >= report.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [report]);

  const handleSkipAnimation = () => {
    setDisplayText(report);
    setIsTyping(false);
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-400">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <motion.header
        className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl">←</span>
            <span className="font-semibold">AI Competitor Radar</span>
          </Link>
          <button
            onClick={handleSkipAnimation}
            className={`px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-sm ${
              !isTyping && 'opacity-0 pointer-events-none'
            }`}
          >
            Skip Animation
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {id}
            </motion.h1>
            <motion.p
              className="text-gray-400 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live AI Analysis • Powered by Perplexity Sonar
            </motion.p>
          </div>

          <motion.div
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 md:p-12 shadow-2xl"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="prose prose-invert max-w-none">
              <div 
                className="whitespace-pre-wrap text-sm md:text-base leading-relaxed"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  lineHeight: '1.8'
                }}
              >
                {displayText}
                {isTyping && (
                  <motion.span
                    className="inline-block w-2 h-5 bg-blue-500 ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="mt-8 flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={() => {
                const blob = new Blob([report], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${id}-competitor-report.txt`;
                a.click();
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition flex items-center gap-2"
            >
              📥 Download Report
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(report);
                alert('Report copied to clipboard!');
              }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition flex items-center gap-2"
            >
              📋 Copy to Clipboard
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition flex items-center gap-2"
            >
              🔍 Analyze Another Company
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="border-t border-gray-800 mt-20 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>AI Competitor Radar • Built with Next.js & Perplexity AI</p>
        </div>
      </motion.footer>
    </div>
  );
}
