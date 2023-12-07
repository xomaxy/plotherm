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
    if (caso === "TH" || caso === "TU" || caso === "TV" || caso === "TS" || caso === "TP") {
        return "A4";
    }
    if (caso === "PH" || caso === "PU" || caso === "PV" || caso === "PS" || caso === "TX" || caso === "PX") {
        return "A5";
    }
    
  } ///////// Hay que considerar tambien que se debe tomar en cuenta la calidad para determinar la tabla 
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //// Extraer datos del excel para su manejo POR COLUMNAS de A4 y A5 /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const xlsx = require('xlsx');
  const fs = require('fs');
  const { match } = require('assert');
  
  let tabla_de_trabajo = "A4" //////////////// CORREGIR DEBE DEPENDER DE LA FUNCION rotacion_de_valores_array 
  
  
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
  //// Extraer datos del excel para su manejo POR FAMILIAS de la A6 /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  let tabla_de_trabajo_A6 = "A6" 
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
  const longitudMaxima = matrizCeldas_A6.reduce((max, fila) => Math.max(max, fila.length), 0);
  
  // Definir el tamaño de las familias
  const tamanoFamilia = 5;
  
  // Dividir la matriz en familias de 5 columnas
  const familias = [];
  for (let i = 0; i < longitudMaxima; i += tamanoFamilia) {
    const familia = [];
    for (let j = 0; j < tamanoFamilia; j++) {
      const columna = matrizCeldas_A6.map(fila => fila[i + j]);
      familia.push(columna);
    }
    familias.push(familia);
  }
  const Indices_de_presiones_tabla_A = [10, 50, 100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000, 3500, 4000, 4500,
  5000,6000, 7000, 8000, 9000, 10000, 12500, 15000, 17500, 20000, 25000, 30000, 35000, 40000, 50000, 60000]; /////Estas son las presiones de cada
    /// tabla (familia), de presiones de la A6
  
  ////////Para las Fuera de campana, necesita la funcion de interpolacion doble DOLIOOOOOOOOOOO Pd. Ojala sirva 
  function buscar_tablita_vapor_sat(presion,Indices_de_presiones,valor_secundario,caso_seleccionado) {
    // Iterar a través de los elementos de la columna
    let estado = -1
    for (let i = 0; i < Indices_de_presiones.length; i++) {
      // Verificar si el valor actual coincide con el valor buscado
      if (Indices_de_presiones[i] === presion) {
         tabla_de_interes = familias[i]   
  
        if(caso_seleccionado === "PT"){
          min = Math.min(...tabla_de_interes[0])
          max = Math.max(...tabla_de_interes[0])
          posicion_max = tabla_de_interes[0].indexOf(max)
  
          if(valor_secundario > max && valor_secundario > min){
            V = extrapolacion(valor_secundario,tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max],
              tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max])
            U = extrapolacion(valor_secundario,tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max],
               tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max])
            H = extrapolacion(valor_secundario,tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max],
               tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max])
            S = extrapolacion(valor_secundario,tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max],
               tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max])
            estado = [valor_secundario,V,U,H,S]
          }
          if(valor_secundario > min && valor_secundario < max){
            V = buscarEnColumna(tabla_de_interes[0],tabla_de_interes[1],valor_secundario);
            U = buscarEnColumna(tabla_de_interes[0],tabla_de_interes[2],valor_secundario);
            H = buscarEnColumna(tabla_de_interes[0],tabla_de_interes[3],valor_secundario);
            S = buscarEnColumna(tabla_de_interes[0],tabla_de_interes[4],valor_secundario);
            estado = [valor_secundario,V,U,H,S]
          }
          if(valor_secundario < min) {
            estado = ["valor por debajo de la temperatura de saturacion:",min]
        }
        return estado
      }
        if(caso_seleccionado === "PV"){
          min = Math.min(...tabla_de_interes[1])
          max = Math.max(...tabla_de_interes[1])
          posicion_max = tabla_de_interes[1].indexOf(max)
          if(valor_secundario > max && valor_secundario > min){
            T = extrapolacion(valor_secundario,tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max],
              tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max])
            U = extrapolacion(valor_secundario,tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max],
               tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max])
            H = extrapolacion(valor_secundario,tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max],
               tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max])
            S = extrapolacion(valor_secundario,tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max],
               tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max])
            estado = [T,valor_secundario,U,H,S]
          }
          if(valor_secundario > min && valor_secundario < max){
            T = buscarEnColumna(tabla_de_interes[1],tabla_de_interes[0],valor_secundario);
            U = buscarEnColumna(tabla_de_interes[1],tabla_de_interes[2],valor_secundario);
            H = buscarEnColumna(tabla_de_interes[1],tabla_de_interes[3],valor_secundario);
            S = buscarEnColumna(tabla_de_interes[1],tabla_de_interes[4],valor_secundario);
            estado = [T,valor_secundario,U,H,S]
          }
          if(valor_secundario < min){
            estado = ["valor por debajo de la temperatura de saturacion:",min]
          }
      }
        if(caso_seleccionado === "PU"){
          min = Math.min(...tabla_de_interes[2])
          max = Math.max(...tabla_de_interes[2])
          posicion_max = tabla_de_interes[2].indexOf(max)
          if(valor_secundario > max && valor_secundario > min){
            T = extrapolacion(valor_secundario,tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max],
              tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max])
            V = extrapolacion(valor_secundario,tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max],
               tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max])
            H = extrapolacion(valor_secundario,tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max],
               tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max])
            S = extrapolacion(valor_secundario,tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max],
               tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max])
            estado = [T,V,valor_secundario,H,S]
          }
          if(valor_secundario > min && valor_secundario < max){
          T = buscarEnColumna(tabla_de_interes[2],tabla_de_interes[0],valor_secundario);
          V = buscarEnColumna(tabla_de_interes[2],tabla_de_interes[1],valor_secundario);
          H = buscarEnColumna(tabla_de_interes[2],tabla_de_interes[3],valor_secundario);
          S = buscarEnColumna(tabla_de_interes[2],tabla_de_interes[4],valor_secundario);
          estado = [T,V,valor_secundario,H,S]
          }
          
          if(valor_secundario < min){
          estado = ["valor por debajo de la temperatura de saturacion:",min]
        }
      }
        if(caso_seleccionado === "PH"){
          min = Math.min(...tabla_de_interes[3])
          max = Math.max(...tabla_de_interes[3])
          posicion_max = tabla_de_interes[3].indexOf(max)
          if(valor_secundario > max && valor_secundario > min){
            T = extrapolacion(valor_secundario,tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max],
              tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max])
            V = extrapolacion(valor_secundario,tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max],
               tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max])
            U = extrapolacion(valor_secundario,tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max],
               tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max])
            S = extrapolacion(valor_secundario,tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max],
               tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max])
            estado = [T,V,U,valor_secundario,S]
          }
          if(valor_secundario > min && valor_secundario < max){
          T = buscarEnColumna(tabla_de_interes[3],tabla_de_interes[0],valor_secundario);
          V = buscarEnColumna(tabla_de_interes[3],tabla_de_interes[1],valor_secundario);
          U = buscarEnColumna(tabla_de_interes[3],tabla_de_interes[2],valor_secundario);
          S = buscarEnColumna(tabla_de_interes[3],tabla_de_interes[4],valor_secundario);
          estado = [T,V,U,valor_secundario,S]
          }
          
          if(valor_secundario < min){
          estado = ["valor por debajo de la temperatura de saturacion:",min]
        }
      }
        if(caso_seleccionado === "PS"){
          min = Math.min(...tabla_de_interes[4])
          max = Math.max(...tabla_de_interes[4])
          posicion_max = tabla_de_interes[4].indexOf(max)
          if(valor_secundario > max && valor_secundario > min){
            T = extrapolacion(valor_secundario,tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max],
              tabla_de_interes[0][posicion_max-1],tabla_de_interes[0][posicion_max])
            V = extrapolacion(valor_secundario,tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max],
               tabla_de_interes[1][posicion_max-1],tabla_de_interes[1][posicion_max])
            U = extrapolacion(valor_secundario,tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max],
               tabla_de_interes[2][posicion_max-1],tabla_de_interes[2][posicion_max])
            H = extrapolacion(valor_secundario,tabla_de_interes[4][posicion_max-1],tabla_de_interes[4][posicion_max],
               tabla_de_interes[3][posicion_max-1],tabla_de_interes[3][posicion_max])
            estado = [T,V,U,U,valor_secundario]
          }
          if(valor_secundario > min && valor_secundario < max){
          T = buscarEnColumna(tabla_de_interes[4],tabla_de_interes[0],valor_secundario);
          V = buscarEnColumna(tabla_de_interes[4],tabla_de_interes[1],valor_secundario);
          U = buscarEnColumna(tabla_de_interes[4],tabla_de_interes[2],valor_secundario);
          H = buscarEnColumna(tabla_de_interes[4],tabla_de_interes[3],valor_secundario);
          estado = [T,V,U,U,valor_secundario]
          }
          
          if(valor_secundario < min){
          estado = ["valor por debajo de la temperatura de saturacion:",min]
        }
        }
      return estado;
      }
      
      if (Indices_de_presiones[i] < presion && Indices_de_presiones[i + 1] > presion){
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
      if(caso_seleccionado === "PT"){
        min = Math.min(...T_p)
        max = Math.max(...T_p)
        posicion_max_anterior = T_a.indexOf(max)
        posicion_max_posterior = T_p.indexOf(max)
        posicion_max_anterior = V_a.indexOf(max)
        posicion_max_posterior = V_p.indexOf(max)
        posicion_max_anterior = U_a.indexOf(max)
        posicion_max_posterior = U_p.indexOf(max)
        posicion_max_anterior = H_a.indexOf(max)
        posicion_max_posterior = H_p.indexOf(max)
        posicion_max_anterior = S_a.indexOf(max)
        posicion_max_posterior = S_p.indexOf(max)
        
  
        if(valor_secundario > max && valor_secundario > min){
          V = extrapolacion(valor_secundario,T_a[posicion_max_anterior-1],T_a[max],V_a[posicion_max_anterior],V_a[max])
          estado = Indices_de_presiones[i]
        }
        if(valor_secundario > min && valor_secundario < max){
          V = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(T_a,V_a,valor_secundario),
          buscarEnColumna(T_p,V_p,valor_secundario));
          U = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(T_a,U_a,valor_secundario),
          buscarEnColumna(T_p,U_p,valor_secundario));
          H = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(T_a,H_a,valor_secundario),
          buscarEnColumna(T_p,H_p,valor_secundario));
          S = interpolacion(Indices_de_presiones[i+1],presion,Indices_de_presiones[i],buscarEnColumna(T_a,S_a,valor_secundario),
          buscarEnColumna(T_p,S_p,valor_secundario));
          estado = [valor_secundario,V,U,H,S]
        }
        if(valor_secundario < min) {
          estado = ["valor secundario por debajo de la temperatura de saturacion;", min]    
      }
      return estado
    }
  
    return estado;    
      }
    }
  }
      
    h = buscar_tablita_vapor_sat(10,Indices_de_presiones_tabla_A,5000,"PS")
    console.log(h)
  
  
    let valor = 30.472536;  ///////// Este es valor principal T o P segun sea el caso
    let valor_secundario = 8;
    let caso_seleccionado = "TS"
  
  
  
  // Imprimir la cantidad de columnas y las familias resultantes
  
  
  
  
  //console.log('Cantidad de columnas:', longitudMaxima);
  //console.log('Familias de 5 columnas:', familias);
  //console.log('Cantidad de familias:', familias.length);
  //console.log('Cantidad de indices de presiones:', Indices_de_presiones_tabla_A.length);
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////// AQUI EMPIEZAN LOS CONDICIONALES DE CASOS Y ///////////////////////////////////////////////////////
  //////////////////////////////////////////// DESDE AQUI PODEMOS MANEJAR TODO CON valor,  //////////////////////////////////////////////////////
  //////////////////////////////////////////// valor_secundario, caso seleccionado        //////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  casos_posibles = ["TH","TU","TV","TS","PH","PU","PV","PS","TX","PX","TP","THEVAP","TUEVAP","TSEVAP","PHEVAP","PUEVAP","SEVAP"]
                         //////////// Casos de Evap pendientes 
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
  
  if(caso_seleccionado === "TH" || caso_seleccionado ===  "PH" ){
    if(valor_secundario < HILG){
      
      Tabla_de_trabajo_para_calculos = "A7"
    }
    if(valor_secundario > HILG){
      Tabla_de_trabajo_para_calculos = "A6"
    }
    if(valor_secundario > HILG &&  valor_secundario < HIGL){
      Calidad_result = calidad(valor_secundario,HILG,HIGL);
      H_result = valor_secundario;
      U_result = M_intermedia(Calidad_result,UILG,UIGL);
      V_result = M_intermedia(Calidad_result,VILG,VIGL);
      S_result = M_intermedia(Calidad_result,SILG,SIGL);
      Densidad = (1/V_result);
    }
  }
  
  if(caso_seleccionado === "TU" || caso_seleccionado === "PU" ){
    if(valor_secundario < UILG){
      Tabla_de_trabajo_para_calculos = "A7"
    }
    if(valor_secundario > UILG){
      Tabla_de_trabajo_para_calculos = "A6"
    }
    if(valor_secundario > UILG && valor_secundario < UIGL){
      Calidad_result = calidad(valor_secundario,UILG,UIGL);
      H_result = M_intermedia(Calidad_result,HILG,HIGL);
      U_result = valor_secundario;
      V_result = M_intermedia(Calidad_result,VILG,VIGL);
      S_result = M_intermedia(Calidad_result,SILG,SIGL);
      Densidad = (1/V_result);
      }
  }
  if(caso_seleccionado === "TV" || caso_seleccionado === "PV" ){
    if(valor_secundario < VILG){
      Tabla_de_trabajo_para_calculos = "A7"
    }
    if(valor_secundario > VIGL){
      Tabla_de_trabajo_para_calculos = "A6"
    }
    if(valor_secundario > VILG && valor_secundario < VIGL){
      Calidad_result = calidad(valor_secundario,VILG,VIGL);
      H_result = M_intermedia(Calidad_result,HILG,HIGL);
      U_result = M_intermedia(Calidad_result,UILG,UIGL);
      V_result = valor_secundario;
      S_result = M_intermedia(Calidad_result,SILG,SIGL);
      Densidad = (1/V_result);
      }
  }
  if(caso_seleccionado === "TS" || caso_seleccionado === "PS"){
    if(valor_secundario < SILG){
      Tabla_de_trabajo_para_calculos = "A7"
    }
    if(valor_secundario > SILG){
      Tabla_de_trabajo_para_calculos = "A6"
    }
    if(valor_secundario > SILG && valor_secundario < SIGL){
      Calidad_result = calidad(valor_secundario,SILG,SIGL);
      H_result = M_intermedia(Calidad_result,HILG,HIGL);
      U_result = M_intermedia(Calidad_result,UILG,UIGL);
      V_result =  M_intermedia(Calidad_result,VILG,VIGL);
      S_result = valor_secundario;
      Densidad = (1/V_result);
      }
  }
  
  //console.log("Valor principal:",valor)
  //console.log("Calidad:", Calidad_result);
  //console.log("Entalpia []:", H_result);
  //console.log("Energía Interna []:", U_result);
  //console.log("Volumen []:", V_result);
  //console.log("Densidad []:", Densidad)
  //console.log("Entropia []:", S_result);
  //console.log("Entalpia de Evaporación []:", HEVAP);
  //console.log("Energía Interna de Evaporación []:", UEVAP);
  //console.log("Entropía de Evaporación []:", SEVAP);
  
  let maximo = encontrarMaximo(Columna_1);
  let minimo = encontrarMinimo(Columna_1);
  console.log("Valor máximo de miColumna:", maximo);
  console.log("Valor mínimo de miColumna:", minimo);
  
  
  
  console.log(rotacion_de_valores_array(caso_seleccionado))
  console.log(caso_seleccionado)
  