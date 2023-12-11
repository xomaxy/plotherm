valor = 10000
valor_secundario = 1151.8
caso_seleccionado = "PT"

// Test github

// cambios hechos por ángel

/// Hay que aprender bien esto Angel para vernos bien pros
//////// Cambio del 9/12/23 me gusta este sisrtema de versiones 
////// Voy a poner aqui las instrucciones de Git para que no se olviden 
/////// git add.  /// es para agregar los archivos al mensaje 
/////// git commit -m "mensaje de que cambios hice" ////
/////// git push https://github.com/xomaxy/plotherm ////// subir cambios al repo 
/////// git pull /////// Jalar los cambios 

////  Esto interpola los datos ////
function interpolacion(Dp, Dd, Da, Xa, Xp) {
  ///Dp Dato posterior 
  //Da Dato anterior 
  //Dd Dato dado 
  //Xa Dato anterior al buscado 
  //Xp Dato posterior al buscado

    let resultado_interpolacion_simple = (((Dp-Dd)/(Dp-Da))*(Xa))+(((Dd-Da)/(Dp-Da))*Xp) ///////ecuacion de interpolacion
  return resultado_interpolacion_simple;
    }
function extrapolacion(Dd,Da1,Da2,Xa1,Xa2){
  let resultado_extrapolacion = Xa1 + (((Dd-Da1)/(Da2-Da1))*(Xa2-Xa1));
  return resultado_extrapolacion;
}
/////// La calidad es fundamental en el software pues nos permite determinar el pocentaje de mezcla liquido-gas 
function calidad(Mi,MILG,MIGL){
  let calidad = ((Mi-MILG)/(MIGL-MILG));
  return calidad;
}
/////// Con casos intracampana en posible determinar el valor de las variables H U V S con la calidad mediante la siguiente ecuacion 
function M_intermedia(Calidad_x,MILG,MIGL){
  let M_inter = ((1-Calidad_x)*MILG)+(Calidad_x*MIGL);
  return M_inter;
}
// Función para encontrar el valor máximo en un array (mi columna de interes T o P segun el caso A4 o A5 segun corresponda)
function encontrarMaximo(array) {
  if (array.length === 0) {
    return undefined; // Devuelve undefined si el array está vacío
  }

  let maximo = array[0];

  for (let i = 1; i < array.length; i++) {
    if (array[i] > maximo) {
      maximo = array[i];
    }
  }

  return maximo;
}
// Función para encontrar el valor mínimo en un array (mi columna de interes T o P segun el caso A4 o A5 segun corresponda)
function encontrarMinimo(array) {
  if (array.length === 0) {
    return undefined; // Devuelve undefined si el array está vacío
  }

  let minimo = array[0];

  for (let i = 1; i < array.length; i++) {
    if (array[i] < minimo) {
      minimo = array[i];
    }
  }

  return minimo;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////// Funcion para imprimir los valores correspondientes de la linea al valor ingresado y en caso de que no este ///////////////////
////////////// dentro de los limites superior e inferior lo interpola con la funcion interpolacion //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function buscarEnColumna(columna, columna2, valorBuscado) {
  // Iterar a través de los elementos de la columna
  for (let i = 0; i < columna.length; i++) {
    // Verificar si el valor actual coincide con el valor buscado
    if (columna[i] === valorBuscado) {
       // Imprimir el valor correspondiente en miColumna2
       valor_en_mismo_indice = columna2[i]
       // Devolver el índice donde se encontró el valor
       return valor_en_mismo_indice;
       
    }
    if (columna[i] < valorBuscado && columna[i + 1] > valorBuscado) {
      // Realizar interpolación si es necesario
      const resultadoInterpolacion = interpolacion(
        columna[i + 1],
        valorBuscado,
        columna[i],
        columna2[i],
        columna2[i + 1]
      );
      return resultadoInterpolacion;
    }
    
    
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// Funcion para que cambie el array de la columnas segun cambie el caso ///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function rotacion_de_valores_array(caso) {
  if (caso === "TH" || caso === "TU" || caso === "TV" || caso === "TS" ||  caso === "TX") {
      return "A4";
  }
  if (caso === "PH" || caso === "PU" || caso === "PV" || caso === "PS" ||  caso === "PX" || caso === "PT") {
      return "A5";
  }
} ///////// Hay que considerar tambien que se debe tomar en cuenta la calidad para determinar la tabla 

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Extraer datos del excel para su manejo POR COLUMNAS de A4 y A5 /////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const xlsx = require('xlsx');
const fs = require('fs');
const { match } = require('assert');
const { CONNREFUSED } = require('dns');
const { log, Console } = require('console');

let tabla_de_trabajo = rotacion_de_valores_array(caso_seleccionado) //////////////// CORREGIR DEBE DEPENDER DE LA FUNCION rotacion_de_valores_array 

let rutaArchivo;
if (tabla_de_trabajo === "A4") {
  rutaArchivo = 'C:\\Users\\adan_\\Desktop\\Software Termo\\A4.xlsx';
} 
if (tabla_de_trabajo === "A5") {
  rutaArchivo = 'C:\\Users\\adan_\\Desktop\\Software Termo\\A5.xlsx';
}

// Leer el contenido del archivo Excel
const contenidoArchivo = fs.readFileSync(rutaArchivo);

// Convertir el contenido a un objeto de libro de trabajo (workbook)
const libroDeTrabajo = xlsx.read(contenidoArchivo, { type: 'buffer' });

// Seleccionar la primera hoja del libro de trabajo
const nombreHoja = libroDeTrabajo.SheetNames[0];
const hoja = libroDeTrabajo.Sheets[nombreHoja];

// Obtener la matriz de celdas
const matrizCeldas = xlsx.utils.sheet_to_json(hoja, { header: 1 });

// Extraer la primera columnas
const Columna_1 = matrizCeldas.map(fila => fila[0]);
const Columna_2 = matrizCeldas.map(fila => fila[1]);
const Columna_HILG = matrizCeldas.map(fila => fila[2]);
const Columna_HIGL = matrizCeldas.map(fila => fila[3]);
const Columna_UILG = matrizCeldas.map(fila => fila[4]);
const Columna_UIGL = matrizCeldas.map(fila => fila[5]);
const Columna_VILG = matrizCeldas.map(fila => fila[6]);
const Columna_VIGL = matrizCeldas.map(fila => fila[7]);
const Columna_SILG = matrizCeldas.map(fila => fila[8]);
const Columna_SIGL = matrizCeldas.map(fila => fila[9]);
const Columna_HEVAP = matrizCeldas.map(fila => fila[10]);
const Columna_UEVAP = matrizCeldas.map(fila => fila[11]);
const Columna_SEVAP = matrizCeldas.map(fila => fila[12]);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Extraer datos del excel para su manejo POR FAMILIAS de la A6 y A7 /////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    rutaArchivo_A6 = 'C:\\Users\\adan_\\Desktop\\Software Termo\\A6.xlsx';
    
    // Leer el contenido del archivo Excel
    const contenidoArchivo_A6 = fs.readFileSync(rutaArchivo_A6);

    // Convertir el contenido a un objeto de libro de trabajo (workbook)
    const libroDeTrabajo_A6 = xlsx.read(contenidoArchivo_A6, { type: 'buffer' });

    // Seleccionar la primera hoja del libro de trabajo
    const nombreHoja_A6 = libroDeTrabajo_A6.SheetNames[0];
    const hoja_A6 = libroDeTrabajo_A6.Sheets[nombreHoja];

    // Obtener la matriz de celdas
    const matrizCeldas_A6 = xlsx.utils.sheet_to_json(hoja_A6, { header: 1 });

    // Encontrar la longitud máxima entre todas las filas
    const longitudMaxima_A6 = matrizCeldas_A6.reduce((max, fila) => Math.max(max, fila.length), 0);

    // Definir el tamaño de las familias
    const tamanoFamilia = 5;

    // Dividir la matriz en familias de 5 columnas
    const familias_A6 = [];
    for (let i = 0; i < longitudMaxima_A6; i += tamanoFamilia) {
      const familia = [];
      for (let j = 0; j < tamanoFamilia; j++) {
        const columna = matrizCeldas_A6.map(fila => fila[i + j]);
        familia.push(columna);
      }
      familias_A6.push(familia);
    }

    rutaArchivo_A7 = 'C:\\Users\\adan_\\Desktop\\Software Termo\\A7.xlsx';

    // Leer el contenido del archivo Excel
    const contenidoArchivo_A7 = fs.readFileSync(rutaArchivo_A7);

    // Convertir el contenido a un objeto de libro de trabajo (workbook)
    const libroDeTrabajo_A7 = xlsx.read(contenidoArchivo_A7, { type: 'buffer' });

    // Seleccionar la primera hoja del libro de trabajo
    const nombreHoja_A7 = libroDeTrabajo_A7.SheetNames[0];
    const hoja_A7 = libroDeTrabajo_A7.Sheets[nombreHoja];

    // Obtener la matriz de celdas
    const matrizCeldas_A7 = xlsx.utils.sheet_to_json(hoja_A7, { header: 1 });

    // Encontrar la longitud máxima entre todas las filas
    const longitudMaxima_A7 = matrizCeldas_A7.reduce((max, fila) => Math.max(max, fila.length), 0);

    
        // Dividir la matriz en familias de 5 columnas
    const familias_A7 = [];
    for (let i = 0; i < longitudMaxima_A7; i += tamanoFamilia) {
      const familia = [];
      for (let j = 0; j < tamanoFamilia; j++) {
        const columna = matrizCeldas_A7.map(fila => fila[i + j]);
        familia.push(columna);
      }
      familias_A7.push(familia);
    }
    


const Indices_de_presiones_tabla_A_6 = [10, 50, 100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000, 3500, 4000, 4500,
5000,6000, 7000, 8000, 9000, 10000, 12500, 15000, 17500, 20000, 25000, 30000, 35000, 40000, 50000, 60000]; /////Estas son las presiones de cada
  /// tabla (familia), de presiones de la A6
const Indices_de_presiones_tabla_A_7 = [5000, 10000, 15000, 20000,30000, 50000]

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////Para las Fuera de campana, necesita la funcion de interpolacion doble DOLIOOOOOOOOOOO Pd. Ojala sirva 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////


function buscar_tablita(presion,Indices_de_presiones,valor_secundario,caso_seleccionado,familias) {
  // Iterar a través de los elementos de la columna
  let estado = -1
  max_indice = Math.max(...Indices_de_presiones)
  min_indice = Math.min(...Indices_de_presiones)
  if(caso_seleccionado != "PT"){
  if(valor_secundario > HIGL || valor_secundario > UIGL || valor_secundario > SIGL || valor_secundario > VIGL){
    Calidad = 1
  }
  if(valor_secundario < HILG ||  valor_secundario < UILG  || valor_secundario < SILG || valor_secundario < VILG){
    Calidad = 0
  }
}
  if(caso_seleccionado === "PT"){
    if(valor_secundario > T){
      Calidad = 1
    }
    if(valor_secundario < T){
      Calidad = 0
    }
    
  }

  for (let i = 0; i < Indices_de_presiones.length; i++) {


    // Verificar si el valor actual coincide con el valor buscado
    if(presion > max_indice){
      if(caso_seleccionado === "PV"){
        V = extrapolacion(presion,Indices_de_presiones[i-1],Indices_de_presiones[i],buscarEnColumna(T_a,V_a,valor_secundario),
        buscarEnColumna(T_p,V_p,valor_secundario))
      }
      return estado = "Dato por encima de la presion tabulada, se esta trabajando en eso. Por favor coloca un valor más pequeño" /////// Area Pendiente para extrapolar
    }
    if(presion < min_indice){
      
      return estado = "Dato por debajo de la presion tabulada, se esta trabajando en eso. Por favor coloca un valor más grande" /////// Area Pendiente para extrapolar
    }
    if (Indices_de_presiones[i] === presion) {
       tabla_de_interes = familias[i] 
       
      if(caso_seleccionado === "PT"){
        tabla = tabla_de_interes[0]
        tabla_filtrada = tabla.filter(value => value !== undefined)
        min = Math.min(...tabla_filtrada)
        max = Math.max(...tabla_filtrada)
        posicion_max = tabla_filtrada.indexOf(max)


        if(valor_secundario > max && valor_secundario > min){
          V = extrapolacion(valor_secundario,tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max],
            tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max])
          U = extrapolacion(valor_secundario,tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max],
             tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max])
          H = extrapolacion(valor_secundario,tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max],
             tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max])
          S = extrapolacion(valor_secundario,tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max],
             tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max])
          Densidad = 1/V;
          estado = [valor_secundario,presion,Calidad,V,U,H,S,Densidad] //  T P C V U H S D
        }
        if(valor_secundario > min && valor_secundario < max){
          V = buscarEnColumna(tabla_de_interes[0],tabla_de_interes[1],valor_secundario);
          U = buscarEnColumna(tabla_de_interes[0],tabla_de_interes[2],valor_secundario);
          H = buscarEnColumna(tabla_de_interes[0],tabla_de_interes[3],valor_secundario);
          S = buscarEnColumna(tabla_de_interes[0],tabla_de_interes[4],valor_secundario);
          Densidad = 1/V;
          estado = [valor_secundario,presion,Calidad,V,U,H,S,Densidad]
          
        }
        if(valor_secundario < min) {
          estado = ["valor por debajo de la temperatura de saturacion:",min]
      }
      return estado
    }
      if(caso_seleccionado === "PV"){
        tabla = tabla_de_interes[1]
        tabla_filtrada = tabla.filter(value => value !== undefined)
        min = Math.min(...tabla_filtrada)
        max = Math.max(...tabla_filtrada)
        posicion_max = tabla_filtrada.indexOf(max)
        if(valor_secundario > max && valor_secundario > min && valor_secundario < VILG){
          estado = "no se puede extrapolar por encima del valor maximo de la tempertura de saturacion"
        }
        if(valor_secundario > max && valor_secundario > min && valor_secundario > VIGL){
          T = extrapolacion(valor_secundario,tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max],
            tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max])
          U = extrapolacion(valor_secundario,tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max],
             tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max])
          H = extrapolacion(valor_secundario,tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max],
             tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max])
          S = extrapolacion(valor_secundario,tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max],
             tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max])
          Densidad = 1/valor_secundario;
          estado = [T,presion,Calidad,valor_secundario,U,H,S,Densidad] //  T P C V U H S D
        }
        if(valor_secundario > min && valor_secundario < max){
          T = buscarEnColumna(tabla_de_interes[1],tabla_de_interes[0],valor_secundario);
          U = buscarEnColumna(tabla_de_interes[1],tabla_de_interes[2],valor_secundario);
          H = buscarEnColumna(tabla_de_interes[1],tabla_de_interes[3],valor_secundario);
          S = buscarEnColumna(tabla_de_interes[1],tabla_de_interes[4],valor_secundario);
          Densidad = 1/valor_secundario;
          estado = [T,presion,Calidad,valor_secundario,U,H,S,Densidad] //  T P C V U H S D
        }
        if(valor_secundario < min){
          estado = ["valor por debajo de la temperatura de saturacion:",min]
        }
      return estado 
    }
      if(caso_seleccionado === "PU"){
        tabla = tabla_de_interes[2]
        tabla_filtrada = tabla.filter(value => value !== undefined)
        min = Math.min(...tabla_filtrada)
        max = Math.max(...tabla_filtrada)
        posicion_max = tabla_filtrada.indexOf(max)
        if(valor_secundario > max && valor_secundario > min && valor_secundario < UILG){
          estado = "no se puede extrapolar por encima del valor maximo de la tempertura de saturacion"
        }
        if(valor_secundario > max && valor_secundario > min && valor_secundario > UIGL){
          T = extrapolacion(valor_secundario,tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max],
            tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max])
          V = extrapolacion(valor_secundario,tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max],
             tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max])
          H = extrapolacion(valor_secundario,tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max],
             tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max])
          S = extrapolacion(valor_secundario,tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max],
             tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max])
          Densidad = 1/V;
          estado = [T,presion,Calidad,V,valor_secundario,H,S,Densidad] //  T P C V U H S D
        }
        if(valor_secundario > min && valor_secundario < max){
        T = buscarEnColumna(tabla_de_interes[2],tabla_de_interes[0],valor_secundario);
        V = buscarEnColumna(tabla_de_interes[2],tabla_de_interes[1],valor_secundario);
        H = buscarEnColumna(tabla_de_interes[2],tabla_de_interes[3],valor_secundario);
        S = buscarEnColumna(tabla_de_interes[2],tabla_de_interes[4],valor_secundario);
        Densidad = 1/V;
        estado = [T,presion,Calidad,V,valor_secundario,H,S,Densidad]  //  T P C V U H S D
        }
        
        if(valor_secundario < min){
        estado = ["valor por debajo de la temperatura de saturacion:",min]
      }
      return estado
    }
      if(caso_seleccionado === "PH"){
        tabla = tabla_de_interes[3]
        tabla_filtrada = tabla.filter(value => value !== undefined)
        min = Math.min(...tabla_filtrada)
        max = Math.max(...tabla_filtrada)
        posicion_max = tabla_filtrada.indexOf(max)
        if(valor_secundario > max && valor_secundario > min && valor_secundario < HILG){
          estado = "no se puede extrapolar por encima del valor maximo de la tempertura de saturacion"
        }
        if(valor_secundario > max && valor_secundario > min && valor_secundario > HIGL){
          T = extrapolacion(valor_secundario,tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max],
            tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max])
          V = extrapolacion(valor_secundario,tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max],
             tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max])
          U = extrapolacion(valor_secundario,tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max],
             tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max])
          S = extrapolacion(valor_secundario,tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max],
             tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max])
          Densidad = 1/V;
          estado = [T,presion,Calidad,V,U,valor_secundario,S,Densidad] //  T P C V U H S D
        }
        if(valor_secundario > min && valor_secundario < max){
        T = buscarEnColumna(tabla_de_interes[3],tabla_de_interes[0],valor_secundario);
        V = buscarEnColumna(tabla_de_interes[3],tabla_de_interes[1],valor_secundario);
        U = buscarEnColumna(tabla_de_interes[3],tabla_de_interes[2],valor_secundario);
        S = buscarEnColumna(tabla_de_interes[3],tabla_de_interes[4],valor_secundario);
        Densidad = 1/V;
        estado = [T,presion,Calidad,V,U,valor_secundario,S,Densidad] //  T P C V U H S D
        }
        
        if(valor_secundario < min){
        estado = ["valor por debajo de la temperatura de saturacion:",min]
      }
      return estado
    }
      if(caso_seleccionado === "PS"){
        tabla = tabla_de_interes[4]
        tabla_filtrada_ss = tabla.filter(value => value !== undefined)
        min = Math.min(...tabla_filtrada)
        max = Math.max(...tabla_filtrada)
        posicion_max = tabla_filtrada.indexOf(max)
        if(valor_secundario > max && valor_secundario > min && valor_secundario < SILG){
          estado = "no se puede extrapolar por encima del valor maximo de la tempertura de saturacion"
        }
        if(valor_secundario > max && valor_secundario > min && valor_secundario > SIGL){
          T = extrapolacion(valor_secundario,tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max],
            tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max])
          V = extrapolacion(valor_secundario,tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max],
             tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max])
          U = extrapolacion(valor_secundario,tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max],
             tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max])
          H = extrapolacion(valor_secundario,tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max],
             tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max])
          Densidad = 1/V;
          estado = [T,presion,Calidad,V,U,H,valor_secundario,Densidad] //  T P C V U H S D
        }
        if(valor_secundario > min && valor_secundario < max){
        T = buscarEnColumna(tabla_de_interes[4],tabla_de_interes[0],valor_secundario);
        V = buscarEnColumna(tabla_de_interes[4],tabla_de_interes[1],valor_secundario);
        U = buscarEnColumna(tabla_de_interes[4],tabla_de_interes[2],valor_secundario);
        H = buscarEnColumna(tabla_de_interes[4],tabla_de_interes[3],valor_secundario);
        Densidad = 1/V;
        estado = [T,presion,Calidad,V,U,H,valor_secundario,Densidad] //  T P C V U H S D
        }
        
        if(valor_secundario < min){
        estado = ["valor por debajo de la temperatura de saturacion:",min]
      }
      return estado
      }
    return estado;
    }
    
    presion_de_la_tabla_anterior = Indices_de_presiones[i];
    presion_de_la_tabla_posterior = Indices_de_presiones[i+1];
    tabla_posterior = familias[i+1]
    tabla_anterior = familias[i]
    T_a = tabla_anterior[0].filter(value => value !== undefined)
    T_p = tabla_posterior[0].filter(value => value !== undefined)
    V_a = tabla_anterior[1].filter(value => value !== undefined)
    V_p = tabla_posterior[1].filter(value => value !== undefined)
    U_a = tabla_anterior[2].filter(value => value !== undefined)
    U_p = tabla_posterior[2].filter(value => value !== undefined)
    H_a = tabla_anterior[3].filter(value => value !== undefined)
    H_p = tabla_posterior[3].filter(value => value !== undefined)
    S_a = tabla_anterior[4].filter(value => value !== undefined)
    S_p = tabla_posterior[4].filter(value => value !== undefined)
    
      min_T_a = Math.min(...T_a)
      max_T_a = Math.max(...T_a)
      min_T_p = Math.min(...T_p)
      max_T_p = Math.max(...T_p)
      min_V_a = Math.min(...V_a)
      max_V_a = Math.max(...V_a)
      min_V_p = Math.min(...V_p)
      max_V_p = Math.max(...V_p)
      min_U_a = Math.min(...U_a)
      max_U_a = Math.max(...U_a)
      min_U_p = Math.min(...U_p)
      max_U_p = Math.max(...U_p)
      min_H_a = Math.min(...H_a)
      max_H_a = Math.max(...H_a)
      min_H_p = Math.min(...H_p)
      max_H_p = Math.max(...H_p)
      min_S_a = Math.min(...S_a)
      max_S_a = Math.max(...S_a)
      min_S_p = Math.min(...S_p)
      max_S_p = Math.max(...S_p)

      posicion_max_anterior_T_a = T_a.indexOf(max_T_a)
      posicion_max_posterior_T_p = T_p.indexOf(max_T_p)
      posicion_max_anterior_V_a = V_a.indexOf(max_V_a)
      posicion_max_posterior_V_p = V_p.indexOf(max_V_p)
      posicion_max_anterior_U_a = U_a.indexOf(max_U_a)
      posicion_max_posterior_U_p = U_p.indexOf(max_U_p)
      posicion_max_anterior_H_a = H_a.indexOf(max_H_a)
      posicion_max_posterior_H_p = H_p.indexOf(max_H_p)
      posicion_max_anterior_S_a = S_a.indexOf(max_S_a)
      posicion_max_posterior_S_p = S_p.indexOf(max_S_p)

    if (Indices_de_presiones[i] < presion && Indices_de_presiones[i + 1] > presion){
     if(caso_seleccionado === "PT"){
      if(valor_secundario > max_T_p && valor_secundario > min_T_p){
        V = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
          extrapolacion(valor_secundario,T_a[posicion_max_anterior_T_a-1],max_T_a,V_a[posicion_max_anterior_V_a-1],max_V_a),
          extrapolacion(valor_secundario,T_p[posicion_max_posterior_T_p-1],max_T_p,V_p[posicion_max_posterior_V_p-1],max_V_p))
        U = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
          extrapolacion(valor_secundario,T_a[posicion_max_anterior_T_a-1],max_T_a,U_a[posicion_max_anterior_U_a-1],max_U_a),
          extrapolacion(valor_secundario,T_p[posicion_max_posterior_T_p-1],max_T_p,U_p[posicion_max_posterior_U_p-1],max_U_p))  
        H = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
          extrapolacion(valor_secundario,T_a[posicion_max_anterior_T_a-1],max_T_a,H_a[posicion_max_anterior_H_a-1],max_H_a),
          extrapolacion(valor_secundario,T_p[posicion_max_posterior_T_p-1],max_T_p,H_p[posicion_max_posterior_H_p-1],max_H_p))  
        S = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
          extrapolacion(valor_secundario,T_a[posicion_max_anterior_T_a-1],max_T_a,S_a[posicion_max_anterior_S_a-1],max_S_a),
          extrapolacion(valor_secundario,T_p[posicion_max_posterior_T_p-1],max_T_p,S_p[posicion_max_posterior_S_p-1],max_S_p))  
        Densidad = 1/V
        estado = [valor_secundario,presion,Calidad,V,U,H,S,Densidad] //  T P C V U H S D
      }
      if(valor_secundario > min_T_a && valor_secundario < max_T_a){
        V = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(T_a,V_a,valor_secundario),
        buscarEnColumna(T_p,V_p,valor_secundario));
        U = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(T_a,U_a,valor_secundario),
        buscarEnColumna(T_p,U_p,valor_secundario));
        H = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(T_a,H_a,valor_secundario),
        buscarEnColumna(T_p,H_p,valor_secundario));
        S = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(T_a,S_a,valor_secundario),
        buscarEnColumna(T_p,S_p,valor_secundario));
        Densidad = 1/V;
        estado = [valor_secundario,presion,Calidad,V,U,H,S,Densidad] //  T P C V U H S D
      }
      if(valor_secundario < min_T_p) {
        estado = ["valor secundario por debajo de la temperatura de saturacion;", min_T_p]    
    }
    return estado
  }
    if(caso_seleccionado === "PV"){
    if(valor_secundario > max_V_p && valor_secundario > min_V_p){
      consp
      T = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,V_a[posicion_max_anterior_V_a-1],max_V_a,T_a[posicion_max_anterior_T_a-1],max_T_a),
        extrapolacion(valor_secundario,V_p[posicion_max_posterior_V_p-1],max_V_p,T_p[posicion_max_posterior_V_p-1],max_T_p))
      U = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,V_a[posicion_max_anterior_V_a-1],max_V_a,U_a[posicion_max_anterior_U_a-1],max_U_a),
        extrapolacion(valor_secundario,V_p[posicion_max_posterior_V_p-1],max_V_p,U_p[posicion_max_posterior_U_p-1],max_U_p))  
      H = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,V_a[posicion_max_anterior_V_a-1],max_V_a,H_a[posicion_max_anterior_H_a-1],max_H_a),
        extrapolacion(valor_secundario,V_p[posicion_max_posterior_V_p-1],max_V_p,H_p[posicion_max_posterior_H_p-1],max_H_p))  
      S = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,V_a[posicion_max_anterior_V_a-1],max_V_a,S_a[posicion_max_anterior_S_a-1],max_S_a),
        extrapolacion(valor_secundario,V_p[posicion_max_posterior_V_p-1],max_V_p,S_p[posicion_max_posterior_S_p-1],max_S_p))  
      Densidad = 1/valor_secundario
      estado = [T,presion,Calidad,valor_secundario,U,H,S,Densidad] //  T P C V U H S D
    }
    if(valor_secundario > min_V_a && valor_secundario < max_V_a && valor_secundario > min_V_p && valor_secundario < max_V_p){
      if(valor_secundario > min_V_p && valor_secundario < max_V_p){
        T_x = buscarEnColumna(T_p,V_p,valor_secundario)
        U_x = buscarEnColumna(U_p,V_p,valor_secundario)
        H_x = buscarEnColumna(H_p,V_p,valor_secundario)
        S_x = buscarEnColumna(S_p,V_p,valor_secundario)
      }
      if(valor_secundario > max_V_p){
        T_x = extrapolacion(valor_secundario,V_p[posicion_max_posterior_V_p-1],max_V_p,T_p[posicion_max_posterior_T_p-1],max_T_p)
        U_x = extrapolacion(valor_secundario,V_p[posicion_max_posterior_V_p-1],max_V_p,U_p[posicion_max_posterior_U_p-1],max_U_p)
        H_x = extrapolacion(valor_secundario,V_p[posicion_max_posterior_V_p-1],max_V_p,H_p[posicion_max_posterior_H_p-1],max_H_p)
        S_x = extrapolacion(valor_secundario,V_p[posicion_max_posterior_V_p-1],max_V_p,S_p[posicion_max_posterior_S_p-1],max_S_p)
      }
      T = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(V_a,T_a,valor_secundario),T_x);
      U = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(V_a,U_a,valor_secundario),U_x);
      H = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(V_a,H_a,valor_secundario),H_x);
      S = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(V_a,S_a,valor_secundario),S_x);
      Densidad = 1/valor_secundario;
      estado = [T,presion,Calidad,valor_secundario,U,H,S,Densidad] //  T P C V U H S D
    }
    if(valor_secundario < min_V_a) {
      estado = ["valor secundario por debajo de la temperatura de saturacion;", min_V_a]    
  }
    if(valor_secundario < min_V_p) {
      estado = ["valor secundario por debajo de la temperatura de saturacion;", min_V_p]    
  }
  return estado
}
    if(caso_seleccionado === "PU"){
      if(valor_secundario > max_U_p && valor_secundario > min_U_p){
      V = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,U_a[posicion_max_anterior_U_a-1],max_U_a,V_a[posicion_max_anterior_V_a-1],max_V_a),
        extrapolacion(valor_secundario,U_p[posicion_max_posterior_U_p-1],max_U_p,V_p[posicion_max_posterior_V_p-1],max_V_p))
      T = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,U_a[posicion_max_anterior_U_a-1],max_U_a,T_a[posicion_max_anterior_T_a-1],max_T_a),
        extrapolacion(valor_secundario,U_p[posicion_max_posterior_U_p-1],max_U_p,T_p[posicion_max_posterior_T_p-1],max_T_p))  
      H = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,U_a[posicion_max_anterior_U_a-1],max_U_a,H_a[posicion_max_anterior_H_a-1],max_H_a),
        extrapolacion(valor_secundario,U_p[posicion_max_posterior_U_p-1],max_U_p,H_p[posicion_max_posterior_H_p-1],max_H_p))  
      S = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,U_a[posicion_max_anterior_U_a-1],max_U_a,S_a[posicion_max_anterior_S_a-1],max_S_a),
        extrapolacion(valor_secundario,U_p[posicion_max_posterior_U_p-1],max_U_p,S_p[posicion_max_posterior_S_p-1],max_S_p))  
      Densidad = 1/V
      estado = [T,presion,Calidad,V,valor_secundario,H,S,Densidad]  //  T P C V U H S D
    }
    if(valor_secundario > min_U_a && valor_secundario < max_U_a){
      V = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(U_a,V_a,valor_secundario),
      buscarEnColumna(U_p,V_p,valor_secundario));
      T = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(U_a,T_a,valor_secundario),
      buscarEnColumna(U_p,T_p,valor_secundario));
      H = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(U_a,H_a,valor_secundario),
      buscarEnColumna(U_p,H_p,valor_secundario));
      S = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(U_a,S_a,valor_secundario),
      buscarEnColumna(U_p,S_p,valor_secundario));
      Densidad = 1/V;
      estado = [T,presion,Calidad,V,valor_secundario,H,S,Densidad]  //  T P C V U H S D
    }
    if(valor_secundario < min_U_p) {
      estado = ["valor secundario por debajo de la temperatura de saturacion;", min_U_p]    
  }
