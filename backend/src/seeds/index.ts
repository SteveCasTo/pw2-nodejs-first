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

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI no está definida en .env');
    }

    console.log('Conectando a MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Conectado a MongoDB\n');

    console.log('Creando privilegios por defecto...');
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
        console.log(`${privData.nombre_privilegio}: Ya existe`);
        privilegios.push(existing);
      } else {
        const priv = await Privilegio.create(privData);
        console.log(`${privData.nombre_privilegio}: Creado`);
        privilegios.push(priv);
      }
    }

    console.log('\nCreando usuario superadmin...');
    const adminEmail = 'admin@sistema.com';
    const adminPassword = 'Admin123!@#';

    let adminUser = await Usuario.findOne({
      correo_electronico: adminEmail,
    });

    if (adminUser) {
      console.log(`${adminEmail}: Ya existe`);
    } else {
      adminUser = await Usuario.create({
        correo_electronico: adminEmail,
        password: adminPassword,
        nombre: 'Super Admin',
      });
      console.log(`${adminEmail}: Creado`);
    }

    console.log('\nCreando usuario editor...');
    const editorEmail = 'editor@sistema.com';
    const editorPassword = 'Editor123!@#';

    let editorUser = await Usuario.findOne({
      correo_electronico: editorEmail,
    });

    if (editorUser) {
      console.log(`${editorEmail}: Ya existe`);
    } else {
      editorUser = await Usuario.create({
        correo_electronico: editorEmail,
        password: editorPassword,
        nombre: 'Usuario Editor',
        creado_por: adminUser._id,
      });
      console.log(`${editorEmail}: Creado`);
    }

    console.log('\nCreando usuario organizador...');
    const organizadorEmail = 'organizador@sistema.com';
    const organizadorPassword = 'Organizador123!@#';

    let organizadorUser = await Usuario.findOne({
      correo_electronico: organizadorEmail,
    });

    if (organizadorUser) {
      console.log(`${organizadorEmail}: Ya existe`);
    } else {
      organizadorUser = await Usuario.create({
        correo_electronico: organizadorEmail,
        password: organizadorPassword,
        nombre: 'Usuario Organizador',
        creado_por: adminUser._id,
      });
      console.log(`${organizadorEmail}: Creado`);
    }

    console.log('\nCreando usuario estudiante...');
    const estudianteEmail = 'estudiante@sistema.com';
    const estudiantePassword = 'Estudiante123!@#';

    let estudianteUser = await Usuario.findOne({
      correo_electronico: estudianteEmail,
    });

    if (estudianteUser) {
      console.log(`${estudianteEmail}: Ya existe`);
    } else {
      estudianteUser = await Usuario.create({
        correo_electronico: estudianteEmail,
        password: estudiantePassword,
        nombre: 'Usuario Estudiante',
        creado_por: adminUser._id,
      });
      console.log(`${estudianteEmail}: Creado`);
    }

    console.log('\nAsignando privilegios...');
    const superadminPriv = privilegios.find(
      (p) => p.nombre_privilegio === 'superadmin'
    );
    const editorPriv = privilegios.find(
      (p) => p.nombre_privilegio === 'editor'
    );
    const organizadorPriv = privilegios.find(
      (p) => p.nombre_privilegio === 'organizador'
    );
    const estudiantePriv = privilegios.find(
      (p) => p.nombre_privilegio === 'estudiante'
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
      console.log('Privilegio superadmin asignado');
    } else {
      console.log('Privilegio superadmin ya asignado');
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
      console.log('Privilegio editor asignado');
    } else {
      console.log('Privilegio editor ya asignado');
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
      console.log('Privilegio organizador asignado');
    } else {
      console.log('Privilegio organizador ya asignado');
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
      console.log('Privilegio estudiante asignado');
    } else {
      console.log('Privilegio estudiante ya asignado');
    }

    console.log('\nCreando rangos de edad...');
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
        console.log(`${rangoData.nombre_rango}: Creado`);
      } else {
        console.log(`${rangoData.nombre_rango}: Ya existe`);
      }
    }

    console.log('\nCreando categorías...');
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
        console.log(`${catData.nombre_categoria}: Creado`);
      } else {
        categorias.push(existing);
        console.log(`${catData.nombre_categoria}: Ya existe`);
      }
    }

    console.log('\nCreando subcategorías...');
    const matematicasCat = categorias.find(
      (c) => c.nombre_categoria === 'Matemáticas'
    );
    const cienciasCat = categorias.find(
      (c) => c.nombre_categoria === 'Ciencias'
    );

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
          console.log(`${subData.nombre_subcategoria}: Creado`);
        } else {
          console.log(`${subData.nombre_subcategoria}: Ya existe`);
        }
      }
    }

    console.log('\nCreando niveles de dificultad...');
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
        console.log(`${nivelData.nivel}: Creado`);
      } else {
        console.log(`${nivelData.nivel}: Ya existe`);
      }
    }

    console.log('\nCreando ciclos...');
    const ciclosData = [
      {
        nombre_ciclo: '2025/1',
        descripcion: 'Primer ciclo 2025',
        fecha_inicio: new Date('2025-01-15'),
        fecha_fin: new Date('2025-06-15'),
        creado_por: adminUser._id,
      },
      {
        nombre_ciclo: '2025/2',
        descripcion: 'Segundo ciclo 2025',
        fecha_inicio: new Date('2025-07-15'),
        fecha_fin: new Date('2025-12-15'),
        creado_por: adminUser._id,
      },
    ];

    for (const cicloData of ciclosData) {
      const existing = await Ciclo.findOne({
        nombre_ciclo: cicloData.nombre_ciclo,
      });
      if (!existing) {
        await Ciclo.create(cicloData);
        console.log(`${cicloData.nombre_ciclo}: Creado`);
      } else {
        console.log(`${cicloData.nombre_ciclo}: Ya existe`);
      }
    }

    console.log('\nSEED COMPLETADO EXITOSAMENTE');
    console.log('\nCREDENCIALES DE USUARIOS:');
    console.log('─'.repeat(50));
    console.log(`Superadmin: ${adminEmail} / ${adminPassword}`);
    console.log(`Editor:     ${editorEmail} / ${editorPassword}`);
    console.log(`Organizador: ${organizadorEmail} / ${organizadorPassword}`);
    console.log(`Estudiante: ${estudianteEmail} / ${estudiantePassword}`);
  } catch (error) {
    console.error('\nError durante el seed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
    process.exit(0);
  }
};

seedDatabase();
