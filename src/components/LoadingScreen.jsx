export default function LoadingScreen() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-sm text-brown dark:text-dark-text">Loading...</p>
      </div>
    </div>
  )
}
