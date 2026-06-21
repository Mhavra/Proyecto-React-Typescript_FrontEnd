'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ValidacionForm from '@/components/consultas/Validacion-Form';

export default function ServicioClientePage() {
  return (
    <>
      <Header />
      <main className="main formulario">
        <section className="formulario-tittle">
          <div className="about-overlay">
            <h1 className="servinfo">Servicio al cliente</h1>
          </div>
        </section>
        <div className="servinfo">
          <p>
            Bienvenido a la sección de Servicio al cliente, donde podrá consultar sobre sus inquietudes o dudas
            en el formulario siguiente o también puede contactarnos desde nuestras redes sociales.
          </p>
        </div>

        {/* Aquí se renderiza el formulario con validación */}
        <ValidacionForm />
      </main>
      <Footer />
    </>
  );
}
