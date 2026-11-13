// Central map of Unsplash placeholder images used across DestinoLibre.
// Every visual references a key from this map so images can be swapped in one place.

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const IMG = {
  // Verified
  teotihuacanBalloons: u("photo-1518548419970-58e3b4079ab2"),
  teotihuacanPyramid: u("photo-1565017228812-8c6f33398b66"),
  teotihuacanAerial: u("photo-1580619305218-8423a7ef79b4"),
  chichenItza: u("photo-1518638150340-f706e86654de"),
  yucatanCenote: u("photo-1544551763-46a013bb70d5"),
  guanajuato: u("photo-1513407030348-c983a97b98d8"),
  guanajuatoHills: u("photo-1564507592333-c60657eea523"),
  guanajuatoAerial: u("photo-1596422846543-75c6fc197f07"),
  cdmx: u("photo-1518105779142-d975f22f1b0a"),
  cdmxBellasArtes: u("photo-1585464231875-d9ef1f5ad396"),
  sanMiguel: u("photo-1512813195386-6cf811ad3542"),

  // Destination-specific
  monterrey: u("photo-1623082574085-157d955f1d35"),
  rivieraMaya: u("photo-1510414842594-a61c69b5ae57"),
  hacienda: u("photo-1582719508461-905c673771fd"),
  atelierNotebook: u("photo-1517842645767-c639042777db"),
  mexicanFood: u("photo-1565299585323-38d6b0865b47"),
  oaxaca: u("photo-1560259930-5a8b96294f2d"),
  taxco: u("photo-1599946347371-68eb71b16afc"),
  forestLake: u("photo-1476514525535-07fb3b4ae5f1"),
  waterfall: u("photo-1432405972618-c60b0225b8f9"),
  whale: u("photo-1568430462989-44163eb1752f"),
  pottery: u("photo-1565193566173-7a0ee3dbe261"),
  hotSprings: u("photo-1544161515-4ab6ce6db874"),
  tepoztlan: u("photo-1506905925346-21bda4d32df4"),
  cave: u("photo-1504386106331-3e4e71712b38"),
  flowerCarpet: u("photo-1490750967868-88aa4486c946"),
  huasteca: u("photo-1501785888041-af3ef285b470"),
  jungleCoast: u("photo-1507525428034-b723cf961d3e"),
  sunflowers: u("photo-1470509037663-253afd7f0f51"),
  cholula: u("photo-1518709268805-4e9042af9f23"),
  gulfBeach: u("photo-1519046904884-53103b34b206"),
  fireflies: u("photo-1507400492013-162706c8c05e"),
  monarch: u("photo-1526336024174-e58f5cdd8e13"),
  seaTurtle: u("photo-1437622368342-7a3d73a34c8f"),
  papelPicado: u("photo-1514539079130-25950c84af65"),
  agave: u("photo-1516535794938-6063878f08cc"),
  burger: u("photo-1550547660-d9450f859349"),
  pinkWall: u("photo-1513519245088-0e12902e5a38"),
} as const;

export type ImageKey = keyof typeof IMG;