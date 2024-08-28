import React from 'react';
import Planes from './Planes';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';


function PlanesPage() {
    return (
        <>
        <Header/>
        <div className="AdminPlansContainer">
            
            <Planes />
        </div>
        <Footer/>
        </>
    );
}

export default PlanesPage;