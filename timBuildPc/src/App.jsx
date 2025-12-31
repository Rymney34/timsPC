
import React, { Suspense, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
// import BookingForm from "./client/components/bookingForm/bookingForm.js";
// import BookingTable from "./client/components/bookingTable/bookingTable.js";
// import { SearchProvider } from './client/components/context/context.js';
// import Main from "./client/components/main/main.js";
// import ServiceDetails from "./client/components/serviceDetails/serviceDetails.js";
// import SingleBooking from "./client/components/singleBooking/singleBooking.js";
import { AuthProvider } from './client/components/Tools/authFront/authContext.jsx';

// import BusinessInterface from "./client/components/businessInterface/businessInterface.js";
// import ErrorBoundary from './client/components/errorBoundary/ErrorBoundary.js';
// import Page404 from "./client/components/errorBoundary/Page404.js";
// import ServiceBookings from "./client/components/serviceBookings/serviceBookings.js";
// import ServiceTable from "./client/components/serviceTable/serviceTable.js";
import Spinner from "./client/components/spinner/Spinner.jsx";
import LandingPage from './client/components/landingPage/landingPage.jsx';
// import ProtectedRoute from "./client/components/Tools/protectedRoute/protected.route.js";

const Login = React.lazy(() =>
  import("./client/components/Login/Login.jsx")
);
const Register = React.lazy(() =>
  import("./client/components/Register/Register.jsx")
);
function App() {

   const [data, setData] = useState()
  return (
    <AuthProvider>
    <Router>
      <div className="App">
          <title>BookFlow</title>
          <link rel="icon" type="image/x-icon" href="/images/favicon.ico"></link>
          <link rel="preconnect" href="https://fonts.googleapis.com"></link>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
          <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet"></link>
          <Suspense fallback={<Spinner/>}>
            <Routes>
              <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />
                <Route
                
                    path="/login"
                    element={<Login/>}
                />
                <Route
                      path="/register"
                      element={<Register/>}
                  />
                <Route
                    path="/landingPage"
                    element={<LandingPage/>}
                />
              {/* <Route element ={<ProtectedRoute/>}>
                  <Route
                    path="/home"
                    element={ <Main/>  }
                  />
                  <Route
                    path="/serviceDetails/:singleService"
                    element={<ServiceDetails/>}
                  />
                  <Route
                    path="/BookingTable"
                    element={<ErrorBoundary><SearchProvider> <BookingTable/></SearchProvider></ErrorBoundary> }
                  />
                  
                  <Route
                    path="/bookingForm"
                    element={<ErrorBoundary><BookingForm/></ErrorBoundary>}
                  />
                  <Route
                    path="/serviceTable"
                    element={<ErrorBoundary><ServiceTable/></ErrorBoundary>}
                  />
                  <Route
                    path="/bookingsService"
                    element={<ErrorBoundary><ServiceBookings/></ErrorBoundary>}
                  />
                  <Route
                    path="/singleBooking/:bookingDetails"
                    element={<ErrorBoundary><SingleBooking/></ErrorBoundary>}
                  />
                  <Route
                    path="/businessInteface"
                    element={<ErrorBoundary><BusinessInterface/></ErrorBoundary>}
                  />
                  <Route
                  path='*'
                  element={<Page404/>}
                  />
              </Route> */}
                
            </Routes>
          </Suspense>
      </div>
    </Router>
</AuthProvider>    
  );
}


export default App;
