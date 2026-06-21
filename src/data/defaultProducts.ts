/*
Aqui se define un array de productos por defecto, cada uno con sus propiedades 
como id, nombre, categoria, precio, imagen y stock. 
Este array se puede utilizar para mostrar los productos en la tienda por default.
*/
import { Producto } from '@/interfaces';

export const defaultProducts: Producto[] = [
  { id: 1, nombre: 'Esquelario Frutillita', categoria: 'Vintage', precio: 3500, imagen: '/assets/img/img_productos/Vintage/esquelariofrutillita.png', stock: 10 },
  { id: 2, nombre: 'Agenda Snoopy | Año 2005', categoria: 'Vintage', precio: 23000, imagen: '/assets/img/img_productos/Vintage/agenda snoopy 2005.png', stock: 5 },
  { id: 3, nombre: 'Mini Esquelas Antonia', categoria: 'Vintage', precio: 500, imagen: '/assets/img/img_productos/Vintage/EsquelasAntonia.png', stock: 20 },
  { id: 4, nombre: 'Esquelas Hannah Montana', categoria: 'Vintage', precio: 4500, imagen: '/assets/img/img_productos/Vintage/esquelashannahmontana.png', stock: 8 },
  { id: 5, nombre: 'Libreta Sarah Kay', categoria: 'Vintage', precio: 4000, imagen: '/assets/img/img_productos/Vintage/sarahkaylibreta.png', stock: 12 },
  { id: 6, nombre: 'Stickers Snoopy Village', categoria: 'Vintage', precio: 2500, imagen: '/assets/img/img_productos/Vintage/stickers snoopy.png', stock: 15 },
  { id: 7, nombre: 'Mix productos (5 pc)', categoria: 'Nuevos', precio: 5000, imagen: '/assets/img/img_productos/img_productos_1.jpg', stock: 6 },
  { id: 8, nombre: 'Lámina con Post-it CoolNotes', categoria: 'Nuevos', precio: 1500, imagen: '/assets/img/img_productos/img_productos_2.jpg', stock: 10 },
  { id: 9, nombre: 'Mini Esquelas Antonia', categoria: 'Nuevos', precio: 600, imagen: '/assets/img/img_productos/img_productos_3.jpg', stock: 25 },
  { id: 10, nombre: '30 Lápices tiralíneas', categoria: 'Nuevos', precio: 6500, imagen: '/assets/img/img_productos/img_productos_4.jpg', stock: 4 },
  { id: 11, nombre: 'Esquelas Hannah Montana', categoria: 'Nuevos', precio: 3000, imagen: '/assets/img/img_productos/img_productos_5.jpg', stock: 7 },
  { id: 12, nombre: 'Sacapuntas de Cactus', categoria: 'Nuevos', precio: 1000, imagen: '/assets/img/img_productos/img_productos_6.jpg', stock: 30 },
  { id: 13, nombre: 'Marcadores Filgo', categoria: 'Nuevos', precio: 2500, imagen: '/assets/img/img_productos/img_productos_7.jpg', stock: 9 },
  { id: 14, nombre: 'Papel estilo antiguo A4 10 hojas', categoria: 'Nuevos', precio: 9990, imagen: '/assets/img/img_productos/Vintage/vintage_5.jpeg', stock: 3 },
  { id: 15, nombre: 'Libreta de cuero 100 hojas', categoria: 'Nuevos', precio: 10990, imagen: '/assets/img/img_productos/Vintage/vintage_2.jpeg', stock: 8 },
  { id: 16, nombre: 'Libreta de cuero 150 hojas', categoria: 'Nuevos', precio: 15990, imagen: '/assets/img/img_productos/Vintage/vintage_3.jpeg', stock: 6 },
  { id: 17, nombre: 'Libreta vintage Genius 200 hojas', categoria: 'Nuevos', precio: 19990, imagen: '/assets/img/img_productos/Vintage/vintage_4.jpeg', stock: 4 },
  { id: 18, nombre: 'Libreta azul vintage, hojas estilo antiguo, 260 hojas', categoria: 'Nuevos', precio: 22990, imagen: '/assets/img/img_productos/Vintage/vintage_6.jpeg', stock: 2 },
  { id: 19, nombre: 'Libreta estilo vintage de cuero sintetico 100 hojas', categoria: 'Nuevos', precio: 9990, imagen: '/assets/img/img_productos/Vintage/vintage_7.jpeg', stock: 5 },
  { id: 20, nombre: 'Libreta vintage de cuero cafe, 180 hojas estilo antiguo', categoria: 'Nuevos', precio: 17990, imagen: '/assets/img/img_productos/Vintage/vintage_8.jpeg', stock: 3 },
];