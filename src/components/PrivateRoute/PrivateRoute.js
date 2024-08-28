import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAdmin, ...rest }) => {
    return isAdmin ? <Component {...rest} /> : <Navigate to="../../pages/Auth/LoginPage" />;
};

export default PrivateRoute;
