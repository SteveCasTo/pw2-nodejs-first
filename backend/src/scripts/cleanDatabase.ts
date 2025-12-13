import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const cleanDatabase = async () => {
  try {
    console.warn('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI as string);
    console.warn('✓ Conectado a MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('No se pudo obtener la instancia de la base de datos');
    }

    console.warn('\n🗑️  Limpiando base de datos...\n');

    // Obtener todas las colecciones
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.warn('✓ La base de datos ya está vacía');
      await mongoose.connection.close();
      return;
    }

    // Eliminar todas las colecciones
    for (const collection of collections) {
      const collectionName = collection.name;
      await db.collection(collectionName).deleteMany({});
      const count = await db.collection(collectionName).countDocuments();
      console.warn(
        `✓ Colección "${collectionName}" limpiada (${count} documentos restantes)`
      );
    }

    console.warn('\n✅ Base de datos limpiada exitosamente');
    console.warn(`Total de colecciones procesadas: ${collections.length}\n`);

    await mongoose.connection.close();
    console.warn('✓ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Confirmar antes de ejecutar
console.warn(
  '⚠️  ADVERTENCIA: Este script eliminará TODOS los datos de la base de datos'
);
console.warn(`Base de datos: ${process.env.MONGO_URI}\n`);

cleanDatabase();
