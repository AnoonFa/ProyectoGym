import React from 'react';
import Planes from './Planes';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Relleno from '../../components/Relleno/Relleno';


function PlanesPage() {
    return (
        <>
        <Header/>
        <Relleno/>
        <div className="AdminPlansContainer">
            
            <Planes />
        </div>
        <Footer/>
        </>
    );
}

export default PlanesPage;