import React, { Suspense } from "react";
import FetchMainSlider from "./FetchMainSlider";

function DotsLoader() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0ms]" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-500 animate-bounce [animation-delay:150ms]" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-500 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default function page() {
  return (
    <Suspense fallback={<DotsLoader />}>
      <FetchMainSlider />
    </Suspense>
  );
}
