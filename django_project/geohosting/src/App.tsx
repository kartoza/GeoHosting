import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './redux/store';
import './assets/styles/index.css';
import TokenValidator from './components/TokenValidator/TokenValidator';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage/DashboardPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CheckoutConfiguration = lazy(() => import('./pages/CheckoutPage/CheckoutConfiguration'));
const CheckoutDeployment = lazy(() => import('./pages/CheckoutPage/CheckoutDeployment'));
const CheckoutFinish = lazy(() => import('./pages/CheckoutPage/CheckoutFinish'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage/ResetPasswordPage'));
const OverviewPage = lazy(() => import('./pages/OverviewPage/OverviewPage'));

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<LoadingSpinner/>}>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/reset-password" element={<ResetPasswordPage/>}/>
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <DashboardPage/>
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/:id/configuration"
              element={
                <PrivateRoute>
                  <CheckoutConfiguration/>
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/:id/deployment"
              element={
                <PrivateRoute>
                  <CheckoutDeployment/>
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/:id/finish"
              element={
                <PrivateRoute>
                  <CheckoutFinish/>
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage/>
                </PrivateRoute>
              }
            />
            <Route path="/app/:appName" element={<OverviewPage/>}/>
          </Routes>
        </Suspense>
        <ToastContainer hideProgressBar={true} newestOnTop={true}/>
        <TokenValidator/>
      </Router>
    </Provider>
  );
};

export default App;
