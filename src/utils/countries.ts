export interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
  mask: string
  placeholder: string
}

export const countries: Country[] = [
  {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    dialCode: '+55',
    mask: '+55 (99) 99999-9999',
    placeholder: '+55 (11) 99999-9999'
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    dialCode: '+1',
    mask: '+1 (999) 999-9999',
    placeholder: '+1 (555) 123-4567'
  },
  {
    code: 'GB',
    name: 'Reino Unido',
    flag: '🇬🇧',
    dialCode: '+44',
    mask: '+44 9999 999999',
    placeholder: '+44 7700 900123'
  },
  {
    code: 'DE',
    name: 'Alemanha',
    flag: '🇩🇪',
    dialCode: '+49',
    mask: '+49 999 99999999',
    placeholder: '+49 151 12345678'
  },
  {
    code: 'FR',
    name: 'França',
    flag: '🇫🇷',
    dialCode: '+33',
    mask: '+33 9 99 99 99 99',
    placeholder: '+33 6 12 34 56 78'
  },
  {
    code: 'IT',
    name: 'Itália',
    flag: '🇮🇹',
    dialCode: '+39',
    mask: '+39 999 999 9999',
    placeholder: '+39 320 123 4567'
  },
  {
    code: 'ES',
    name: 'Espanha',
    flag: '🇪🇸',
    dialCode: '+34',
    mask: '+34 999 99 99 99',
    placeholder: '+34 612 34 56 78'
  },
  {
    code: 'CA',
    name: 'Canadá',
    flag: '🇨🇦',
    dialCode: '+1',
    mask: '+1 (999) 999-9999',
    placeholder: '+1 (416) 123-4567'
  },
  {
    code: 'AU',
    name: 'Austrália',
    flag: '🇦🇺',
    dialCode: '+61',
    mask: '+61 9 9999 9999',
    placeholder: '+61 4 1234 5678'
  },
  {
    code: 'JP',
    name: 'Japão',
    flag: '🇯🇵',
    dialCode: '+81',
    mask: '+81 99 9999 9999',
    placeholder: '+81 90 1234 5678'
  },
  {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    dialCode: '+86',
    mask: '+86 999 9999 9999',
    placeholder: '+86 138 0013 8000'
  },
  {
    code: 'IN',
    name: 'Índia',
    flag: '🇮🇳',
    dialCode: '+91',
    mask: '+91 99999 99999',
    placeholder: '+91 98765 43210'
  },
  {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    dialCode: '+52',
    mask: '+52 99 9999 9999',
    placeholder: '+52 55 1234 5678'
  },
  {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    dialCode: '+54',
    mask: '+54 99 9999 9999',
    placeholder: '+54 11 1234 5678'
  },
  {
    code: 'RU',
    name: 'Rússia',
    flag: '🇷🇺',
    dialCode: '+7',
    mask: '+7 999 999 99 99',
    placeholder: '+7 912 345 67 89'
  }
]

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code)
}

export const formatPhoneNumber = (phone: string, country: Country): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // Remove country code if present
  const countryDigits = country.dialCode.replace(/\D/g, '')
  let phoneDigits = digits
  
  if (digits.startsWith(countryDigits)) {
    phoneDigits = digits.substring(countryDigits.length)
  }
  
  // Format according to country
  return `${country.dialCode} ${phoneDigits}`
}