return estado
}
    if(caso_seleccionado === "PH"){
      if(valor_secundario > max_H_p && valor_secundario > min_H_p){
      V = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,H_a[posicion_max_anterior_H_a-1],max_H_a,V_a[posicion_max_anterior_V_a-1],max_V_a),
        extrapolacion(valor_secundario,H_p[posicion_max_posterior_H_p-1],max_H_p,V_p[posicion_max_posterior_V_p-1],max_V_p))
      T = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,H_a[posicion_max_anterior_H_a-1],max_H_a,T_a[posicion_max_anterior_T_a-1],max_T_a),
        extrapolacion(valor_secundario,H_p[posicion_max_posterior_H_p-1],max_H_p,T_p[posicion_max_posterior_T_p-1],max_T_p))  
      U = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,H_a[posicion_max_anterior_H_a-1],max_H_a,U_a[posicion_max_anterior_U_a-1],max_U_a),
        extrapolacion(valor_secundario,H_p[posicion_max_posterior_H_p-1],max_H_p,U_p[posicion_max_posterior_U_p-1],max_U_p))  
      S = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,H_a[posicion_max_anterior_H_a-1],max_H_a,S_a[posicion_max_anterior_S_a-1],max_S_a),
        extrapolacion(valor_secundario,H_p[posicion_max_posterior_H_p-1],max_H_p,S_p[posicion_max_posterior_S_p-1],max_S_p))  
      Densidad = 1/V
      estado = [T,presion,Calidad,V,U,valor_secundario,S,Densidad] //  T P C V U H S D
    }
    if(valor_secundario > min_H_a && valor_secundario < max_H_a){
      V = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(H_a,V_a,valor_secundario),
      buscarEnColumna(H_p,V_p,valor_secundario));
      T = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(H_a,T_a,valor_secundario),
      buscarEnColumna(H_p,T_p,valor_secundario));
      U = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(H_a,U_a,valor_secundario),
      buscarEnColumna(H_p,U_p,valor_secundario));
      S = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(H_a,S_a,valor_secundario),
      buscarEnColumna(H_p,S_p,valor_secundario));
      Densidad = 1/V;
      estado = [T,presion,Calidad,V,U,valor_secundario,S,Densidad] //  T P C V U H S D
    
    }
    if(valor_secundario < min_H_p) {
      estado = ["valor secundario por debajo de la temperatura de saturacion;", min_H_p]    
    }
    return estado
}
    if(caso_seleccionado === "PS"){
      if(valor_secundario > max_S_p && valor_secundario > min_S_p){
      V = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,S_a[posicion_max_anterior_S_a-1],max_S_a,V_a[posicion_max_anterior_V_a-1],max_V_a),
        extrapolacion(valor_secundario,S_p[posicion_max_posterior_S_p-1],max_S_p,V_p[posicion_max_posterior_V_p-1],max_V_p))
      T = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,S_a[posicion_max_anterior_S_a-1],max_S_a,T_a[posicion_max_anterior_T_a-1],max_T_a),
        extrapolacion(valor_secundario,S_p[posicion_max_posterior_S_p-1],max_S_p,T_p[posicion_max_posterior_T_p-1],max_T_p))  
      U = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,S_a[posicion_max_anterior_S_a-1],max_S_a,U_a[posicion_max_anterior_U_a-1],max_U_a),
        extrapolacion(valor_secundario,S_p[posicion_max_posterior_S_p-1],max_S_p,U_p[posicion_max_posterior_U_p-1],max_U_p)) 
      H = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],
        extrapolacion(valor_secundario,S_a[posicion_max_anterior_S_a-1],max_S_a,H_a[posicion_max_anterior_H_a-1],max_H_a),
        extrapolacion(valor_secundario,S_p[posicion_max_posterior_S_p-1],max_S_p,H_p[posicion_max_posterior_H_p-1],max_H_p))
      Densidad = 1/V
      estado = [T,presion,Calidad,V,U,H,valor_secundario,Densidad] //  T P C V U H S D
    }
    if(valor_secundario > min_S_a && valor_secundario < max_S_a){
      V = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(S_a,V_a,valor_secundario),
      buscarEnColumna(S_p,V_p,valor_secundario));
      T = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(S_a,T_a,valor_secundario),
      buscarEnColumna(S_p,S_p,valor_secundario));
      U = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(S_a,U_a,valor_secundario),
      buscarEnColumna(S_p,U_p,valor_secundario));
      H = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(S_a,H_a,valor_secundario),
      buscarEnColumna(S_p,H_p,valor_secundario));
      Densidad = 1/V;
      estado = [T,presion,Calidad,V,U,H,valor_secundario,Densidad] //  T P C V U H S D
    }
    if(valor_secundario < min_S_p) {
      estado = ["valor secundario por debajo de la temperatura de saturacion;", min_S_p]    
    }
    return estado
    }
  return estado;    
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Imprimir la cantidad de columnas y las familias resultantes
//console.log('Cantidad de columnas:', longitudMaxima);
//console.log('Familias de 5 columnas:', familias);
//console.log('Cantidad de familias:', familias.length);
//console.log('Cantidad de indices de presiones:', Indices_de_presiones_tabla_A_6.length);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// AQUI EMPIEZAN LOS CONDICIONALES DE CASOS Y ///////////////////////////////////////////////////////
//////////////////////////////////////////// DESDE AQUI PODEMOS MANEJAR TODO CON valor,  //////////////////////////////////////////////////////
//////////////////////////////////////////// valor_secundario, caso seleccionado        //////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

