'use client'
import styles from './page.module.css'
import { useRef } from 'react';
import { WebTwain } from 'dwt/dist/types/WebTwain';
import dynamic from 'next/dynamic';

const DWT = dynamic(() => import("./components/DWT"), {
  ssr: false,
});

export default function Home() {
  const DWObject = useRef<WebTwain|undefined>(undefined)
  const onWebTWAINReady = (dwt:WebTwain)  => {
    DWObject.current = dwt;
  }
  const scan = async () => {
    if (DWObject.current) {
      const index = await DWObject.current.SelectSourceAsync();
      DWObject.current.AcquireImageAsync({SelectSourceByIndex:index});
    }
  }
  return (
    <main>
      <div>
        <h2>Document Scanner</h2>
        <button onClick={scan}>Scan</button>
        <div className={styles.documentScanner}>
          <DWT width="100%" height="100%" onWebTWAINReady={(dwt)=>onWebTWAINReady(dwt)}></DWT>
        </div>
      </div>
    </main>
  )
}
