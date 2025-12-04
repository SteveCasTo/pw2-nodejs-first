import { Privilegio } from '@models/privilegio.model';

interface CreatePrivilegioData {
  nombre_privilegio: string;
  descripcion?: string;
  creado_por?: string;
}

interface UpdatePrivilegioData {
  nombre_privilegio?: string;
  descripcion?: string;
  actualizado_por?: string;
}

const privilegioService = {
  getAll: async (activo?: boolean) => {
    const filter = activo !== undefined ? { activo } : {};
    return await Privilegio.find(filter).sort({ nombre_privilegio: 1 });
  },

  getById: async (id: string) => {
    const privilegio = await Privilegio.findById(id);
    if (!privilegio) {
      throw new Error('Privilegio no encontrado');
    }
    return privilegio;
  },

  create: async (data: CreatePrivilegioData) => {
    const existingPrivilegio = await Privilegio.findOne({
      nombre_privilegio: data.nombre_privilegio,
    });

    if (existingPrivilegio) {
      throw new Error('Ya existe un privilegio con ese nombre');
    }

    return await Privilegio.create(data);
  },

  update: async (id: string, data: UpdatePrivilegioData) => {
    if (data.nombre_privilegio) {
      const existingPrivilegio = await Privilegio.findOne({
        nombre_privilegio: data.nombre_privilegio,
        _id: { $ne: id },
      });

      if (existingPrivilegio) {
        throw new Error('Ya existe un privilegio con ese nombre');
      }
    }

    const privilegio = await Privilegio.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!privilegio) {
      throw new Error('Privilegio no encontrado');
    }

    return privilegio;
  },

  delete: async (id: string, usuarioId: string) => {
    const privilegio = await Privilegio.findByIdAndUpdate(
      id,
      {
        activo: false,
        actualizado_por: usuarioId,
      },
      { new: true }
    );

    if (!privilegio) {
      throw new Error('Privilegio no encontrado');
    }

    return privilegio;
  },

  hardDelete: async (id: string) => {
    const privilegio = await Privilegio.findByIdAndDelete(id);

    if (!privilegio) {
      throw new Error('Privilegio no encontrado');
    }

    return privilegio;
  },
};

export default privilegioService;
