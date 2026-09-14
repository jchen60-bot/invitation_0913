import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Smartphone,
  Download,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      setCurrentUrl(url);

      QRCode.toDataURL(url, {
        width: 480,
        margin: 2,
        color: {
          dark: '#0c0c14',
          light: '#ffffff',
        },
      })
        .then((dataUrl) => {
          setQrDataUrl(dataUrl);
        })
        .catch((err) => {
          console.error('QR code generation error:', err);
        });
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);

    confetti({
      particleCount: 28,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#6366F1', '#10B981'],
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'nmdp-berkeley-invitation-qr.png';
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            className="relative w-full max-w-sm bg-[#15151e] text-white rounded-3xl border border-white/10 p-5 sm:p-6 shadow-2xl z-10 overflow-hidden flex flex-col items-center text-center"
          >
            {/* Header */}
            <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-500/20 to-indigo-500/20 border border-white/10 text-rose-300 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Share Invitation</h3>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code Container with High-Contrast White Background & Rounded Corners */}
            <div className="relative group p-3.5 bg-white rounded-2xl shadow-xl shadow-indigo-500/10 border-4 border-white/90 mb-3 flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Scan to open NMDP Invitation"
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center text-slate-400">
                  <QrCode className="w-12 h-12 animate-pulse" />
                </div>
              )}

              {/* Centered Subtle Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-9 h-9 rounded-xl bg-[#0e0e14] border-2 border-white shadow-md flex items-center justify-center text-rose-400">
                  <span className="text-base font-black leading-none">🩸</span>
                </div>
              </div>
            </div>

            {/* Scan Prompt Tag */}
            <div className="flex items-center gap-1.5 text-xs text-rose-300 font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full mb-3">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Scan with phone camera to open</span>
            </div>

            {/* Event Description */}
            <p className="text-xs text-white/60 mb-4 px-2 leading-relaxed">
              Share with friends or Cal classmates to invite them to the Bancroft tabling event (Sept 21).
            </p>

            {/* Interactive Action Buttons */}
            <div className="w-full space-y-2">
              {/* Copy URL Button */}
              <button
                onClick={handleCopy}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span className="text-emerald-300">Invitation Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Invitation Link</span>
                  </>
                )}
              </button>

              {/* Save QR Image Button */}
              {qrDataUrl && (
                <button
                  onClick={handleDownloadQr}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 active:scale-98 transition border border-white/10 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-white/60" />
                  <span>Save QR Code Image</span>
                </button>
              )}
            </div>

            {/* Current URL preview (scannable) */}
            <div className="w-full mt-3 pt-3 border-t border-white/5">
              <div className="text-[10px] text-white/40 truncate font-mono bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/5 select-all">
                {currentUrl}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
