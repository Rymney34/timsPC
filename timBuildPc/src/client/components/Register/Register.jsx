import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from "react-router-dom";
import './Register.css';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import togglePasswordVisibility from '../Tools/toggleButton/tooglePassword';
import axios from 'axios';
import * as Yup from 'yup';

const API_ENDPOINT = "/api/register";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await axios.post(API_ENDPOINT, values);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setStatus({ error: "Registration failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="regWarpper">
      <div className="regFormInner">
        <Formik
          initialValues={{
            firstName: '',
            email: '',
            password: '',
          }}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .required('Required Field'),
            email: Yup.string()
              .email('Wrong Email address')
              .required('Required Field'),
            password: Yup.string()
              .min(7, "Minimum 7 characters")
              .test(
                "contains-number",
                "Password must include a number",
                value => /\d/.test(value)
              )
              .required('Required Field'),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="regForm">
              {status && status.error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                  {status.error}
                </div>
              )}

              <h3>Account SignUp</h3>

              <Field
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
              />
              <ErrorMessage name="firstName" component="div" />

              <Field
                type="email"
                name="email"
                id="email"
                placeholder="Email"
              />
              <ErrorMessage name="email" component="div" />

              <div className="password-container">
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="Password"
                />
                <span
                  className="eye-icon"
                  onClick={() =>
                    togglePasswordVisibility(setShowPassword)
                  }
                >
                  {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>

              <ErrorMessage name="password" component="div" />

              <button type="submit" disabled={isSubmitting}>
                Register
              </button>

              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;
