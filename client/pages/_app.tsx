import "../styles/globals.css"
import type { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="h-screen font-serif bg-gray-900 text-white grid place-items-center">
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
