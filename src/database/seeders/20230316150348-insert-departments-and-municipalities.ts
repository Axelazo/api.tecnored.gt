import { QueryInterface } from "sequelize";

interface department {
  title: string;
  municipalities: municipality[];
}

interface municipality {
  title: string;
}

const guatemala: department[] = [
  {
    title: "Alta Verapaz",
    municipalities: [
      { title: "Chahal" },
      { title: "Chisec" },
      { title: "Cobán" },
      { title: "Fray Bartolomé de las Casas" },
      { title: "Lanquín" },
      { title: "Panzós" },
      { title: "Raxruha" },
      { title: "San Cristóbal Verapaz" },
      { title: "San Juan Chamelco" },
      { title: "San Pedro Carchá" },
      { title: "Santa Cruz Verapaz" },
      { title: "Senahú" },
      { title: "Tactic" },
      { title: "Tamahú" },
      { title: "Tucurú" },
      { title: "Santa María Cahabón" },
      { title: "Santa Catarina La Tinta" },
    ],
  },
  {
    title: "Baja Verapaz",
    municipalities: [
      { title: "Cubulco" },
      { title: "Granados" },
      { title: "Purulhá" },
      { title: "Rabinal" },
      { title: "Salamá" },
      { title: "San Jerónimo" },
      { title: "San Miguel Chicaj" },
      { title: "Santa Cruz El Chol" },
    ],
  },
  {
    title: "Chimaltenango",
    municipalities: [
      { title: "Acatenango" },
      { title: "Chimaltenango" },
      { title: "El Tejar" },
      { title: "Parramos" },
      { title: "Patzicía" },
      { title: "Patzún" },
      { title: "Pochuta" },
      { title: "San Andrés Itzapa" },
      { title: "San José Poaquil" },
      { title: "San Juan Comalapa" },
      { title: "San Martín Jilotepeque" },
      { title: "Santa Apolonia" },
      { title: "Santa Cruz Balanyá" },
      { title: "Tecpán Guatemala" },
      { title: "Yepocapa" },
      { title: "Zaragoza" },
    ],
  },
  {
    title: "Chiquimula",
    municipalities: [
      { title: "Camotán" },
      { title: "Chiquimula" },
      { title: "Concepción Las Minas" },
      { title: "Esquipulas" },
      { title: "Ipala" },
      { title: "Jocotán" },
      { title: "Olopa" },
      { title: "Quezaltepeque" },
      { title: "San Jacinto" },
      { title: "San José La Arada" },
      { title: "San Juan Ermita" },
    ],
  },
  {
    title: "El Progreso",
    municipalities: [
      { title: "El Jícaro" },
      { title: "Guastatoya" },
      { title: "Morazán" },
      { title: "San Agustín Acasaguastlán" },
      { title: "San Antonio La Paz" },
      { title: "San Cristóbal Acasaguastlán" },
      { title: "Sanarate" },
    ],
  },
  {
    title: "Escuintla",
    municipalities: [
      { title: "Escuintla" },
      { title: "Guanagazapa" },
      { title: "Iztapa" },
      { title: "La Democracia" },
      { title: "La Gomera" },
      { title: "Masagua" },
      { title: "Nueva Concepción" },
      { title: "Palín" },
      { title: "San José" },
      { title: "San Vicente Pacaya" },
      { title: "Santa Lucía Cotzumalguapa" },
      { title: "Siquinalá" },
      { title: "Tiquisate" },
    ],
  },
  {
    title: "Guatemala",
    municipalities: [
      { title: "Amatitlán" },
      { title: "Chinautla" },
      { title: "Chuarrancho" },
      { title: "Fraijanes" },
      { title: "Guatemala City" },
      { title: "Mixco" },
      { title: "Palencia" },
      { title: "Petapa" },
      { title: "San José del Golfo" },
      { title: "San José Pinula" },
      { title: "San Juan Sacatepéquez" },
      { title: "San Pedro Ayampuc" },
      { title: "San Pedro Sacatepéquez" },
      { title: "San Raymundo" },
      { title: "Santa Catarina Pinula" },
      { title: "Villa Canales" },
    ],
  },
  {
    title: "Huehuetenango",
    municipalities: [
      { title: "Aguacatán" },
      { title: "Chiantla" },
      { title: "Colotenango" },
      { title: "Concepción Huista" },
      { title: "Cuilco" },
      { title: "Huehuetenango" },
      { title: "Ixtahuacán" },
      { title: "Jacaltenango" },
      { title: "La Democracia" },
      { title: "La Libertad" },
      { title: "Malacatancito" },
      { title: "Nentón" },
      { title: "San Antonio Huista" },
      { title: "San Gaspar Ixchil" },
      { title: "San Juan Atitán" },
      { title: "San Juan Ixcoy" },
      { title: "San Mateo Ixtatán" },
      { title: "San Miguel Acatán" },
      { title: "San Pedro Necta" },
      { title: "San Rafael La Independencia" },
      { title: "San Rafael Petzal" },
      { title: "San Sebastián Coatán" },
      { title: "San Sebastián Huehuetenango" },
      { title: "Santa Ana Huista" },
      { title: "Santa Bárbara" },
      { title: "Santa Cruz Barillas" },
      { title: "Santa Eulalia" },
      { title: "Santiago Chimaltenango" },
      { title: "Soloma" },
      { title: "Tectitán" },
      { title: "Todos Santos Cuchumatan" },
    ],
  },
  {
    title: "Izabal",
    municipalities: [
      { title: "El Estor" },
      { title: "Livingston" },
      { title: "Los Amates" },
      { title: "Morales" },
      { title: "Puerto Barrios" },
    ],
  },
  {
    title: "Jalapa",
    municipalities: [
      { title: "Jalapa" },
      { title: "Mataquescuintla" },
      { title: "Monjas" },
      { title: "San Carlos Alzatate" },
      { title: "San Luis Jilotepeque" },
      { title: "San Manuel Chaparrón" },
      { title: "San Pedro Pinula" },
    ],
  },
  {
    title: "Jutiapa",
    municipalities: [
      { title: "Agua Blanca" },
      { title: "Asunción Mita" },
      { title: "Atescatempa" },
      { title: "Comapa" },
      { title: "Conguaco" },
      { title: "El Adelanto" },
      { title: "El Progreso" },
      { title: "Jalpatagua" },
      { title: "Jerez" },
      { title: "Jutiapa" },
      { title: "Moyuta" },
      { title: "Pasaco" },
      { title: "Quezada" },
      { title: "San José Acatempa" },
      { title: "Santa Catarina Mita" },
      { title: "Yupiltepeque" },
      { title: "Zapotitlán" },
    ],
  },
  {
    title: "Petén",
    municipalities: [
      { title: "Dolores" },
      { title: "Flores" },
      { title: "La Libertad" },
      { title: "Melchor de Mencos" },
      { title: "Poptún" },
      { title: "San Andrés" },
      { title: "San Benito" },
      { title: "San Francisco" },
      { title: "San José" },
      { title: "San Luis" },
      { title: "Santa Ana" },
      { title: "Sayaxché" },
      { title: "Las Cruces" },
    ],
  },
  {
    title: "Quetzaltenango",
    municipalities: [
      { title: "Almolonga" },
      { title: "Cabricán" },
      { title: "Cajolá" },
      { title: "Cantel" },
      { title: "Coatepeque" },
      { title: "Colomba" },
      { title: "Concepción Chiquirichapa" },
      { title: "El Palmar" },
      { title: "Flores Costa Cuca" },
      { title: "Génova" },
      { title: "Huitán" },
      { title: "La Esperanza" },
      { title: "Olintepeque" },
      { title: "Ostuncalco" },
      { title: "Palestina de Los Altos" },
      { title: "Quetzaltenango" },
      { title: "Salcajá" },
      { title: "San Carlos Sija" },
      { title: "San Francisco La Unión" },
      { title: "San Martín Sacatepéquez" },
      { title: "San Mateo" },
      { title: "San Miguel Sigüilá" },
      { title: "Sibilia" },
      { title: "Zunil" },
    ],
  },
  {
    title: "Quiché",
    municipalities: [
      { title: "Canillá" },
      { title: "Chajul" },
      { title: "Chicamán" },
      { title: "Chiché" },
      { title: "Chichicastenango" },
      { title: "Chinique" },
      { title: "Cunén" },
      { title: "Ixcán" },
      { title: "Joyabaj" },
      { title: "Nebaj" },
      { title: "Pachalum" },
      { title: "Patzité" },
      { title: "Sacapulas" },
      { title: "San Andrés Sajcabajá" },
      { title: "San Antonio Ilotenango" },
      { title: "San Bartolomé Jocotenango" },
      { title: "San Juan Cotzal" },
      { title: "San Pedro Jocopilas" },
      { title: "Santa Cruz del Quiché" },
      { title: "Uspantán" },
      { title: "Zacualpa" },
    ],
  },
  {
    title: "Retalhuleu",
    municipalities: [
      { title: "Champerico" },
      { title: "El Asintal" },
      { title: "Nuevo San Carlos" },
      { title: "Retalhuleu" },
      { title: "San Andrés Villa Seca" },
      { title: "San Felipe" },
      { title: "San Martín Zapotitlán" },
      { title: "San Sebastián" },
      { title: "Santa Cruz Muluá" },
    ],
  },
  {
    title: "Sacatepéquez",
    municipalities: [
      { title: "Alotenango" },
      { title: "Antigua" },
      { title: "Ciudad Vieja" },
      { title: "Jocotenango" },
      { title: "Magdalena Milpas Altas" },
      { title: "Pastores" },
      { title: "San Antonio Aguas Calientes" },
      { title: "San Bartolomé Milpas Altas" },
      { title: "San Lucas Sacatepéquez" },
      { title: "San Miguel Dueñas" },
      { title: "Santa Catarina Barahona" },
      { title: "Santa Lucía Milpas Altas" },
      { title: "Santa María de Jesús" },
      { title: "Santiago Sacatepéquez" },
      { title: "Santo Domingo Xenacoj" },
      { title: "Sumpango" },
    ],
  },
  {
    title: "San Marcos",
    municipalities: [
      { title: "Ayutla" },
      { title: "Catarina" },
      { title: "Comitancillo" },
      { title: "Concepción Tutuapa" },
      { title: "El Quetzal" },
      { title: "El Rodeo" },
      { title: "El Tumbador" },
      { title: "Esquipulas Palo Gordo" },
      { title: "Ixchiguan" },
      { title: "La Reforma" },
      { title: "Malacatán" },
      { title: "Nuevo Progreso" },
      { title: "Ocos" },
      { title: "Pajapita" },
      { title: "Río Blanco" },
      { title: "San Antonio Sacatepéquez" },
      { title: "San Cristóbal Cucho" },
      { title: "San José Ojetenam" },
      { title: "San Lorenzo" },
      { title: "San Marcos" },
      { title: "San Miguel Ixtahuacán" },
      { title: "San Pablo" },
      { title: "San Pedro Sacatepéquez" },
      { title: "San Rafael Pie de La Cuesta" },
      { title: "San Sibinal" },
      { title: "Sipacapa" },
      { title: "Tacaná" },
      { title: "Tajumulco" },
      { title: "Tejutla" },
    ],
  },
  {
    title: "Santa Rosa",
    municipalities: [
      { title: "Barberena" },
      { title: "Casillas" },
      { title: "Chiquimulilla" },
      { title: "Cuilapa" },
      { title: "Guazacapán" },
      { title: "Nueva Santa Rosa" },
      { title: "Oratorio" },
      { title: "Pueblo Nuevo Viñas" },
      { title: "San Juan Tecuaco" },
      { title: "San Rafael Las Flores" },
      { title: "Santa Cruz Naranjo" },
      { title: "Santa María Ixhuatán" },
      { title: "Santa Rosa de Lima" },
      { title: "Taxisco" },
    ],
  },
  {
    title: "Sololá",
    municipalities: [
      { title: "Concepción" },
      { title: "Nahualá" },
      { title: "Panajachel" },
      { title: "San Andrés Semetabaj" },
      { title: "San Antonio Palopó" },
      { title: "San José Chacaya" },
      { title: "San Juan La Laguna" },
      { title: "San Lucas Tolimán" },
      { title: "San Marcos La Laguna" },
      { title: "San Pablo La Laguna" },
      { title: "San Pedro La Laguna" },
      { title: "Santa Catarina Ixtahuacan" },
      { title: "Santa Catarina Palopó" },
      { title: "Santa Clara La Laguna" },
      { title: "Santa Cruz La Laguna" },
      { title: "Santa Lucía Utatlán" },
      { title: "Santa María Visitación" },
      { title: "Santiago Atitlán" },
      { title: "Sololá" },
    ],
  },
  {
    title: "Suchitepéquez",
    municipalities: [
      { title: "Chicacao" },
      { title: "Cuyotenango" },
      { title: "Mazatenango" },
      { title: "Patulul" },
      { title: "Pueblo Nuevo" },
      { title: "Río Bravo" },
      { title: "Samayac" },
      { title: "San Antonio Suchitepéquez" },
      { title: "San Bernardino" },
      { title: "San Francisco Zapotitlán" },
      { title: "San Gabriel" },
      { title: "San José El Idolo" },
      { title: "San Juan Bautista" },
      { title: "San Lorenzo" },
      { title: "San Miguel Panán" },
      { title: "San Pablo Jocopilas" },
      { title: "Santa Bárbara" },
      { title: "Santo Domingo Suchitepequez" },
      { title: "Santo Tomas La Unión" },
      { title: "Zunilito" },
    ],
  },
  {
    title: "Totonicapán",
    municipalities: [
      { title: "Momostenango" },
      { title: "San Andrés Xecul" },
      { title: "San Bartolo" },
      { title: "San Cristóbal Totonicapán" },
      { title: "San Francisco El Alto" },
      { title: "Santa Lucía La Reforma" },
      { title: "Santa María Chiquimula" },
      { title: "Totonicapán" },
    ],
  },
  {
    title: "Zacapa",
    municipalities: [
      { title: "Cabañas" },
      { title: "Estanzuela" },
      { title: "Gualán" },
      { title: "Huité" },
      { title: "La Unión" },
      { title: "Río Hondo" },
      { title: "San Diego" },
      { title: "Teculután" },
      { title: "Usumatlán" },
      { title: "Zacapa" },
    ],
  },
];

