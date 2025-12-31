import React, { useState, useEffect } from 'react';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import "./Login.css";
import togglePasswordVisibility from '../Tools/toggleButton/tooglePassword';

const API_ENDPOINT = "/api/login";

function ClearErrorOnChange() {
  const { status, setStatus, values } = useFormikContext();

  useEffect(() => {
    if (status && status.error) {
      setStatus(null);
    }
  }, [values, setStatus, status]);

  return null;
}

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.accessToken && data.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.accessToken);
        setStatus({ success: "Login successful!" });
        navigate("/home");
      } else {
        setStatus({ error: data.message || "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus({ error: "Error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="formLogin">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Wrong Email address')
            .required('Required Field'),
          password: Yup.string()
            .min(7, "Minimum 7 chars")
            .required('Required Field'),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form id="loginForm">
            <ClearErrorOnChange />

            <div id="loginf" className="loginForm">
              {status && status.error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                  {status.error}
                </div>
              )}

              <h3>Login Page</h3>

              <Field
                type="email"
                name="email"
                id="email"
                placeholder="Email"
              />
              <ErrorMessage className="errors" name="email" component="div" />

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

              <ErrorMessage className="errors" name="password" component="div" />

              <button type="submit" disabled={isSubmitting}>
                Login
              </button>

              <span style={{ marginTop: "20px" }}>
                <Link to="/register">Register</Link> if you don’t have an account
              </span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
