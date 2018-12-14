const names = {
  male: ['Gavin', 'Mort', 'Jack', 'Michael', 'Korg', 'Leon', 'Xander', 'Westley', 'Perseus', 'Jakob', 'Rasmus', 'Bertrand', 'André', 'Thaddeus', 'Vernon', 'Chad', 'Ivan'],
  female: ['Gilly', 'Mary', 'Jessie', 'Eliza', 'Katherine', 'Stacey', 'Kelly', 'Veronica', 'Sarah', 'Cate', 'Bertha', 'Daria', 'Michelle', 'Laura', 'Zora', 'Annabelle'],
};

const genders = ['male', 'female'];

const skincolours = [
  { name: 'pale', value: '#D4A181' },
  { name: 'light', value: '#BA8B72' },
  { name: 'tanned', value: '#997659' },
  { name: 'dark', value: '#784931' },
];

const haircolours = [
  { name: 'blonde', value: '#FFDD86' },
  { name: 'red', value: '#CA4C3F' },
  { name: 'brown', value: '#4C2F1E' },
  { name: 'black', value: '#010101' },
];

const hairstyles = {
  male: ['short', 'fringe', 'knot', 'frizzy'],
  female: ['short', 'pony', 'top', 'wavy', 'curly'],
};

const extras = {
  male: [null, 'long_beard', 'short_beard', 'stubble'],
  female: [],
};

export {
  names, genders, skincolours, haircolours, hairstyles, extras,
};
