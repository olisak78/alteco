'use client';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-base-table/styles.css';
import './forms.css';
import React, { useState, useEffect } from 'react';
import BaseTable, { Column, SortOrder } from 'react-base-table';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import { Employee, Status } from './types';
import moment from 'moment';
import StatusDropdown from './elements/dropdown';
import TableFilter from './elements/filter';
import { useAtom } from 'jotai';
import { atomFilterText, atomFilterType } from './atoms';
import Alert from 'react-bootstrap/esm/Alert';
import { io } from 'socket.io-client';
import config from './config/config';

const CHUNK_SIZE = 50;

export default function Main() {
  const [data, setData] = useState<Employee[]>([]); // Data for the Table
  const [isLoading, setIsLoading] = useState(false); // Is Table loading
  const [currentPage, setCurrentPage] = useState(0); // For infinite scrolling
  const [cookies, , removeCookie] = useCookies(['sessionId']); // Cookies - for checking the SessionId Cookie
  const [userName, setUsername] = useState(''); // Username of currently logged user
  const [filterType] = useAtom(atomFilterType);
  const [filterText] = useAtom(atomFilterText);
  const [sortBy, setSortBy] = useState<{ key: string; order: SortOrder }>({
    key: 'lastUpdated',
    order: 'desc',
  });
  const [alertText, setAlertText] = useState(''); // Alert text - used for alerts from Socket Server
  const [show, setShow] = useState(false); // State of the Alert
  const socket = io(`http://localhost:${config.socket.webSocketPort}`);
  const router = useRouter();

  useEffect(() => {
    socket.on('updateEstablished', (message) => {
      // setShow(true);    // Uncomment this line if you wish to display alerts from Socket Server
      setAlertText(`${message}`);
    });
  }, []);

  useEffect(() => {
    if (alertText !== '') {
      const toUpdate = JSON.parse(alertText);
      setData(
        // Updating the Table data after Socket server sends alert about some user's status change
        [...data].map((user) =>
          toUpdate.id && user._id === toUpdate.id
            ? {
                ...user,
                lastUpdate: toUpdate.lastUpdate,
                status: +toUpdate.status,
              }
            : user
        )
      );
    }
  }, [alertText]);

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
    setUsername(''); // Reset username to show the big spinner while logout process is performed
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

  useEffect(() => {
    // Logic of infinite scrolling lazy loading table
    const fetchData = async () => {
      setIsLoading(true);
      fetchNextData(currentPage, CHUNK_SIZE)
        .then((newData) => {
          setData([...data, ...newData]);
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    };
    fetchData();
  }, [currentPage]);

  // Function to fetch next data chunk
  const fetchNextData = async (page: number, size: number): Promise<any> => {
    const response = await fetch(`/api/employees?page=${page}&size=${size}`);
    return response.json();
  };

  //   Table columns
  const columns = [
    {
      key: 'fullName',
      title: 'Name',
      dataKey: 'fullName',
      width: 200,
      resizable: true,
      sortable: true,
      frozen: Column.FrozenDirection.LEFT,
    },
    {
      key: 'email',
      title: 'Email',
      dataKey: 'email',
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
      cellRenderer: ({ cellData }: any) => <>{Status[cellData]}</>,
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      dataKey: 'lastUpdated',
      width: 250,
      align: Column.Alignment.CENTER,
      resizable: true,
      sortable: true,
      cellRenderer: ({ cellData }: any) => (
        <>{moment(cellData).format('MMMM Do YYYY, h:mm a')}</>
      ),
    },
  ];

  const onEndReached = () => {
    // When scrolled down to end of table
    if (!isLoading) {
      setCurrentPage(currentPage + 1); // Load next chunk
    }
  };

  const handleColumnSort = (keyOrder: { key: any; order: any }) => {
    const { key, order } = keyOrder;
    setSortBy({ key, order });
    const ordered = order === 'asc' ? 1 : -1;
    setData([
      ...data.sort((a, b) => {
        switch (key) {
          case 'lastUpdated':
            const x = moment(a.lastUpdated);
            const y = moment(b.lastUpdated);
            return x < y ? ordered : -ordered;
          case 'status':
            return a.status < b.status ? ordered : -ordered;
          case 'fullName':
            return a.fullName < b.fullName ? ordered : -ordered;
          case 'email':
            return a.email < b.email ? ordered : -ordered;
          default:
            return 0;
        }
      }),
    ]);
  };

  const filterData = (
    data: {
      fullName: string;
      email: string;
      status: Status;
      lastUpdated: string;
    }[]
  ) => {
    let filteredData = [...data];
    if (filterType === 'Name') {
      filteredData = filteredData.filter((employee) =>
        employee.fullName?.toLowerCase().includes(filterText.toLowerCase())
      );
    } else if (filterType === 'Email') {
      filteredData = filteredData.filter((employee) =>
        employee.email.toLowerCase().includes(filterText.toLowerCase())
      );
    } else if (
      filterType === 'Status' &&
      Object.keys(Status).includes(filterText)
    ) {
      filteredData = filteredData.filter(
        (employee) => Status[employee.status] === filterText
      );
    }

    return filteredData;
  };
  console.log(data);
  return (
    <div className='maincontainer'>
      {userName ? (
        <>
          <div className='mainalert'>
            <Alert
              show={show}
              key='warning'
              variant='warning'
              dismissible
              onClose={() => setShow(false)}
            >
              {alertText}
            </Alert>
          </div>
          <div className='maintitle'>Welcome, {userName}</div>
          <div className='signout'>
            <Button variant='danger' onClick={handleLogout}>
              Log Out
            </Button>
          </div>
          <div className='loadingspinner'>
            <Spinner animation='border' hidden={!isLoading} />
          </div>

          <div className='mainstatustitle'>My Status:</div>
          <div className='mainstatus'>
            <StatusDropdown />
          </div>
          <div className='mainfilter'>
            <TableFilter />
          </div>

          <BaseTable
            className='maintable'
            data={filterData(data)}
            columns={columns}
            width={800}
            height={350}
            onEndReachedThreshold={0.8} // Adjust threshold as needed
            onEndReached={onEndReached}
            sortBy={sortBy}
            onColumnSort={handleColumnSort}
          />
        </>
      ) : (
        <div className='mainspinner'>
          <Spinner animation='border' />
        </div>
      )}
    </div>
  );
}
