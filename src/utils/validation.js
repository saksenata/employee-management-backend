const yup = require('yup');

const supportedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

const employeeTypeEnum = [
  'Manager', 'Admin', 'Resepsionis', 'Manajemen', 'Finance',
  'Kasir', 'Purchasing', 'Perawat', 'Bidan', 'Dokter'
];

const baseEmployeeSchema = {
  fullName: yup.string().required('Nama Lengkap wajib diisi').min(3, 'Nama Lengkap minimal 3 karakter'),
  nik: yup.string().required('No. Kartu Identitas (NIK) wajib diisi').matches(/^[0-9]{16}$/, 'NIK harus 16 digit angka'),
  gender: yup.string().required('Jenis Kelamin wajib diisi').oneOf(['Laki-laki', 'Perempuan'], 'Jenis Kelamin tidak valid'),
  birthPlace: yup.string().optional().nullable(),
  birthDate: yup.date().optional().nullable().typeError('Format Tanggal Lahir tidak valid (YYYY-MM-DD)'),
  phoneNumber: yup.string().optional().nullable().matches(/^[0-9]{10,15}$/, 'No. Telepon tidak valid (10-15 digit)'),
  province: yup.string().optional().nullable(),
  city: yup.string().optional().nullable(),
  district: yup.string().optional().nullable(),
  village: yup.string().optional().nullable(),
  addressDetail: yup.string().optional().nullable(),
  username: yup.string().required('Username wajib diisi').min(3, 'Username minimal 3 karakter'),
  email: yup.string().required('Email wajib diisi').email('Format Email tidak valid'),
  employeeType: yup.string().required('Tipe Karyawan wajib diisi'),
  contractStartDate: yup.date().optional().nullable().typeError('Format Tanggal Mulai Kontrak tidak valid (YYYY-MM-DD)'),
  contractEndDate: yup.date().optional().nullable().typeError('Format Tanggal Selesai Kontrak tidak valid (YYYY-MM-DD)')
    .when('contractStartDate', (contractStartDate, schema) => {
      return contractStartDate ? schema.min(contractStartDate, 'Tanggal Selesai Kontrak harus setelah Tanggal Mulai Kontrak') : schema;
    }),
  maritalStatus: yup.string().optional().nullable(),
  bpjsDoctorCode: yup.string().optional().nullable(),
  status: yup.string().optional().oneOf(['AKTIF', 'NON-AKTIF'], 'Status tidak valid').default('AKTIF'),
};

const createEmployeeSchema = yup.object({
  ...baseEmployeeSchema,
  password: yup.string().required('Password wajib diisi').min(6, 'Password minimal 6 karakter'),
});

const updateEmployeeSchema = yup.object({
  ...baseEmployeeSchema,
  password: yup.string().optional().nullable().min(6, 'Password minimal 6 karakter'),
  nik: yup.string().optional().matches(/^[0-9]{16}$/, 'NIK harus 16 digit angka'),
  username: yup.string().optional().min(3, 'Username minimal 3 karakter'),
  email: yup.string().optional().email('Format Email tidak valid'),
});

const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    next();
  } catch (error) {
    const errors = error.inner.reduce((acc, err) => {
      acc[err.path] = err.message;
      return acc;
    }, {});
    res.status(400).json({ errors });
  }
};

const validateFile = (fieldName = 'photo') => (req, res, next) => {
  if (req.file) {
    if (!supportedFileTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        errors: { [fieldName]: `Tipe file tidak didukung. Hanya ${supportedFileTypes.join(', ')}.` }
      });
    }
    if (req.file.size > maxFileSize) {
      return res.status(400).json({
        errors: { [fieldName]: `Ukuran file terlalu besar. Maksimal ${maxFileSize / (1024 * 1024)}MB.` }
      });
    }
  }
  next();
};

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
  validateRequest,
  validateFile,
  yup,
};