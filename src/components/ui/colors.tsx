import React from 'react';

const colorsData = [
  { label: 'White', hex: '#FFFFFF', rgb: 'R255 G255 B255', className: 'bg-white' },
  { label: 'Background', hex: '#FFF7D8', rgb: 'R255 G247 B216', className: 'bg-origin' },
  { label: 'Danger', hex: '#F00A4C', rgb: 'R240 G10 B76', className: 'bg-danger' },

  /* Primary Colors */
  { label: 'Primary/50', hex: '#DCF4EC', rgb: 'R220 G244 B236', className: 'bg-primary-50' },
  { label: 'Primary/200', hex: '#97D3C0', rgb: 'R151 G211 B192', className: 'bg-primary-200' },
  { label: 'Primary/400', hex: '#009E6C', rgb: 'R0 G158 B108', className: 'bg-primary-400' },
  { label: 'Primary/600', hex: '#006B49', rgb: 'R0 G107 B73', className: 'bg-primary-600' },

  /* Secondary Colors */
  { label: 'Secondary/50', hex: '#FCE3F8', rgb: 'R252 G227 B248', className: 'bg-secondary-50' },
  { label: 'Secondary/100', hex: '#FFABF1', rgb: 'R255 G171 B241', className: 'bg-secondary-100' },
  { label: 'Secondary/400', hex: '#EB84DA', rgb: 'R235 G132 B218', className: 'bg-secondary-400' },
  { label: 'Secondary/600', hex: '#C653B2', rgb: 'R198 G83 B178', className: 'bg-secondary-600' },

  /* Gray Scale */
  { label: 'Gray/50', hex: '#F9FAFA', rgb: 'R249 G250 B250', className: 'bg-gray-50' },
  { label: 'Gray/100', hex: '#DDDFE3', rgb: 'R221 G223 B227', className: 'bg-gray-100' },
  { label: 'Gray/200', hex: '#C1C4CD', rgb: 'R193 G196 B205', className: 'bg-gray-200' },
  { label: 'Gray/300', hex: '#A5A8AE', rgb: 'R165 G169 B176', className: 'bg-gray-300' },
  { label: 'Gray/400', hex: '#898D9F', rgb: 'R137 G141 B159', className: 'bg-gray-400' },
  { label: 'Gray/500', hex: '#6E7387', rgb: 'R110 G115 B135', className: 'bg-gray-500' },
  { label: 'Gray/600', hex: '#575B6B', rgb: 'R87 G91 B107', className: 'bg-gray-600' },
  { label: 'Gray/700', hex: '#40434F', rgb: 'R64 G67 B79', className: 'bg-gray-700' },
  { label: 'Gray/800', hex: '#292B32', rgb: 'R41 G43 B50', className: 'bg-gray-800' },
  { label: 'Gray/900', hex: '#121316', rgb: 'R18 G19 B22', className: 'bg-gray-900' },
];

const colors = () => {
  return (
    <div className='colors'>
      <div className='p-8'>
        <h1 className='text-2xl font-bold mb-8'>Color</h1>
        <div className='grid grid-cols-3 gap-4'>
          {colorsData.map((color) => (
            <div
              key={color.label}
              className={`p-4 rounded ${color.className}`}
            >
              <strong className='text-black'>{color.label}</strong>
              <p className='text-sm text-black'>{color.hex}</p>
              <p className='text-sm text-black'>{color.rgb}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default colors;
