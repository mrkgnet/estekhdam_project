import { Suspense } from "react";
import PaymentVerifyPage from "./PaymentVerifyPage";
import LoadingDots from "./LoadingDots";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<LoadingDots />}>
      <PaymentVerifyPage />
    </Suspense>
  );
}
