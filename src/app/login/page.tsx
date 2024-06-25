'use client';
import Card from 'react-bootstrap/esm/Card';
import 'bootstrap/dist/css/bootstrap.css';
import '../forms.css';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Alert from 'react-bootstrap/esm/Alert';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useCookies } from 'react-cookie';
import { useSetAtom } from 'jotai';
import { atomStatus } from '../atoms';

// Login page

export default function Login() {
  const [show, setShow] = useState(false); // State of the Alert
  const [loading, setLoading] = useState(false); // State of the Spinner
  const [alertType, setAlertType] = useState(''); // Type of the Alert (changes the background Color)
  const [alertText, setAlertText] = useState(''); // Text of the Alert
  const setStatus = useSetAtom(atomStatus);
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    // State of Login Form data
    email: '',
    password: '',
  });
  const [cookies, setCookie, removeCookie] = useCookies(['sessionId']); // Session Cookie

  useEffect(() => {
    if (cookies.sessionId) {
      // If Session Cookie exists, need to check that the session hasn't yet expired
      axios
        .post('/api/authenticate', {
          // Authenticate the user, which means check his session in Redis
          sessionId: cookies.sessionId,
        })
        .then(() => router.push('/main')) // If user is authenticated, then redirect to Main page
        .catch((error) => console.log(error));
    }
  }, []);

  const handleSubmit = async (e: any) => {
    // Submitting the Login Form
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/login', loginData); // Call the Login endpoint
      if (response && response.status === 200 && response.data.length > 0) {
        setShow(true); // Show Alert for successfull Login
        setAlertType('success');
        setAlertText(`${response.data[0].fullName} logged in successfully!`);
        setStatus(response.data[0].status || 0);
        setCookie('sessionId', response.data[0]._id); // Store Session cookie
        router.push('/main'); // Redirect to Main page
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setShow(true); // Show Alert for failed login
        setAlertType('danger');
        setAlertText(`${error.response?.data}`);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleChange = ({
    // Handle Login form input
    target: { name, value },
  }: {
    target: { name: string; value: string };
  }) => {
    setLoginData({ ...loginData, [name]: value });
  };
  return (
    <div>
      <div className='alertcontainer'>
        <Alert
          className='alert'
          show={show}
          key={alertType}
          variant={alertType}
          dismissible
          onClose={() => setShow(false)}
        >
          {alertText}
        </Alert>
      </div>
      <div className='logincontainer'>
        <Card border='light' className='loginform'>
          <Card.Body>
            <div className='bodycontainer'>
              <Card.Title className='cardtitle'>Login</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter email'
                    name='email'
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter Password'
                    name='password'
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <div className='buttoncontainer'>
                  <Button
                    variant='primary'
                    className='loginsubmit'
                    type='submit'
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true'
                      />
                    ) : (
                      'Login'
                    )}
                  </Button>
                  <p className='middle'>Don&apos;t have an account yet?</p>
                </div>
              </Form>
              <div className='signupbuttoncontainer'>
                <Button
                  variant='primary'
                  className='signupbutton'
                  onClick={() => router.push('/signup')}
                >
                  Register
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
