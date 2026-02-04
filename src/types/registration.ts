// SIM Registration Types

export type ApplicationType = 
  | 'BARU' 
  | 'PERPANJANGAN' 
  | 'PENINGKATAN_GOLONGAN' 
  | 'PENURUNAN_GOLONGAN' 
  | 'PENGGANTIAN_HILANG' 
  | 'PENGGANTIAN_RUSAK';

export type SIMCategory = 
  | 'A' 
  | 'A_UMUM' 
  | 'BI' 
  | 'BI_UMUM' 
  | 'BII' 
  | 'BII_UMUM' 
  | 'C' 
  | 'D' 
  | 'DI';

export type LocationType = 'SATPAS' | 'SIMLING' | 'GERAI' | 'LAINNYA';

export type Gender = 'LAKI_LAKI' | 'PEREMPUAN';

export type YesNo = 'YA' | 'TIDAK';

export type HasOrNot = 'ADA' | 'TIDAK_ADA';

export interface RegistrationFormData {
  // Bagian 1: DATA PESERTA UJI
  jenisPermohonan: ApplicationType;
  golonganSIM: SIMCategory;
  email: string;
  polda: string;
  lokasiKedatangan: LocationType;
  lokasiLainnya?: string;
  
  // Bagian 2: DATA PRIBADI
  nama: string;
  jenisKelamin: Gender;
  tempatLahir: string;
  tanggalLahir: string;
  tinggiBadan: string;
  pekerjaan: string;
  telepon: string;
  alamat: string;
  pendidikanTerakhir: string;
  fotoKTP: HasOrNot;
  berkacamata: YesNo;
  cacatFisik: YesNo;
  sertifikatMengemudi: HasOrNot;
  
  // Additional
  organizationId: string;
  selectedSlot?: string;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: 'POLDA' | 'POLRES' | 'POLSEK';
  address: string;
  phone: string;
  parentId?: string;
  isActive: boolean;
}

export interface AvailabilitySlot {
  id: string;
  date: string;
  time: string;
  capacity: number;
  booked: number;
  organizationId: string;
}

export interface Registration {
  id: string;
  registrationNumber: string;
  formData: RegistrationFormData;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN';
  organizationId?: string;
  isActive: boolean;
  createdAt: string;
}

// Application type labels
export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
  BARU: 'Baru',
  PERPANJANGAN: 'Perpanjangan',
  PENINGKATAN_GOLONGAN: 'Peningkatan Golongan',
  PENURUNAN_GOLONGAN: 'Penurunan Golongan',
  PENGGANTIAN_HILANG: 'Penggantian (Hilang)',
  PENGGANTIAN_RUSAK: 'Penggantian (Rusak)',
};

// SIM category labels
export const SIM_CATEGORY_LABELS: Record<SIMCategory, string> = {
  A: 'SIM A (Perseorangan)',
  A_UMUM: 'SIM A Umum',
  BI: 'SIM B I (Perseorangan)',
  BI_UMUM: 'SIM B I Umum',
  BII: 'SIM B II',
  BII_UMUM: 'SIM B II Umum',
  C: 'SIM C',
  D: 'SIM D',
  DI: 'SIM D I',
};

// Location type labels
export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  SATPAS: 'SATPAS',
  SIMLING: 'SIM Keliling',
  GERAI: 'Gerai SIM',
  LAINNYA: 'Lainnya',
};

// Education options
export const EDUCATION_OPTIONS = [
  'SD',
  'SMP',
  'SMA/SMK',
  'D1',
  'D2',
  'D3',
  'S1',
  'S2',
  'S3',
];
