// DestinoLibre — catálogo central de fotografías.

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const IMG = {
  // Patrimonio y ciudades mexicanas
  sanMiguel: u("photo-1739582766996-15122a4022b5"), // San Miguel de Allende, parroquia y ciudad
  guanajuato: u("photo-1656297861979-fff9a471d03a"), // Guanajuato colonial
  guanajuatoHills: u("photo-1589047629464-2c84baeac54f"), // Guanajuato entre montañas
  guanajuatoAerial: u("photo-1688464912749-d13b711e2dcd"), // Guanajuato visto desde arriba, noche
  taxco: u("photo-1477616023931-7d9aa7c1c1b4"), // Taxco, templo de Santa Prisca y ciudad
  oaxaca: u("photo-1650157974310-b4feabffa291"), // Templo de Santo Domingo, Oaxaca
  cdmx: u("photo-1772049214534-8d3e8ae7d025"), // Catedral y Zócalo de CDMX
  cdmxBellasArtes: u("photo-1533251568747-725d423801d3"), // Palacio de Bellas Artes
  monterrey: u("photo-1444222362538-bfeab10e1282"), // Cerro de la Silla
  cholula: u("photo-1578651008118-7cfe694baa57"), // Cholula y Popocatépetl
  tepoztlan: u("photo-1647721321943-498b7f02e8d8"), // Tepoztlán y sus montañas

  // Teotihuacán: encuadres diferentes para experiencias diferentes
  teotihuacanBalloons: u("photo-1745873862837-689dac78f256"), // Globos sobre la pirámide
  teotihuacanPyramid: u("photo-1745874051483-603d99bfd443"), // Pirámide del Sol sin globos
  teotihuacanAerial: u("photo-1672687468601-8f7c7fefa69c"), // Vista aérea de la zona arqueológica

  // Cultura maya, Caribe y costa
  chichenItza: u("photo-1568402102990-bc541580b59f"), // El Castillo, Chichén Itzá
  yucatanCenote: u("photo-1665617366582-ad4847f7c439"), // Cenote Ik-Kil, Yucatán
  rivieraMaya: u("photo-1728521981416-2f0fc9a65939"), // Playa de Riviera Maya
  gulfBeach: u("photo-1670015848293-499b6b226d23"), // Playa del litoral veracruzano
  jungleCoast: u("photo-1619565901793-c1e122d7a0d4"), // Punta Roca Partida, Veracruz
  whale: u("photo-1731362947825-503a7ff4763a"), // Ballena jorobada en Bahía de Banderas
  seaTurtle: u("photo-1773802548829-9d4be70b6f7b"), // Tortuga marina (imagen ilustrativa de Xcaret)

  // Naturaleza y aventura
  forestLake: u("photo-1693877852824-f045642f9c4e"), // Presa rodeada de bosque, Villa del Carbón
  waterfall: u("photo-1578196785055-adcd4521f95f"), // Cascada de Tulimán, Puebla; ilustrativa de la aventura
  huasteca: u("photo-1732798573441-71372ffd1890"), // Río y cascada de Tamul, Huasteca Potosina
  hotSprings: u("photo-1766485108563-4fa16ba48140"), // Piscina termal al aire libre; ilustrativa, no Chignahuapan
  cave: u("photo-1764250406095-be6b157a2fd5"), // Estalactitas y estalagmitas; ilustrativa, no Cacahuamilpa
  sunflowers: u("photo-1552160793-cbaf3ebcba72"), // Campo de girasoles
  fireflies: u("photo-1753676537771-ebc50f87d23b"), // Luciérnagas en bosque nocturno; ilustrativa
  monarch: u("photo-1717195804032-297fdaa1ca6c"), // Mariposas monarca, Michoacán

  // Tradiciones, artesanías y experiencias
  pottery: u("photo-1772986221132-25a53d240941"), // Artesanías de barro en Metepec
  flowerCarpet: u("photo-1758959975358-95f5127660d0"), // Alfombra de pétalos creada en la calle; ilustrativa de la tradición de Huamantla
  papelPicado: u("photo-1768106048154-f2bd5408a23d"), // Papel picado en una plaza mexicana
  agave: u("photo-1764258492968-cb5539ef2564"), // Cultivos de agave en Tequila, Jalisco
  pinkWall: u("photo-1662098011169-112c13e9cd7f"), // Val'Quirico, arquitectura de piedra (ruta floral)
  hacienda: u("photo-1668656985972-e57865a85efb"), // Patio colonial de hacienda en Yucatán
  atelierNotebook: u("photo-1743385779312-73ea241025d8"), // Cuaderno abierto para planeación
  mexicanFood: u("photo-1722631864812-36f55a8dfcf2"), // Tacos y gastronomía mexicana
  burger: u("photo-1688912741123-0d3faba48f02"), // Hamburguesa con papas, Burger Tour
} as const;

export type ImageKey = keyof typeof IMG;