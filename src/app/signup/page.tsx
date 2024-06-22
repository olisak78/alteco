'use client';
import Card from 'react-bootstrap/esm/Card';
import 'bootstrap/dist/css/bootstrap.css';
import '../forms.css';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Alert from 'react-bootstrap/esm/Alert';
import { useRouter } from 'next/navigation';
import Spinner from 'react-bootstrap/esm/Spinner';
import { encryptPassword } from '../lib/encrypt';
import { Status } from '../types';
import moment from 'moment';

// Signup page

export default function Signup() {
  const [show, setShow] = useState(false); // State of the Alert
  const [loading, setLoading] = useState(false); // State of the Spinner
  const [alertType, setAlertType] = useState(''); // Alert type (background color)
  const [alertText, setAlertText] = useState(''); // Alert text
  const [signupData, setSignupData] = useState({
    // Signup Form data
    fullName: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (signupData.password !== signupData.repeatPassword) {
      // Validate that password is equal to repeat password
      setShow(true);
      setAlertType('warning');
      setAlertText(`Passwords do not match!`);
      return;
    }
    setLoading(true);

    try {
      const newUser = {
        // Put together the user data
        fullName: signupData.fullName,
        email: signupData.email,
        status: Status.Working,
        password: encryptPassword(signupData.password), // Encrypting the password!
        lastUpdated: moment().format(),
      };
      const response = await axios.post('/api/signup', newUser); // Calling the Signup endpoint. NOTE: After Signup, user is NOT logged in automatically
      if (response && response.status === 201 && response.data) {
        setShow(true);
        setAlertType('success'); // Showing success Alert
        setAlertText(`Registration success!`);
        setSignupData({
          fullName: '', // Resetting the Signup form
          email: '',
          password: '',
          repeatPassword: '',
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        // Showing error Alert
        setShow(true);
        setAlertType('danger');
        setAlertText(`${error.response?.data}`);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleChange = ({
    // Handle the Form input
    target: { name, value },
  }: {
    target: { name: string; value: string };
  }) => {
    setSignupData({ ...signupData, [name]: value });
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
      <div className='signupcontainer'>
        <Card border='light' className='signupform'>
          <Card.Body>
            <div className='bodycontainer'>
              <Card.Title className='cardtitle'>Create Your Account</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3' controlId='formFullName'>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type='name'
                    placeholder='Enter Full Name'
                    name='fullName'
                    onChange={handleChange}
                    required
                    value={signupData.fullName}
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter email'
                    name='email'
                    onChange={handleChange}
                    required
                    value={signupData.email}
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
                    value={signupData.password}
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formRepeatPassword'>
                  <Form.Control
                    type='password'
                    placeholder='Repeat Password'
                    name='repeatPassword'
                    onChange={handleChange}
                    required
                    value={signupData.repeatPassword}
                  />
                </Form.Group>
                <div className='signbuttoncontainer'>
                  <Button variant='primary' type='submit' disabled={loading}>
                    {loading ? (
                      <Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true'
                      />
                    ) : (
                      'Register'
                    )}
                  </Button>
                  <p className='signupmiddle'>
                    Already have an account?{' '}
                    <span
                      className='signin'
                      onClick={() => router.push('/login')}
                    >
                      Sign In
                    </span>
                  </p>
                </div>
              </Form>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