/* module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    const promises: number | object[] = [];
    guatemala.forEach((department, index) => {
      const depPromise = queryInterface.bulkInsert("departments", [
        {
          id: index + 1,
          name: department.title,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      promises.push(depPromise);

      const munPromises = department.municipalities.map((municipality) =>
        queryInterface.bulkInsert("municipalities", [
          {
            departmentId: index + 1,
            name: municipality.title,
          },
        ])
      );
      promises.push(...munPromises);
    });
    return Promise.all(promises);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkDelete("municipalities", {}, {}),
      queryInterface.bulkDelete("departments", {}, {}),
    ]);
  },
}; */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<number | object> => {
    try {
      const departmentPromises = guatemala.map((department, index) => {
        return queryInterface.bulkInsert("departments", [
          {
            id: index + 1,
            name: department.title,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });

      await Promise.all(departmentPromises);

      const municipalityPromises: Promise<number | object>[] = [];
      guatemala.forEach((department, index) => {
        const munPromises = department.municipalities.map((municipality) => {
          return queryInterface.bulkInsert("municipalities", [
            {
              departmentId: index + 1,
              name: municipality.title,
            },
          ]);
        });
        municipalityPromises.push(...munPromises);
      });

      await Promise.all(municipalityPromises);

      return {}; // Return an empty object to indicate success
    } catch (error) {
      return Promise.reject(error); // Return a rejected Promise if there's an error
    }
  },

  down: async (queryInterface: QueryInterface): Promise<number | object> => {
    try {
      await queryInterface.bulkDelete("municipalities", {}, {});
      await queryInterface.bulkDelete("departments", {}, {});
      return {}; // Return an empty object to indicate success
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
