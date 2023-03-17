import type { AppProps } from "next/app";
import 'tailwindcss/tailwind.css'
import 'stream-chat-react/dist/css/v2/index.css';
import "../styles/styles.css";
import "../styles/layout.css";

import '../styles/index.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
