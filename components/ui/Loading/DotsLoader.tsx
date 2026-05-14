export default function DotsLoader() {
  return (
    <div className="w-full h-[620px] md:h-[260px] flex items-center justify-center rounded shadow-xl shadow-blue-900/5 border border-slate-100 bg-white">
      <div className="flex flex-col items-center">
        <div className="dot-loader">
          <span />
          <span />
          <span />
        </div>
        <p className="text-slate-500 text-xs mt-3">لطفاً صبر کنید...</p>
      </div>

      <style jsx>{`
        .dot-loader {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dot-loader span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #64748b;
          animation: blink 1.4s infinite both;
        }
        .dot-loader span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot-loader span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
