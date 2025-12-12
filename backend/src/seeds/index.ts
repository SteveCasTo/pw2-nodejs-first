import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { Usuario } from '../models/usuario.model';
import { Privilegio } from '../models/privilegio.model';
import { UsuarioPrivilegio } from '../models/usuarioPrivilegio.model';
import { Ciclo } from '../models/ciclo.model';
import { RangoEdad } from '../models/rangoEdad.model';
import { Categoria } from '../models/categoria.model';
import { Subcategoria } from '../models/subcategoria.model';
import { NivelDificultad } from '../models/nivelDificultad.model';
import { EstadoPregunta } from '../models/estadoPregunta.model';
import { Contenido } from '../models/contenido.model';
import { Pregunta } from '../models/pregunta.model';
import { OpcionPregunta } from '../models/opcionPregunta.model';
import { ParEmparejamiento } from '../models/parEmparejamiento.model';
import { RespuestaModelo } from '../models/respuestaModelo.model';
import { Examen } from '../models/examen.model';
import { ExamenPregunta } from '../models/examenPregunta.model';
import { IntentoExamen } from '../models/intentoExamen.model';
import { RespuestaSeleccion } from '../models/respuestaSeleccion.model';
import { RespuestaDesarrollo } from '../models/respuestaDesarrollo.model';
import { RevisionPregunta } from '../models/revisionPregunta.model';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI no está definida en .env');
    }

    console.warn('Conectando a MongoDB...');
    await mongoose.connect(mongoUri);
    console.warn('Conectado a MongoDB\n');

    console.warn('Creando privilegios por defecto...');
    const privilegiosData = [
      {
        nombre_privilegio: 'superadmin',
        descripcion: 'Administrador con acceso total al sistema',
      },
      {
        nombre_privilegio: 'editor',
        descripcion: 'Puede crear y editar contenido',
      },
      {
        nombre_privilegio: 'organizador',
        descripcion: 'Puede organizar eventos y actividades',
      },
      {
        nombre_privilegio: 'estudiante',
        descripcion: 'Usuario estudiante con acceso básico',
      },
    ];

    const privilegios = [];
    for (const privData of privilegiosData) {
      const existing = await Privilegio.findOne({
        nombre_privilegio: privData.nombre_privilegio,
      });
      if (existing) {
        console.warn(`${privData.nombre_privilegio}: Ya existe`);
        privilegios.push(existing);
      } else {
        const priv = await Privilegio.create(privData);
        console.warn(`${privData.nombre_privilegio}: Creado`);
        privilegios.push(priv);
      }
    }

    console.warn('\nCreando usuario superadmin...');
    const adminEmail = 'admin@sistema.com';
    const adminPassword = 'Admin123!@#';

    let adminUser = await Usuario.findOne({
      correo_electronico: adminEmail,
    });

    if (adminUser) {
      console.warn(`${adminEmail}: Ya existe`);
    } else {
      adminUser = await Usuario.create({
        correo_electronico: adminEmail,
        password: adminPassword,
        nombre: 'Super Admin',
      });
      console.warn(`${adminEmail}: Creado`);
    }

    console.warn('\nCreando usuario editor...');
    const editorEmail = 'editor@sistema.com';
    const editorPassword = 'Editor123!@#';

    let editorUser = await Usuario.findOne({
      correo_electronico: editorEmail,
    });

    if (editorUser) {
      console.warn(`${editorEmail}: Ya existe`);
    } else {
      editorUser = await Usuario.create({
        correo_electronico: editorEmail,
        password: editorPassword,
        nombre: 'Usuario Editor',
        creado_por: adminUser._id,
      });
      console.warn(`${editorEmail}: Creado`);
    }

    console.warn('\nCreando usuario organizador...');
    const organizadorEmail = 'organizador@sistema.com';
    const organizadorPassword = 'Organizador123!@#';

    let organizadorUser = await Usuario.findOne({
      correo_electronico: organizadorEmail,
    });

    if (organizadorUser) {
      console.warn(`${organizadorEmail}: Ya existe`);
    } else {
      organizadorUser = await Usuario.create({
        correo_electronico: organizadorEmail,
        password: organizadorPassword,
        nombre: 'Usuario Organizador',
        creado_por: adminUser._id,
      });
      console.warn(`${organizadorEmail}: Creado`);
    }

    console.warn('\nCreando usuario estudiante...');
    const estudianteEmail = 'estudiante@sistema.com';
    const estudiantePassword = 'Estudiante123!@#';

    let estudianteUser = await Usuario.findOne({
      correo_electronico: estudianteEmail,
    });

    if (estudianteUser) {
      console.warn(`${estudianteEmail}: Ya existe`);
    } else {
      estudianteUser = await Usuario.create({
        correo_electronico: estudianteEmail,
        password: estudiantePassword,
        nombre: 'Usuario Estudiante',
        creado_por: adminUser._id,
      });
      console.warn(`${estudianteEmail}: Creado`);
    }

    console.warn('\nAsignando privilegios...');
    const superadminPriv = privilegios.find(
      p => p.nombre_privilegio === 'superadmin'
    );
    const editorPriv = privilegios.find(p => p.nombre_privilegio === 'editor');
    const organizadorPriv = privilegios.find(
      p => p.nombre_privilegio === 'organizador'
    );
    const estudiantePriv = privilegios.find(
      p => p.nombre_privilegio === 'estudiante'
    );

    if (!superadminPriv || !editorPriv || !organizadorPriv || !estudiantePriv) {
      throw new Error('Algún privilegio no fue encontrado');
    }

    const existingAdmin = await UsuarioPrivilegio.findOne({
      id_usuario: adminUser._id,
      id_privilegio: superadminPriv._id,
    });

    if (!existingAdmin) {
      await UsuarioPrivilegio.create({
        id_usuario: adminUser._id,
        id_privilegio: superadminPriv._id,
      });
      console.warn('Privilegio superadmin asignado');
    } else {
      console.warn('Privilegio superadmin ya asignado');
    }

    const existingEditor = await UsuarioPrivilegio.findOne({
      id_usuario: editorUser._id,
      id_privilegio: editorPriv._id,
    });

    if (!existingEditor) {
      await UsuarioPrivilegio.create({
        id_usuario: editorUser._id,
        id_privilegio: editorPriv._id,
        asignado_por: adminUser._id,
      });
      console.warn('Privilegio editor asignado');
    } else {
      console.warn('Privilegio editor ya asignado');
    }

    const existingOrganizador = await UsuarioPrivilegio.findOne({
      id_usuario: organizadorUser._id,
      id_privilegio: organizadorPriv._id,
    });

    if (!existingOrganizador) {
      await UsuarioPrivilegio.create({
        id_usuario: organizadorUser._id,
        id_privilegio: organizadorPriv._id,
        asignado_por: adminUser._id,
      });
      console.warn('Privilegio organizador asignado');
    } else {
      console.warn('Privilegio organizador ya asignado');
    }

    const existingEstudiante = await UsuarioPrivilegio.findOne({
      id_usuario: estudianteUser._id,
      id_privilegio: estudiantePriv._id,
    });

    if (!existingEstudiante) {
      await UsuarioPrivilegio.create({
        id_usuario: estudianteUser._id,
        id_privilegio: estudiantePriv._id,
        asignado_por: adminUser._id,
      });
      console.warn('Privilegio estudiante asignado');
    } else {
      console.warn('Privilegio estudiante ya asignado');
    }

    console.warn('\nCreando rangos de edad...');
    const rangosData = [
      { nombre_rango: '3-5 años', edad_minima: 3, edad_maxima: 5 },
      { nombre_rango: '6-8 años', edad_minima: 6, edad_maxima: 8 },
      { nombre_rango: '9-12 años', edad_minima: 9, edad_maxima: 12 },
      { nombre_rango: '13-17 años', edad_minima: 13, edad_maxima: 17 },
    ];

    for (const rangoData of rangosData) {
      const existing = await RangoEdad.findOne({
        nombre_rango: rangoData.nombre_rango,
      });
      if (!existing) {
        await RangoEdad.create(rangoData);
        console.warn(`${rangoData.nombre_rango}: Creado`);
      } else {
        console.warn(`${rangoData.nombre_rango}: Ya existe`);
      }
    }

    console.warn('\nCreando categorías...');
    const categoriasData = [
      {
        nombre_categoria: 'Matemáticas',
        descripcion: 'Actividades de matemáticas y lógica',
      },
      {
        nombre_categoria: 'Ciencias',
        descripcion: 'Actividades de ciencias naturales',
      },
      {
        nombre_categoria: 'Arte',
        descripcion: 'Actividades artísticas y creativas',
      },
      {
        nombre_categoria: 'Deportes',
        descripcion: 'Actividades deportivas y físicas',
      },
    ];

    const categorias = [];
    for (const catData of categoriasData) {
      const existing = await Categoria.findOne({
        nombre_categoria: catData.nombre_categoria,
      });
      if (!existing) {
        const cat = await Categoria.create(catData);
        categorias.push(cat);
        console.warn(`${catData.nombre_categoria}: Creado`);
      } else {
        categorias.push(existing);
        console.warn(`${catData.nombre_categoria}: Ya existe`);
      }
    }

    console.warn('\nCreando subcategorías...');
    const matematicasCat = categorias.find(
      c => c.nombre_categoria === 'Matemáticas'
    );
    const cienciasCat = categorias.find(c => c.nombre_categoria === 'Ciencias');

    if (matematicasCat && cienciasCat) {
      const subcategoriasData = [
        {
          nombre_subcategoria: 'Suma y Resta',
          id_categoria: matematicasCat._id,
        },
        {
          nombre_subcategoria: 'Multiplicación y División',
          id_categoria: matematicasCat._id,
        },
        { nombre_subcategoria: 'Biología', id_categoria: cienciasCat._id },
        { nombre_subcategoria: 'Química', id_categoria: cienciasCat._id },
      ];

      for (const subData of subcategoriasData) {
        const existing = await Subcategoria.findOne({
          nombre_subcategoria: subData.nombre_subcategoria,
        });
        if (!existing) {
          await Subcategoria.create(subData);
          console.warn(`${subData.nombre_subcategoria}: Creado`);
        } else {
          console.warn(`${subData.nombre_subcategoria}: Ya existe`);
        }
      }
    }

    console.warn('\nCreando niveles de dificultad...');
    const nivelesData = [
      { nivel: 'Fácil', descripcion: 'Nivel básico para principiantes' },
      { nivel: 'Intermedio', descripcion: 'Nivel medio con más desafíos' },
      { nivel: 'Difícil', descripcion: 'Nivel avanzado con alta complejidad' },
      { nivel: 'Experto', descripcion: 'Nivel para usuarios experimentados' },
    ];

    for (const nivelData of nivelesData) {
      const existing = await NivelDificultad.findOne({
        nivel: nivelData.nivel,
      });
      if (!existing) {
        await NivelDificultad.create(nivelData);
        console.warn(`${nivelData.nivel}: Creado`);
      } else {
        console.warn(`${nivelData.nivel}: Ya existe`);
      }
    }

    console.warn('\nCreando ciclos...');
    const ciclosData = [
      {
        nombre_ciclo: '1/2025',
        descripcion: 'Primer ciclo 2025',
        fecha_inicio: new Date('2025-01-15'),
        fecha_fin: new Date('2025-06-15'),
        creado_por: adminUser._id,
      },
      {
        nombre_ciclo: '2/2025',
        descripcion: 'Segundo ciclo 2025',
        fecha_inicio: new Date('2025-07-15'),
        fecha_fin: new Date('2025-12-15'),
        creado_por: adminUser._id,
      },
    ];

    const ciclos = [];
    for (const cicloData of ciclosData) {
      const existing = await Ciclo.findOne({
        nombre_ciclo: cicloData.nombre_ciclo,
      });
      if (!existing) {
        const ciclo = await Ciclo.create(cicloData);
        ciclos.push(ciclo);
        console.warn(`${cicloData.nombre_ciclo}: Creado`);
      } else {
        ciclos.push(existing);
        console.warn(`${cicloData.nombre_ciclo}: Ya existe`);
      }
    }

    console.warn('\nCreando estados de pregunta...');
    const estadosData = [
      {
        nombre_estado: 'borrador',
        descripcion: 'Pregunta en borrador',
        orden: 1,
      },
      {
        nombre_estado: 'revision',
        descripcion: 'Pregunta en revisión',
        orden: 2,
      },
      {
        nombre_estado: 'publicada',
        descripcion: 'Pregunta publicada',
        orden: 3,
      },
      {
        nombre_estado: 'rechazada',
        descripcion: 'Pregunta rechazada',
        orden: 4,
      },
      {
        nombre_estado: 'archivada',
        descripcion: 'Pregunta archivada',
        orden: 5,
      },
    ];

    const estados = [];
    for (const estadoData of estadosData) {
      const existing = await EstadoPregunta.findOne({
        nombre_estado: estadoData.nombre_estado,
      });
      if (!existing) {
        const estado = await EstadoPregunta.create(estadoData);
        estados.push(estado);
        console.warn(`${estadoData.nombre_estado}: Creado`);
      } else {
        estados.push(existing);
        console.warn(`${estadoData.nombre_estado}: Ya existe`);
      }
    }

    console.warn('\nCreando contenido...');
    const contenidosData = [
      {
        tipo_contenido: 'imagen',
        url_contenido: 'https://example.com/images/math-problem.png',
        nombre_archivo: 'math-problem.png',
        tamanio_bytes: 52480,
        mime_type: 'image/png',
        subido_por: editorUser._id,
      },
      {
        tipo_contenido: 'video',
        url_contenido: 'https://example.com/videos/science-experiment.mp4',
        nombre_archivo: 'science-experiment.mp4',
        tamanio_bytes: 2048000,
        mime_type: 'video/mp4',
        subido_por: editorUser._id,
      },
      {
        tipo_contenido: 'texto',
        url_contenido: 'https://example.com/docs/instructions.txt',
        nombre_archivo: 'instructions.txt',
        tamanio_bytes: 1024,
        mime_type: 'text/plain',
        subido_por: adminUser._id,
      },
    ];

    const contenidos = [];
    for (const contenidoData of contenidosData) {
      const contenido = await Contenido.create(contenidoData);
      contenidos.push(contenido);
      console.warn(`${contenidoData.nombre_archivo}: Creado`);
    }

    console.warn('\nCreando preguntas...');
    const matematicasSub = await Subcategoria.findOne({
      nombre_subcategoria: 'Suma y Resta',
    });
    const cienciasSub = await Subcategoria.findOne({
      nombre_subcategoria: 'Biología',
    });
    const rango6_8 = await RangoEdad.findOne({ nombre_rango: '6-8 años' });
    const rango9_12 = await RangoEdad.findOne({ nombre_rango: '9-12 años' });
    const facilDif = await NivelDificultad.findOne({ nivel: 'Fácil' });
    const intermediateDif = await NivelDificultad.findOne({
      nivel: 'Intermedio',
    });
    const publicadaEstado = estados.find(e => e.nombre_estado === 'publicada');

    const preguntasData = [
      {
        id_subcategoria: matematicasSub?._id,
        id_rango_edad: rango6_8?._id,
        id_dificultad: facilDif?._id,
        id_estado: publicadaEstado?._id,
        tipo_pregunta: 'seleccion_multiple',
        titulo_pregunta: '¿Cuánto es 5 + 3?',
        puntos_recomendados: 1,
        tiempo_estimado: 60,
        creado_por: editorUser._id,
      },
      {
        id_subcategoria: matematicasSub?._id,
        id_rango_edad: rango6_8?._id,
        id_dificultad: facilDif?._id,
        id_estado: publicadaEstado?._id,
        tipo_pregunta: 'verdadero_falso',
        titulo_pregunta: '10 - 4 es igual a 6',
        puntos_recomendados: 1,
        tiempo_estimado: 30,
        creado_por: editorUser._id,
      },
      {
        id_subcategoria: cienciasSub?._id,
        id_rango_edad: rango9_12?._id,
        id_dificultad: intermediateDif?._id,
        id_estado: publicadaEstado?._id,
        tipo_pregunta: 'desarrollo',
        titulo_pregunta: 'Explica el proceso de fotosíntesis en las plantas',
        puntos_recomendados: 5,
        tiempo_estimado: 300,
        id_contenido_pregunta: contenidos[1]?._id,
        creado_por: editorUser._id,
      },
      {
        id_subcategoria: cienciasSub?._id,
        id_rango_edad: rango9_12?._id,
        id_dificultad: facilDif?._id,
        id_estado: publicadaEstado?._id,
        tipo_pregunta: 'emparejamiento',
        titulo_pregunta: 'Relaciona el animal con su hábitat',
        puntos_recomendados: 3,
        tiempo_estimado: 120,
        creado_por: editorUser._id,
      },
    ];

    const preguntas = [];
    for (const preguntaData of preguntasData) {
      const pregunta = await Pregunta.create(preguntaData);
      preguntas.push(pregunta);
      console.warn(`Pregunta "${preguntaData.titulo_pregunta}": Creada`);
    }

    console.warn('\nCreando opciones de preguntas...');
    const opcionesData = [
      {
        id_pregunta: preguntas[0]!._id,
        texto_opcion: '8',
        es_correcta: true,
        orden: 1,
      },
      {
        id_pregunta: preguntas[0]!._id,
        texto_opcion: '7',
        es_correcta: false,
        orden: 2,
      },
      {
        id_pregunta: preguntas[0]!._id,
        texto_opcion: '9',
        es_correcta: false,
        orden: 3,
      },
      {
        id_pregunta: preguntas[0]!._id,
        texto_opcion: '6',
        es_correcta: false,
        orden: 4,
      },
      {
        id_pregunta: preguntas[1]!._id,
        texto_opcion: 'Verdadero',
        es_correcta: true,
        orden: 1,
      },
      {
        id_pregunta: preguntas[1]!._id,
        texto_opcion: 'Falso',
        es_correcta: false,
        orden: 2,
      },
    ];

    const opciones = [];
    for (const opcionData of opcionesData) {
      const opcion = await OpcionPregunta.create(opcionData);
      opciones.push(opcion);
    }
    console.warn(`${opcionesData.length} opciones creadas`);

    console.warn('\nCreando pares de emparejamiento...');
    const paresData = [
      {
        id_pregunta: preguntas[3]!._id,
        elemento_izquierdo: 'Pez',
        elemento_derecho: 'Agua',
        orden: 1,
      },
      {
        id_pregunta: preguntas[3]!._id,
        elemento_izquierdo: 'Águila',
        elemento_derecho: 'Cielo',
        orden: 2,
      },
      {
        id_pregunta: preguntas[3]!._id,
        elemento_izquierdo: 'Oso',
        elemento_derecho: 'Bosque',
        orden: 3,
      },
    ];

    for (const parData of paresData) {
      await ParEmparejamiento.create(parData);
    }
    console.warn(`${paresData.length} pares de emparejamiento creados`);

    console.warn('\nCreando respuestas modelo...');
    const respuestasModeloData = [
      {
        id_pregunta: preguntas[2]!._id,
        texto_respuesta:
          'La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar, agua y dióxido de carbono en oxígeno y glucosa. Este proceso ocurre principalmente en las hojas, específicamente en los cloroplastos que contienen clorofila.',
        puntos_asignados: 5,
      },
    ];

    for (const respuestaData of respuestasModeloData) {
      await RespuestaModelo.create(respuestaData);
    }
    console.warn('Respuestas modelo creadas');

    console.warn('\nCreando exámenes...');
    const examenesData = [
      {
        titulo: 'Examen de Matemáticas Básicas',
        descripcion: 'Examen de suma y resta para nivel inicial',
        id_ciclo: ciclos[0]!._id,
        fecha_inicio: new Date('2025-02-01'),
        fecha_fin: new Date('2025-02-28'),
        duracion_minutos: 30,
        intentos_permitidos: 2,
        calificacion_minima: 60,
        mostrar_resultados: true,
        aleatorizar_preguntas: false,
        aleatorizar_opciones: false,
        activo: true,
        creado_por: editorUser._id,
      },
      {
        titulo: 'Examen de Ciencias Naturales',
        descripcion: 'Examen sobre biología y naturaleza',
        id_ciclo: ciclos[0]!._id,
        fecha_inicio: new Date('2025-03-01'),
        fecha_fin: new Date('2025-03-31'),
        duracion_minutos: 60,
        intentos_permitidos: 1,
        calificacion_minima: 70,
        mostrar_resultados: true,
        aleatorizar_preguntas: true,
        aleatorizar_opciones: true,
        activo: true,
        creado_por: editorUser._id,
      },
    ];

    const examenes = [];
    for (const examenData of examenesData) {
      const examen = await Examen.create(examenData);
      examenes.push(examen);
      console.warn(`Examen "${examenData.titulo}": Creado`);
    }

    console.warn('\nAsignando preguntas a exámenes...');
    const examenPreguntasData = [
      {
        id_examen: examenes[0]!._id,
        id_pregunta: preguntas[0]!._id,
        orden: 1,
        puntos: 1,
      },
      {
        id_examen: examenes[0]!._id,
        id_pregunta: preguntas[1]!._id,
        orden: 2,
        puntos: 1,
      },
      {
        id_examen: examenes[1]!._id,
        id_pregunta: preguntas[2]!._id,
        orden: 1,
        puntos: 5,
      },
      {
        id_examen: examenes[1]!._id,
        id_pregunta: preguntas[3]!._id,
        orden: 2,
        puntos: 3,
      },
    ];

    const examenPreguntas = [];
    for (const epData of examenPreguntasData) {
      const ep = await ExamenPregunta.create(epData);
      examenPreguntas.push(ep);
    }
    console.warn(
      `${examenPreguntasData.length} preguntas asignadas a exámenes`
    );

    console.warn('\nCreando intentos de examen...');
    const intentosData = [
      {
        id_examen: examenes[0]!._id,
        id_usuario: estudianteUser._id,
        numero_intento: 1,
        fecha_inicio: new Date('2025-02-05T10:00:00'),
        fecha_finalizacion: new Date('2025-02-05T10:25:00'),
        calificacion: 85,
        puntos_obtenidos: 17,
        puntos_totales: 20,
        completado: true,
      },
      {
        id_examen: examenes[1]!._id,
        id_usuario: estudianteUser._id,
        numero_intento: 1,
        fecha_inicio: new Date('2025-03-05T14:00:00'),
        completado: false,
      },
    ];

    const intentos = [];
    for (const intentoData of intentosData) {
      const intento = await IntentoExamen.create(intentoData);
      intentos.push(intento);
    }
    console.warn(`${intentosData.length} intentos de examen creados`);

    console.warn('\nCreando respuestas de estudiantes...');
    // Respuesta de selección múltiple
    await RespuestaSeleccion.create({
      id_intento: intentos[0]!._id,
      id_examen_pregunta: examenPreguntas[0]!._id,
      id_opcion_seleccionada: opciones[0]!._id,
      puntos_obtenidos: 1,
      es_correcta: true,
    });

    // Respuesta verdadero/falso
    await RespuestaSeleccion.create({
      id_intento: intentos[0]!._id,
      id_examen_pregunta: examenPreguntas[1]!._id,
      id_opcion_seleccionada: opciones[4]!._id,
      puntos_obtenidos: 1,
      es_correcta: true,
    });

    // Respuesta de desarrollo
    await RespuestaDesarrollo.create({
      id_intento: intentos[1]!._id,
      id_examen_pregunta: examenPreguntas[2]!._id,
      respuesta_texto:
        'Las plantas usan la luz del sol para convertir agua y CO2 en azúcar y oxígeno.',
      puntos_obtenidos: 3,
      calificada: true,
      calificada_por: editorUser._id,
      comentario_calificador:
        'Buena respuesta pero falta más detalle sobre los cloroplastos.',
    });

    console.warn('Respuestas de estudiantes creadas');

    console.warn('\nCreando revisiones de preguntas...');
    await RevisionPregunta.create({
      id_pregunta: preguntas[0]!._id,
      id_revisor: adminUser._id,
      voto: 'positivo',
      comentario: 'Pregunta aprobada. Claridad y opciones correctas.',
      fecha_revision: new Date(),
    });

    console.warn('Revisiones de preguntas creadas');

    console.warn('\nSEED COMPLETADO EXITOSAMENTE');
    console.warn('\n' + '═'.repeat(60));
    console.warn('CREDENCIALES DE USUARIOS:');
    console.warn('─'.repeat(60));
    console.warn(`Superadmin: ${adminEmail} / ${adminPassword}`);
    console.warn(`Editor:     ${editorEmail} / ${editorPassword}`);
    console.warn(`Organizador: ${organizadorEmail} / ${organizadorPassword}`);
    console.warn(`Estudiante: ${estudianteEmail} / ${estudiantePassword}`);
    console.warn('═'.repeat(60));
    console.warn('\nRESUMEN DE DATOS CREADOS:');
    console.warn('─'.repeat(60));
    console.warn(`✅ ${privilegiosData.length} Privilegios`);
    console.warn(`✅ 4 Usuarios con privilegios asignados`);
    console.warn(`✅ ${rangosData.length} Rangos de edad`);
    console.warn(`✅ ${categoriasData.length} Categorías`);
    console.warn(`✅ ${ciclosData.length} Ciclos académicos`);
    console.warn(`✅ ${estadosData.length} Estados de pregunta`);
    console.warn(`✅ ${contenidosData.length} Archivos de contenido`);
    console.warn(`✅ ${preguntasData.length} Preguntas (con opciones y pares)`);
    console.warn(`✅ ${examenesData.length} Exámenes con preguntas asignadas`);
    console.warn(`✅ ${intentosData.length} Intentos de examen`);
    console.warn(`✅ Respuestas de estudiantes (selección, desarrollo)`);
    console.warn(`✅ Revisiones de preguntas`);
    console.warn('═'.repeat(60));
  } catch (error) {
    console.error('\nError durante el seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.warn('Desconectado de MongoDB');
    process.exit(0);
  }
};

seedDatabase();
