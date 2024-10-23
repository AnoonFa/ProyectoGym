  import React from 'react';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import Relleno from '../../../components/Relleno/Relleno';

function RutinesPage() {
  return (
    <>
    <Header/>
    <Relleno/>
    <section className="bg-background py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 lg:space-y-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
            Planes del Gimnasio
          </h2>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6 lg:gap-8">
            <Button>
              <FilePenIcon className="mr-2 h-5 w-5" />
              Modificar
            </Button>
            <Button variant="secondary">
              <PlusIcon className="mr-2 h-5 w-5" />
              Añadir
            </Button>
            <Button variant="outline">
              <EyeIcon className="mr-2 h-5 w-5" />
              Ver Rutinas
            </Button>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  )
}

export default RutinesPage;