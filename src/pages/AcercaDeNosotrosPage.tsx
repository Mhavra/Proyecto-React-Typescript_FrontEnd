'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Link } from 'react-router-dom';

export default function AcercaDeNosotrosPage() {
  return (
    <>
      <Header />
      <main className="main">
        <section className="about-hero">
          <div className="about-overlay text-center">
            <h1>Acerca de Nosotros</h1>
          </div>
        </section>
        <section className="about-split container">
          <div className="row align-items-starts">
            <div className="col-md-6">
              <h2>Quiénes somos</h2>
              <p>
                Frenesí papelería nace del amor por los detalles, los colores y aquellos productos que hacen más bonito el día a día. Nos inspira
                la papelería creativa, vintage, escolar y de personajes. Siempre estamos en la búsqueda de ofrecer productos que conecten con tu estilo y tu nostalgia.
              </p>
              <p>
                Queremos que cada producto sea una pequeña alegría: para organizarte, estudiar, regalar o simplemente darte un gusto.
              </p>
            </div>
            <div className="col-md-6 text-center">
              <img src="/assets/img/img_productos/papeleria_actu.jpg" className="img-about" />
            </div>
          </div>

          {/* Tarjetas de valores */}
          <div className="row about-cards">
            <div className="mb-4">
              <div className="about-cards text-center">
                <p>Agendas, Planners, Stickers, Accesorios y productos llenos de color para acompañarte cada día.</p>
                <p>Productos pensados para quienes disfrutan lo lindo, lo útil y lo especial.</p>
              </div>
            </div>
          </div>

          <div className="about-final text-center">
            <p className="about-quote">Más que papelería, pequeños detalles que inspiran.</p>
            <Link to="/" className="btn-productos">Ver productos</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}