import '../src/app/globals.css';
import Head from 'next/head'

import React from 'react';

function MyApp({ Component, pageProps }) {  
    return (  
      <>  
        <Head>
          <title>DT-LOGS Gaspoll App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </Head>
        <Component {...pageProps} />  
      </>  
    )  
  }  

export default MyApp;