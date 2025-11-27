import { Schema, model } from 'mongoose';
import { IUsuarioPrivilegio } from '../types/models.types';

const usuarioPrivilegioSchema = new Schema<IUsuarioPrivilegio>(
  {
    id_usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El ID de usuario es requerido'],
    },
    id_privilegio: {
      type: Schema.Types.ObjectId,
      ref: 'Privilegio',
      required: [true, 'El ID de privilegio es requerido'],
    },
    asignado_por: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    fecha_asignacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

usuarioPrivilegioSchema.index(
  { id_usuario: 1, id_privilegio: 1 },
  { unique: true }
);

export const UsuarioPrivilegio = model<IUsuarioPrivilegio>(
  'UsuarioPrivilegio',
  usuarioPrivilegioSchema,
  'usuarios_privilegios'
);
