import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
  )
}


// import SkeletonCard from "@/components/SkeletonCard";

// export default function Loading() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       <SkeletonCard />
//       <SkeletonCard />
//       <SkeletonCard />
//     </div>
//   );
// }