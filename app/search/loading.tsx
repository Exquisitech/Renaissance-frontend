export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-32 bg-muted rounded"></div>
          <div className="h-10 w-full max-w-md bg-muted rounded"></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
          <div className="space-y-4 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
