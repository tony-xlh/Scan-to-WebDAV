'use client'
import styles from './page.module.css'
import { useRef, useState } from 'react';
import { WebTwain } from 'dwt/dist/types/WebTwain';
import Dynamsoft from 'dwt'; 
import dynamic from 'next/dynamic';
import { AuthType, createClient } from "webdav";

const DWT = dynamic(() => import("./components/DWT"), {
  ssr: false,
});

export default function Home() {
  const DWObject = useRef<WebTwain|undefined>(undefined);
  const [serverURL, setServerURL] = useState("http://127.0.0.1:8080");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onWebTWAINReady = (dwt:WebTwain)  => {
    DWObject.current = dwt;
  }
  const scan = async () => {
    if (DWObject.current) {
      if (Dynamsoft.Lib.env.bMobile) {
        DWObject.current.Addon.Camera.scanDocument();
      }else{
        const index = await DWObject.current.SelectSourceAsync();
        DWObject.current.AcquireImageAsync({SelectSourceByIndex:index});
      }
    }
  }

  const send = async () => {
    const client = createClient(serverURL, {
        authType: AuthType.Password,
        username: username,
        password: password
    });
    const files = await client.getDirectoryContents("./")
    console.log(files);
  }
  return (
    <main>
      <div>
        <h2>Document Scanner</h2>
        <div>
          <div>
            <label>
              WebDAV Server URL:
              <input type="text" value={serverURL} onChange={(e)=>setServerURL(e.target.value)}/>
            </label>
          </div>
          <div>
            <label>
              Username:
              <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            </label>
          </div>
          <div>
            <label>
              Password:
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </label>
          </div>
        </div>
        <button onClick={scan}>Scan</button>
        <button onClick={send}>Send</button>
        <div className={styles.documentScanner}>
          <DWT viewMode={{rows:2,cols:2}} width="100%" height="100%" onWebTWAINReady={(dwt)=>onWebTWAINReady(dwt)}></DWT>
        </div>
      </div>
    </main>
  )
}
