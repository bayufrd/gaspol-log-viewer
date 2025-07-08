// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css'; // Mengimpor Bootstrap
import React from 'react';

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;