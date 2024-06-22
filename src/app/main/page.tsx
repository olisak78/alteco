'use client';
import 'bootstrap/dist/css/bootstrap.css';
import BaseTable, { Column } from 'react-base-table';
import 'react-base-table/styles.css';
import '../forms.css';
import Button from 'react-bootstrap/esm/Button';
import { useCookies } from 'react-cookie';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/esm/Spinner';

const columns = [
  {
    key: 'name',
    title: 'Name',
    dataKey: 'name',
    width: 200,
    resizable: true,
    sortable: true,
    frozen: Column.FrozenDirection.LEFT,
  },
  {
    key: 'status',
    title: 'Status',
    dataKey: 'status',
    width: 150,
    resizable: true,
    sortable: true,
  },
  {
    key: 'lastUpdated',
    title: 'Last Updated',
    dataKey: 'lastUpdated',
    width: 200,
    align: Column.Alignment.CENTER,
    sortable: true,
  },
];

// Demo data for the table, until the functionality is not ready.
const data = [
  { id: 1, name: 'Demo 1', status: 'Working', lastUpdated: '21/06/2004' },
  { id: 2, name: 'Demo 1', status: 'Working', lastUpdated: '20/06/2004' },
  { id: 3, name: 'Demo 1', status: 'Working', lastUpdated: '19/06/2004' },
];

// Main page - not fully ready yet, the table is not done

export default function Main() {
  const [cookies, setCookie, removeCookie] = useCookies(['sessionId']);
  const [userName, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!cookies.sessionId)
      router.push('/login'); // if there is no Session Cookie, redirect to Login
    else {
      axios
        .post('/api/authenticate', {
          // If there is Session Cookie, check the Session storage
          sessionId: cookies.sessionId,
        })
        .then((session) => setUsername(session.data.fullName))
        .catch(() => router.push('/login')); // If session data is not found in Redis, then redirect to Login
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {
        // call for logout endpoint
        sessionId: cookies.sessionId,
      });
      removeCookie('sessionId'); // deleting Session cookie
      router.push('/login'); // redirecting to Login page after logout
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
  };

  // Call for populating the DB

  // const handlePopulate = async () => {
  //   try {
  //     await axios.post('/api/populateDatabase'); // Call for endpoint to populate the DB
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       console.log(error);
  //     }
  //   }
  // };

  return (
    <div className='maincontainer'>
      {userName ? (
        <>
          <div className='maintitle'>Welcome, {userName}</div>
          <div className='signout'>
            <Button variant='danger' onClick={handleLogout}>
              Log Out
            </Button>
          </div>

          {/* Button to populate DB, I used it, it works, the DB is populated, so currently I disabled the button */}

          {/* <div className='populate'>
            <Button variant='secondary' onClick={handlePopulate}>
              Populate DB
            </Button>
          </div> */}

          <BaseTable // The table is not ready yet, will be done in the next stage
            className='maintable'
            data={data}
            columns={columns}
            width={500}
            height={300}
          ></BaseTable>
        </>
      ) : (
        <div className='mainspinner'>
          <Spinner animation='border' />
        </div>
      )}
    </div>
  );
}
