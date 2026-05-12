import { Suspense } from "react";
import PaymentVerifyPage from "./PaymentVerifyPage";
import LoadingIphone from "@/components/LoadingIphone";


export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<LoadingIphone />}>
      <PaymentVerifyPage />
    </Suspense>
  );
}
