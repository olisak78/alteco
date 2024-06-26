'use client';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-base-table/styles.css';
import '../forms.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { useAtom } from 'jotai';
import { atomStatus } from '../atoms';
import { Status, Variant } from '../types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

export default function StatusDropdown() {
  const [currentStatus, setCurrentStatus] = useAtom(atomStatus);
  const [cookies, setCookie, removeCookie] = useCookies(['sessionId']);
  const router = useRouter();

  const handleStatusChange = async (st: string) => {
    setCurrentStatus(Status[st]);
    if (!cookies.sessionId)
      router.push('/login'); // if there is no Session Cookie, redirect to Login
    else {
      try {
        await axios.post('/api/state', {
          status: Status[st],
          sessionId: cookies.sessionId,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant={Variant[currentStatus]} id='dropdown-basic'>
        {Status[currentStatus]}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {Object.keys(Status).map(
          (st) =>
            isNaN(+st) && (
              <Dropdown.Item
                key={st}
                onClick={() => {
                  handleStatusChange(st);
                }}
              >
                {st}
              </Dropdown.Item>
            )
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
