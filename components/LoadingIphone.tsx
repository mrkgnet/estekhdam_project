"use client";

export default function LoadingDots() {
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="flex gap-2 mb-3">
        <span className="dot" />
        <span className="dot delay-1" />
        <span className="dot delay-2" />
      </div>

      <p className="text-gray-600 text-sm">
        لطفاً صبر کنید...
      </p>

      <style jsx>{`
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #555;
          animation: blink 1.4s infinite both;
        }

        .delay-1 {
          animation-delay: 0.2s;
        }

        .delay-2 {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0% {
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
