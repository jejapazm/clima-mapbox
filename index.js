
require('dotenv').config(); // paquete para establecer variables de entorno

const Busquedas = require("./models/busquedas");
const { 
    leerInput,
    inquirerMenu,
    pausa,
    listarLugares
 } = require("./helpers/inquirer");

const main = async() => {

    const busquedas = new Busquedas();
    
    let opt;

    do {
        
        opt = await inquirerMenu(); 

        switch ( opt ) {
            case 1:
                // Leer termino de busqueda del usuario
                const termino = await leerInput( 'Ciudad: ' );
                // Recibir arreglo con los lugares obtenidos y sus coordenadas
                const lugaresEncontrados = await busquedas.buscarLugares( termino );
                // obtener el id del lugar seleccionado de la lista mostrada
                const id = await listarLugares( lugaresEncontrados );
                // cancelar iteracion del do while si se selecciona cancelar
                if( id === '0' ) continue;
                // encontrar el lugar del arreglo buscando por el id obtenido en el inquirer
                const lugar = lugaresEncontrados.find( l => l.id === id );
                console.log('CARGANDO...');
                // buscar el clima y temperatura del lugar seleccionado
                const clima = await busquedas.buscarClima( lugar.lat, lugar.lng );
                // agregar lugar al historial y hacer persistente esta informacion
                busquedas.agregarHistorial( lugar.nombre );

                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugar.nombre.green  );
                console.log('Lat:', lugar.lat );
                console.log('Lng:', lugar.lng );
                console.log('Temperatura:', clima.temp );
                console.log('Temp Mínima:', clima.min );
                console.log('Temp Máxima:', clima.max );
                console.log('Clima:', clima.desc.green );
                
                break;
            case 2:
                console.log();
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }`);
                });
                break;
            }
            
        if ( opt !== 0 ) await pausa();

    } while ( opt !== 0 );

    console.clear();

} 

main();