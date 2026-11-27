import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

/**
 * Algoritmo Módulo 10 para validar Cédula de Identidad de Ecuador
 */
export function validarCedulaEcuatoriana(cedula: string): boolean {
  if (!cedula || typeof cedula !== 'string') {
    return false;
  }

  const valor = cedula.trim();

  // 1. Debe contener exactamente 10 dígitos numéricos
  if (!/^\d{10}$/.test(valor)) {
    return false;
  }

  // 2. Código de provincia (primeros dos dígitos): 01-24 o 30 (ecuatorianos en el exterior)
  const provincia = parseInt(valor.substring(0, 2), 10);
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) {
    return false;
  }

  // 3. Tercer dígito debe ser menor a 6 (0 a 5 para personas naturales)
  const tercerDigito = parseInt(valor.charAt(2), 10);
  if (tercerDigito >= 6) {
    return false;
  }

  // 4. Algoritmo Módulo 10 sobre los primeros 9 dígitos
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let producto = parseInt(valor.charAt(i), 10) * coeficientes[i];
    if (producto >= 10) {
      producto -= 9;
    }
    suma += producto;
  }

  const digitoVerificadorCalculado = (10 - (suma % 10)) % 10;
  const digitoVerificadorReal = parseInt(valor.charAt(9), 10);

  return digitoVerificadorCalculado === digitoVerificadorReal;
}

@ValidatorConstraint({ name: 'isCedulaEcuatoriana', async: false })
export class IsCedulaEcuatorianaConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    return typeof value === 'string' && validarCedulaEcuatoriana(value);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'La cédula ingresada no es una cédula ecuatoriana válida (Módulo 10)';
  }
}

export function IsCedulaEcuatoriana(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCedulaEcuatorianaConstraint,
    });
  };
}

export class RegisterAuthDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @Matches(/^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ])[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  nombre!: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  @Matches(/^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ])[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, {
    message: 'El apellido solo puede contener letras y espacios',
  })
  apellido!: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'El teléfono solo puede contener caracteres numéricos',
  })
  telefono!: string;

  /**
   * Mapeo de Base de Datos:
   * El campo Cédula del frontend se envía y guarda en la columna 'email' de la BD.
   */
  @IsNotEmpty({ message: 'La cédula (columna email) es obligatoria' })
  @IsString()
  @IsCedulaEcuatoriana({
    message: 'La cédula ingresada no es válida según el algoritmo Módulo 10 de Ecuador',
  })
  email!: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  /**
   * Mapeo de Base de Datos:
   * El campo Correo Electrónico del frontend se envía y guarda en la columna 'email1' de la BD.
   */
  @IsNotEmpty({ message: 'El correo electrónico (columna email1) es obligatorio' })
  @IsString()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/, {
    message: 'Debe ingresar un correo electrónico con formato y dominio válido (ej. usuario@dominio.com)',
  })
  email1!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`¡¿]).+$/, {
    message: 'La contraseña debe incluir al menos 1 letra mayúscula, 1 número y 1 carácter especial',
  })
  password_hash!: string;
}
