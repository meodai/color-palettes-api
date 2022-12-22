import fs from 'fs';

// import all vendor palettes
import * as chromatome from 'chromotome';
import {colorPalettes as palettesSW} from 'sanzowadacolors/dist/palettes.esm.js';
import {colorPalettes as palettesHH} from 'happyhuescolors';
import {colorPalettes as palettesSR} from 'somorovdcolors';
import {colorPalettes as palettesFC} from 'foundcolorcolors';
import {colorPalettes as palettesMM} from 'mymindcolors';
import {colorPalettes as palettesYT} from 'coloryorktownhall';

// do what has to be done to get the palettes into a format that is usable by the app
const allColorPals = JSON.parse( fs.readFileSync('./node_modules/color_pals/palettes.json', 'utf8') );
const allChromaTomePalettes = chromatome.getAll();

const paletteKeys = ['key', 'name', 'author', 'source', 'license', 'palettes'];

// create a list of all palettes including metadata
const allVendors = [
  {
    key: 'chromatome',
    name: 'chromotome',
    author: 'Kjetil Midtgarden Golid',
    source: 'https://github.com/kgolid/chromotome',
    license: 'MIT',
    palettes: allChromaTomePalettes
  },
  {
    key: 'colorpals',
    name: 'Color Pals',
    author: 'Roni Kaufman',
    source: 'https://github.com/ronikaufman/color_pals',
    license: 'MIT',
    palettes: allColorPals,
  },
  {
    key: 'sanzowada1',
    name: 'Sanzo Wada Colors Combinations',
    author: 'Sanzo Wada',
    source: 'https://github.com/meodai/sanzoWadaColors',
    license: 'MIT',
    palettes: palettesSW.palettesFlat,
  },
  {
    key: 'happyhues',
    name: 'Happy Hues',
    author: 'Mackenzie Child',
    source: 'https://www.happyhues.co/',
    license: 'Unknown',
    palettes: palettesHH.palettesFlat,
  },
  {
    key: 'somorovd',
    name: 'Somorovd Colors',
    author: 'Somorovd',
    source: 'https://github.com/Somorovd/GenArt_Public/blob/main/palettes.json',
    license: 'Unknown',
    palettes: palettesSR.palettesFlat,
  },
  {
    key: 'foundcolor',
    name: 'Found Color',
    author: 'Found Color',
    source: 'https://foundcolor.co/',
    license: 'Unknown',
    palettes: palettesFC.palettesFlat,
  },
  {
    key: 'mymind',
    name: 'My Mind Colors',
    author: 'mymind.com',
    source: 'https://access.mymind.com/colors',
    license: 'Unknown',
    palettes: palettesMM.palettesFlat,
  },
  {
    key: 'yorktownhall',
    name: 'Yorktown Hall',
    author: 'Studio Yorktown',
    source: 'https://studioyorktown.github.io/coloryorktownhall/',
    license: 'MIT',
    palettes: palettesYT.palettesFlat,
  },
];

// move all properties from each palettes.palettes that are not in the allowed list
// to the palette's metadata object, and count the number of colors

const allowedProperties = ['name', 'colors', 'size'];

allVendors.forEach(palette => {
  palette.palettes.forEach(palette => {
    const metadata = {};
    Object.keys(palette).forEach(key => {
      if (!allowedProperties.includes(key)) {
        metadata[key] = palette[key];
        delete palette[key];
      }
    });
    
    palette.size = palette.colors.length;

    if (Object.keys(metadata).length > 0) {
      palette.metadata = metadata;
    }

    // make sure colors are in the correct format
    palette.colors = palette.colors.map(color => {
      if (typeof color === 'string' && color.startsWith('#') ) {
        return color;
      } else if (typeof color === 'object' && (color.hasOwnProperty('hex') || color.hasOwnProperty('value')) ) {
        return color.hex || color.value;
      }
    });
  });
});

function getVendorsByMultipleProperties(propertyValueObj) {
  const groups = [];
  allVendors.forEach(palette => {
    let match = true;
    Object.keys(propertyValueObj).forEach(key => {
      if (palette[key] !== propertyValueObj[key]) {
        match = false;
      }
    });
    if (match) {
      groups.push(palette);
    }
  });
  return groups;
}

function getAllVendorsByKey(keyword) {
  return getVendorsByMultipleProperties({key: keyword});
}

// get all palettes that have an open license
function getAllOpenLicensePalettes() {
  return getVendorsByMultipleProperties({license: 'MIT'});
}

// return any random palette
function getRandomPalette() {
  const randomPalette = allVendors[Math.floor(Math.random() * allVendors.length)];
  return randomPalette.palettes[Math.floor(Math.random() * randomPalette.palettes.length)];
}

function getAllVendorsThatContainAColor(color) {
  const palettes = [];
  allVendors.forEach(palette => {
    palette.palettes.forEach(palette => {
      if (palette.colors.includes(color)) {
        palettes.push(palette);
      }
    });
  });
  return palettes;
};


export { 
  allVendors,
  getRandomPalette,
  getAllVendorsByKey,
  getVendorsByMultipleProperties,
  getAllVendorsThatContainAColor,
};