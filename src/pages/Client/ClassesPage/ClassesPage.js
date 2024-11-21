import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import CalendarClases from '../../../components/Clases/VerClases/VerClases';
import Relleno from '../../../components/Relleno/Relleno';


export default function ClasesPage (){
return(

    <div>
        <Header />
        <Relleno/>
        <CalendarClases />
        <Footer />
    </div>
    
)}