casos_posibles = ["TH","TU","TV","TS","PH","PU","PV","PS","TX","PX","PT","THEVAP","TUEVAP","TSEVAP","PHEVAP","PUEVAP","SEVAP","TX","PX"]
                       //////////// Casos de Evap pendientes 
let P = buscarEnColumna(Columna_1,Columna_2, valor);
let T = buscarEnColumna(Columna_1,Columna_2,valor);
let HILG = buscarEnColumna(Columna_1,Columna_HILG,valor);
let HIGL = buscarEnColumna(Columna_1,Columna_HIGL,valor);
let UILG = buscarEnColumna(Columna_1,Columna_UILG,valor);
let UIGL = buscarEnColumna(Columna_1,Columna_UIGL,valor);
let VILG = buscarEnColumna(Columna_1,Columna_VILG,valor);
let VIGL = buscarEnColumna(Columna_1,Columna_VIGL,valor);
let SILG = buscarEnColumna(Columna_1,Columna_SILG,valor);
let SIGL = buscarEnColumna(Columna_1,Columna_SIGL,valor);
let HEVAP = buscarEnColumna(Columna_1,Columna_HEVAP,valor);
let UEVAP = buscarEnColumna(Columna_1,Columna_UEVAP,valor);
let SEVAP = buscarEnColumna(Columna_1,Columna_SEVAP,valor);


