import { Ciclo } from '@models/ciclo.model';

interface CreateCicloData {
  nombre_ciclo: string;
  descripcion?: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  creado_por?: string;
  activo?: boolean;
}

interface UpdateCicloData {
  nombre_ciclo?: string;
  descripcion?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  actualizado_por?: string;
  activo?: boolean;
}

const validateCicloFormat = (nombre_ciclo: string): boolean => {
  const formato = /^[1-4]\/\d{4}$/;
  return formato.test(nombre_ciclo);
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
        'Formato de ciclo inválido. Use el formato: ciclo/año (Ejemplo: 1/2025, 2/2025, 3/2025, 4/2025)'
      );
    }

    const existingCiclo = await Ciclo.findOne({ nombre_ciclo });
    if (existingCiclo) {
      throw new Error('Ya existe un ciclo con ese nombre');
    }

    if (fecha_inicio >= fecha_fin) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    // Validar que no haya superposición de fechas con otros ciclos
    const overlappingCiclo = await Ciclo.findOne({
      $or: [
        // El nuevo ciclo empieza dentro de un ciclo existente
        { fecha_inicio: { $lte: fecha_inicio }, fecha_fin: { $gt: fecha_inicio } },
        // El nuevo ciclo termina dentro de un ciclo existente
        { fecha_inicio: { $lt: fecha_fin }, fecha_fin: { $gte: fecha_fin } },
        // El nuevo ciclo contiene completamente un ciclo existente
        { fecha_inicio: { $gte: fecha_inicio }, fecha_fin: { $lte: fecha_fin } },
      ],
    });

    if (overlappingCiclo) {
      throw new Error(
        `El rango de fechas se superpone con el ciclo "${overlappingCiclo.nombre_ciclo}" (${overlappingCiclo.fecha_inicio.toLocaleDateString()} - ${overlappingCiclo.fecha_fin.toLocaleDateString()})`
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
        'Formato de ciclo inválido. Use el formato: ciclo/año (Ejemplo: 1/2025, 2/2025, 3/2025, 4/2025)'
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

    // Obtener el ciclo actual para validar fechas
    const currentCiclo = await Ciclo.findById(id);
    if (!currentCiclo) {
      throw new Error('Ciclo no encontrado');
    }

    const finalFechaInicio = fecha_inicio || currentCiclo.fecha_inicio;
    const finalFechaFin = fecha_fin || currentCiclo.fecha_fin;

    if (finalFechaInicio >= finalFechaFin) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    // Validar que no haya superposición de fechas con otros ciclos (excluyendo el actual)
    if (fecha_inicio || fecha_fin) {
      const overlappingCiclo = await Ciclo.findOne({
        _id: { $ne: id },
        $or: [
          { fecha_inicio: { $lte: finalFechaInicio }, fecha_fin: { $gt: finalFechaInicio } },
          { fecha_inicio: { $lt: finalFechaFin }, fecha_fin: { $gte: finalFechaFin } },
          { fecha_inicio: { $gte: finalFechaInicio }, fecha_fin: { $lte: finalFechaFin } },
        ],
      });

      if (overlappingCiclo) {
        throw new Error(
          `El rango de fechas se superpone con el ciclo "${overlappingCiclo.nombre_ciclo}" (${overlappingCiclo.fecha_inicio.toLocaleDateString()} - ${overlappingCiclo.fecha_fin.toLocaleDateString()})`
        );
      }
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
