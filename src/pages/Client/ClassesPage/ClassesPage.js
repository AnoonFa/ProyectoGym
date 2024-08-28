import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import CalendarClases from '../../../components/VerClases/VerClases';

export default function ClasesPage (){
return(

    <div>
        <Header />
        <CalendarClases />
        <Footer />
    </div>
)


}