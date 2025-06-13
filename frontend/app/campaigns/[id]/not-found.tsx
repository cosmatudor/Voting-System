import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 text-slate-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Vote Not Found</h1>
        <p className="mt-2 text-slate-400">The vote you're looking for doesn't exist or has been removed.</p>
        <Link href="/campaigns">
          <Button className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Votes
          </Button>
        </Link>
      </div>
    </div>
  )
}

