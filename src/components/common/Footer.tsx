'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-light py-2 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-2 text-left">
            <Link href="/" title="Ir al inicio">
              <img src="/assets/img/Foto_Empresa.webp" alt="Logo Empresa" className="logo-empresa" />
            </Link>
            <h5>Síguenos</h5>
            <ul className="list-unstyled d-flex gap-3">
              <li>
                <a href="https://www.facebook.com/profile.php?id=100067097141121" target="_blank">
                  <img src="/assets/img/Facebook_Logo.webp" alt="Facebook" className="icon" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/frenesipapeleria/" target="_blank">
                  <img src="/assets/img/Instagram_icon.webp" alt="Instagram" className="icon" />
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-3 text-center">
            <p className="footer-title">Más Información</p>
            <Link href="/acerca-de-nosotros" className="footer-link">Acerca de nosotros</Link>
            <Link href="#" className="footer-link">Más información sobre distribución</Link>
            <Link href="#" className="footer-link">Trabaja con nosotros</Link>
          </div>

          <div className="col-md-3 text-center footer-contacto">
            <p className="footer-title">Contacto</p>
            <p>Dirección: Santiago, Chile</p>
            <p>Teléfono: +56 2 1234 5678</p>
            <p>Correo: contacto@frenesipapeleria.cl</p>
            <p>Horario de atención: 10:00 a 19:00.</p>
          </div>

          <div className="col-md-3 text-right">
            <p className="footer-title">Ayuda</p>
            <Link href="/servicio-cliente" className="footer-link">Servicio al Cliente</Link>
            <Link href="#" className="footer-link">Preguntas Frecuentes</Link>
            <Link href="#" className="footer-link">Información de Despachos</Link>
            <Link href="#" className="footer-link">Formas de pago</Link>
            <Link href="#" className="footer-link">Cambios y Devoluciones</Link>
            <Link href="#" className="footer-link">Términos de Condiciones</Link>
            <Link href="#" className="footer-link">Políticas de Privacidad</Link>
          </div>
        </div>
        <p className="text-center mt-3">© 2026 Frenesí Papelería, Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}