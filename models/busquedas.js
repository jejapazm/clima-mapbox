const fs = require('fs');
const axios = require('axios');


class Busquedas {

    pathDB = './db/data.json';
    historial = [];

    constructor() {
        this.leerEnDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        });
    }
    
    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,  // establecido como variable de entorno gracias al paquete dotenv
            'limit': 5,
            'language': 'es'
        };
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        };
    }
    
    // hace un query a mapbox para extraer los lugares que coinciden con el argumento lugar
    async buscarLugares( lugar = '' ) {

        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];
        }
    }


    async buscarClima( lat, lon ) {

        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { lat, lon, ...this.paramsOpenWeather }
            });

            const resp = await instance.get();
            // desestructuramos parametros de la respuesta
            const { weather, main } = resp.data;

            return {
                'desc': weather[0].description,
                'min': main.temp_min,
                'max': main.temp_max,
                'temp': main.temp,
            }
            
        } catch (error) {
            console.log(error);
        }
    }


    agregarHistorial( lugar = '' ) {

        if ( !this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            this.historial.unshift( lugar.toLocaleLowerCase() );
        }

        this.historial = this.historial.splice(0,5);
        this.grabarEnDB();
    }

    grabarEnDB () {

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync( this.pathDB, JSON.stringify( payload ) );
    }

    leerEnDB () {

        if ( fs.existsSync( this.pathDB ) ) {
            const info = fs.readFileSync( this.pathDB, { encoding: 'utf-8'} );
            const data = JSON.parse( info );
            this.historial = data.historial;
        }
    }
    
}


module.exports = Busquedas;