import { Ciclo } from '@models/ciclo.model';

interface CreateCicloData {
  nombre_ciclo: string;
  descripcion?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  creado_por: string;
}

interface UpdateCicloData {
  nombre_ciclo?: string;
  descripcion?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  actualizado_por?: string;
}

const validateCicloFormat = (nombre_ciclo: string): boolean => {
  const formato1 = /^\d{4}\/[1-2]$/;
  const formato2 = /^(I|II|III|IV)\/\d{4}$/;
  return formato1.test(nombre_ciclo) || formato2.test(nombre_ciclo);
};

const cicloService = {
  getAll: async (activo?: boolean) => {
    const filter = activo !== undefined ? { activo } : {};
    return await Ciclo.find(filter)
      .populate('creado_por', 'correo_electronico nombre apellido_paterno')
      .sort({ fecha_inicio: -1 });
  },

  getById: async (id: string) => {
    const ciclo = await Ciclo.findById(id).populate(
      'creado_por',
      'correo_electronico nombre apellido_paterno'
    );

    if (!ciclo) {
      throw new Error('Ciclo no encontrado');
    }

    return ciclo;
  },

  create: async (data: CreateCicloData) => {
    const { nombre_ciclo, fecha_inicio, fecha_fin } = data;

    if (!validateCicloFormat(nombre_ciclo)) {
      throw new Error(
        'Formato de ciclo inválido. Use formatos como: 2025/1, 2025/2, I/2025, II/2025, III/2025, IV/2025'
      );
    }

    const existingCiclo = await Ciclo.findOne({ nombre_ciclo });
    if (existingCiclo) {
      throw new Error('Ya existe un ciclo con ese nombre');
    }

    if (fecha_inicio && fecha_fin && fecha_inicio >= fecha_fin) {
      throw new Error(
        'La fecha de inicio debe ser anterior a la fecha de fin'
      );
    }

    const ciclo = await Ciclo.create(data);

    return await Ciclo.findById(ciclo._id).populate(
      'creado_por',
      'correo_electronico nombre apellido_paterno'
    );
  },

  update: async (id: string, data: UpdateCicloData) => {
    const { nombre_ciclo, fecha_inicio, fecha_fin } = data;

    if (nombre_ciclo && !validateCicloFormat(nombre_ciclo)) {
      throw new Error(
        'Formato de ciclo inválido. Use formatos como: 2025/1, 2025/2, I/2025, II/2025, III/2025, IV/2025'
      );
    }

    if (nombre_ciclo) {
      const existingCiclo = await Ciclo.findOne({
        nombre_ciclo,
        _id: { $ne: id },
      });

      if (existingCiclo) {
        throw new Error('Ya existe un ciclo con ese nombre');
      }
    }

    if (fecha_inicio && fecha_fin && fecha_inicio >= fecha_fin) {
      throw new Error(
        'La fecha de inicio debe ser anterior a la fecha de fin'
      );
    }

    const ciclo = await Ciclo.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate('creado_por', 'correo_electronico nombre apellido_paterno');

    if (!ciclo) {
      throw new Error('Ciclo no encontrado');
    }

    return ciclo;
  },

  delete: async (id: string, usuarioId: string) => {
    const ciclo = await Ciclo.findByIdAndUpdate(
      id,
      {
        activo: false,
        actualizado_por: usuarioId,
      },
      { new: true }
    ).populate('creado_por', 'correo_electronico nombre apellido_paterno');

    if (!ciclo) {
      throw new Error('Ciclo no encontrado');
    }

    return ciclo;
  },

  hardDelete: async (id: string) => {
    const ciclo = await Ciclo.findByIdAndDelete(id);

    if (!ciclo) {
      throw new Error('Ciclo no encontrado');
    }

    return ciclo;
  },
};

export default cicloService;
