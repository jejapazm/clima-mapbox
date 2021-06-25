
require('colors');
const inquirer = require('inquirer');


// muestra las opciones para que el usuario seleccione una de ellas
const inquirerMenu = async() => {

    console.clear();
    console.log( '========================='.green );
    console.log( '  Seleccione una opción  '.white );
    console.log( '=========================\n'.green );

    const preguntasMenu = [
        {
            type: 'list',
            name: 'opcionMenu',
            message: '¿Que desea hacer?',
            choices: [
                {
                    value: 1,
                    name: `${'1.'.green} Buscar Ciudad`
                },
                {
                    value: 2,
                    name: `${'2.'.green} Historial`
                },
                {
                    value: 0,
                    name: `${'0.'.green} Salir`
                }
            ]
        }
    ];

    // Desestructuramos opcionMenu de la respuesta del inquirer
    const { opcionMenu } = await inquirer.prompt( preguntasMenu );
    return opcionMenu;
};

// pregunta de confirmacion para hacer más visible lo que estamos haiendo
const pausa = async() => {

    // objeto tipo input para generar la pausa
    const pausar = [
        {
            type: 'input',
            name: 'entrada',
            message: `Presione ${'ENTER'.green } para continuar`,
        }
    ];
    console.log('\n');
    // retornamos el inquirer sin desestrucurar entrada porque no es necesaria la respuesta
    return await inquirer.prompt( pausar );
};

// recibe una peticion como argumento y espera por una entrada de caracteres
const leerInput = async( message ) => {

    const pregunta = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Por favor ingrese un lugar';
                }
                return true;
            }
        }
    ];
    // Desestructuramos descripcion de la respuesta del inquirer
    const { desc } = await inquirer.prompt(pregunta);
    return desc;
}

// recibe el arreglo de tareas, muetra el inquirer para seleccionar una tarea y devuelve el id de la seleccionada
const listarLugares = async( lugares = [] ) => {
    // agregamos cada tarea al arreglo choices con el value y name correspondientes
    const choices = lugares.map(( lugar, i ) => {
        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${ idx } ${ lugar.nombre }`
        }
    });
    // agregamos al inicio la opcion de cancelar con value => 0
    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]
    
    const { id } = await inquirer.prompt(preguntas);
    return id;
}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
}