///////////////////////////////////////Casos intracamapana de basados en T y P /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function estado_intracampana(valor,valor_secundario,caso_seleccionado){
  if(caso_seleccionado === "TH"){
    let T = valor
    let P = buscarEnColumna(Columna_1,Columna_2,valor)
    let Calidad_result = calidad(valor_secundario,HILG,HIGL);
    let H_result = valor_secundario;
    let U_result = M_intermedia(Calidad_result,UILG,UIGL);
    let V_result = M_intermedia(Calidad_result,VILG,VIGL);
    let S_result = M_intermedia(Calidad_result,SILG,SIGL);
    let Densidad = (1/V_result);
    estado = [T,P,Calidad_result,V_result,U_result,H_result,S_result,Densidad] //  T P C V U H S D
  }
  if(caso_seleccionado === "PH"){
    P = valor
    T = buscarEnColumna(Columna_1,Columna_2,valor)
    Calidad_result = calidad(valor_secundario,HILG,HIGL);
    H_result = valor_secundario;
    U_result = M_intermedia(Calidad_result,UILG,UIGL);
    V_result = M_intermedia(Calidad_result,VILG,VIGL);
    S_result = M_intermedia(Calidad_result,SILG,SIGL);
    Densidad = (1/V_result);
    estado = [T,P,Calidad_result,V_result,U_result,H_result,S_result,Densidad] //  T P C V U H S D
  }
  if(caso_seleccionado === "TU"){
    T = valor
    P = buscarEnColumna(Columna_1,Columna_2,valor)
    Calidad_result = calidad(valor_secundario,UILG,UIGL);
    H_result = M_intermedia(Calidad_result,HILG,HIGL);
    U_result = valor_secundario;
    V_result = M_intermedia(Calidad_result,VILG,VIGL);
    S_result = M_intermedia(Calidad_result,SILG,SIGL);
    Densidad = (1/V_result);
    estado = [T,P,Calidad_result,V_result,U_result,H_result,S_result,Densidad] //  T P C V U H S D
    }
    if(caso_seleccionado === "PU"){
      P = valor
      T = buscarEnColumna(Columna_1,Columna_2,valor)
      Calidad_result = calidad(valor_secundario,UILG,UIGL);
      H_result = M_intermedia(Calidad_result,HILG,HIGL);
      U_result = valor_secundario
      V_result = M_intermedia(Calidad_result,VILG,VIGL);
      S_result = M_intermedia(Calidad_result,SILG,SIGL);
      Densidad = (1/V_result);
      estado = [T,P,Calidad_result,V_result,U_result,H_result,S_result,Densidad] //  T P C V U H S D
    }
    if(caso_seleccionado === "TV"){
      P = buscarEnColumna(Columna_1,Columna_2,valor)
      T = valor
      Calidad_result = calidad(valor_secundario,VILG,VIGL);
      H_result = M_intermedia(Calidad_result,HILG,HIGL);
      U_result = M_intermedia(Calidad_result,UILG,UIGL);
      V_result = valor_secundario;
      S_result = M_intermedia(Calidad_result,SILG,SIGL);
      Densidad = (1/V_result);
      estado = [T,P,Calidad_result,V_result,H_result,S_result,Densidad] //  T P C V U H S D
    }
    if(caso_seleccionado === "PV"){
      P = valor
      T = buscarEnColumna(Columna_1,Columna_2,valor)
      Calidad_result = calidad(valor_secundario,VILG,VIGL);
      H_result = M_intermedia(Calidad_result,HILG,HIGL);
      U_result = M_intermedia(Calidad_result,UILG,UIGL);
      V_result = valor_secundario;
      S_result = M_intermedia(Calidad_result,SILG,SIGL);
      Densidad = (1/valor_secundario);
      estado = [T,P,Calidad_result,V_result,U_result,H_result,S_result,Densidad] //  T P C V U H S D
    }
    if(caso_seleccionado === "TS"){
      P = buscarEnColumna(Columna_1,Columna_2,valor)
      T = valor
      Calidad_result = calidad(valor_secundario,VILG,VIGL);
      H_result = M_intermedia(Calidad_result,HILG,HIGL);
      U_result = M_intermedia(Calidad_result,UILG,UIGL);
      V_result = M_intermedia(Calidad_result,VILG,VIGL); 
      S_result = valor_secundario;
      Densidad = (1/V_result);
      estado = [T,P,Calidad_result,V_result,U_result,H_result,S_result,Densidad] //  T P C V U H S D
    }
    if(caso_seleccionado === "PS"){
      P = valor
      T = buscarEnColumna(Columna_1,Columna_2,valor)
      Calidad_result = calidad(valor_secundario,VILG,VIGL);
      H_result = M_intermedia(Calidad_result,HILG,HIGL);
      U_result = M_intermedia(Calidad_result,UILG,UIGL);
      V_result = valor_secundario;
      S_result = M_intermedia(Calidad_result,SILG,SIGL);
      Densidad = (1/V_result);
      estado = [T,P,Calidad_result,V_result,U_result,H_result,S_result,Densidad] //  T P C V U H S D
    }
    if(caso_seleccionado === "TX"){
      T = valor 
      P = buscarEnColumna(Columna_1,Columna_2,valor)
      Calidad_result = valor_secundario
      H_result = M_intermedia(Calidad_result,HILG,HIGL);
      U_result = M_intermedia(Calidad_result,UILG,UIGL);
      V_result = M_intermedia(Calidad_result,VILG,VIGL);
      S_result = M_intermedia(Calidad_result,SILG,SIGL);
      Densidad = (1/V_result);
      estado = [T,P,Calidad_result,V_result,U_result,H_result,S_result,Densidad]
    }
    if(caso_seleccionado === "PX"){
      T = buscarEnColumna(Columna_1,Columna_2,valor)
      P = valor
      Calidad_result = valor_secundario
      H_result = M_intermedia(Calidad_result,HILG,HIGL);
      U_result = M_intermedia(Calidad_result,UILG,UIGL);
      V_result = M_intermedia(Calidad_result,VILG,VIGL);
      S_result = M_intermedia(Calidad_result,SILG,SIGL);
      Densidad = (1/V_result);
      estado = [T,P,Calidad_result,V_result,U_result,H_result,S_result,Densidad]
    }
    return estado
}
//  T P V H U S D
function estado_final(caso_seleccionado,valor,valor_secundario){
    if(caso_seleccionado === "TH" || caso_seleccionado ===  "PH"){
      if(valor_secundario < HILG && caso_seleccionado === "PH"){
        estado =  buscar_tablita(valor,Indices_de_presiones_tabla_A_7,valor_secundario,caso_seleccionado,familias_A7)
      }
      if(valor_secundario > HIGL && caso_seleccionado === "PH"){
        estado = buscar_tablita(valor,Indices_de_presiones_tabla_A_6,valor_secundario,caso_seleccionado,familias_A6)
      }
      if(valor_secundario > HILG &&  valor_secundario < HIGL){
      estado = estado_intracampana(valor,valor_secundario,caso_seleccionado)
      }
      return estado 
    }
    if(caso_seleccionado === "TU" || caso_seleccionado === "PU" ){
    
      if(valor_secundario < UILG && caso_seleccionado === "PU"){
        estado =  buscar_tablita(valor,Indices_de_presiones_tabla_A_7,valor_secundario,caso_seleccionado,familias_A7)
      }
      if(valor_secundario > UIGL && caso_seleccionado === "PU"){
        console.log("nada")
      estado = buscar_tablita(valor,Indices_de_presiones_tabla_A_6,valor_secundario,caso_seleccionado,familias_A6)     
      }
      if(valor_secundario > UILG && valor_secundario < UIGL){
      estado = estado_intracampana(valor,valor_secundario,caso_seleccionado)
      }
      return estado
    }
    if(caso_seleccionado === "TV" || caso_seleccionado === "PV" ){
      if(valor_secundario < VILG && caso_seleccionado === "PV"){
        estado =  buscar_tablita(valor,Indices_de_presiones_tabla_A_7,valor_secundario,caso_seleccionado,familias_A7)
        
      }
      if(valor_secundario > VIGL && caso_seleccionado === "PV"){
        estado = buscar_tablita(valor,Indices_de_presiones_tabla_A_6,valor_secundario,caso_seleccionado,familias_A6)
      }
      if(valor_secundario > VILG && valor_secundario < VIGL){
      estado = estado_intracampana(valor,valor_secundario,caso_seleccionado)
      }
      return estado
    }
    if(caso_seleccionado === "TS" || caso_seleccionado === "PS"){
      if(valor_secundario < SILG && caso_seleccionado === "PS"){
        estado =  buscar_tablita(valor,Indices_de_presiones_tabla_A_7,valor_secundario,caso_seleccionado,familias_A7)
      }
      if(valor_secundario > SILG && caso_seleccionado === "PS"){
      estado = buscar_tablita(valor,Indices_de_presiones_tabla_A_6,valor_secundario,caso_seleccionado,familias_A6)
      }
      if(valor_secundario > SILG && valor_secundario < SIGL){
      estado = estado_intracampana(valor,valor_secundario,caso_seleccionado)
      }
      return estado
    }
    if(caso_seleccionado === "TX" || caso_seleccionado ===  "PX"){
    estado = estado_intracampana(valor,valor_secundario,caso_seleccionado)
    }
    if(caso_seleccionado === "PT"){
      if(valor_secundario > T){
        estado = buscar_tablita(valor,Indices_de_presiones_tabla_A_6,valor_secundario,caso_seleccionado,familias_A6)
      }
      if(valor_secundario < T){
        estado = buscar_tablita(valor,Indices_de_presiones_tabla_A_7,valor_secundario,caso_seleccionado,familias_A7)
      }
      suerte = buscarEnColumna(Columna_1,Columna_2,valor)
      if(valor_secundario === suerte){
        console.log("Le diste justo en la interface, suertudo. Debido a que te corresponden valor de las dos interfaces (ILG e IGL), esta indefinido")
      }
      return estado
    }
    return estado
  }
  


estado_total = estado_final(caso_seleccionado,valor,valor_secundario)

console.log("Tempertura[°C]:",estado_total[0])
console.log("Presión [kPa]:",estado_total[1])
console.log("Calidad:",estado_total[2])
console.log("Volumen [m^3/kg]:",estado_total[3])
console.log("Energía interna [kJ/kg]:",estado_total[4])
console.log("Entalpía[kJ/kg]:",estado_total[5])
console.log("Entropía [KJ/Kg*K]:",estado_total[6])
console.log("Densidad [kg/m^3]",estado_total[7])
//console.log(...estado_total)
console.log(caso_seleccionado)
//  T P C V U H S D

let maximo = Math.max(...Columna_1)
let minimo = Math.min(...Columna_1);
console.log("Valor máximo de miColumna:", maximo);
console.log("Valor mínimo de miColumna:", minimo);



