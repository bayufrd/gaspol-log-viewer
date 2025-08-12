import 'bootstrap/dist/css/bootstrap.min.css'; // Mengimpor Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
import Head from 'next/head'  

import React from 'react';

function MyApp({ Component, pageProps }) {  
    return (  
      <>  
        <Head>  
          <title>DT-LOGS Gaspoll App</title>  
        </Head>  
        <Component {...pageProps} />  
      </>  
    )  
  }  

export default MyApp;