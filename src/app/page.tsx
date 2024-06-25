'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export default function Home() {
  const router = useRouter();
  const socket = io('http://localhost:5000');

  useEffect(() => {
    console.log(`START CLIENT!`);
    socket.on('hello', (arg) => {
      console.log(arg);
    });
    socket.on('myevent', (data) => {
      console.log(`SERVER EVENT! ${data}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  router.push('/main'); // Redirecting to the Main page
}
