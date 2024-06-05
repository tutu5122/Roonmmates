import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname  } from 'path';
const __filename = fileURLToPath(  import.meta.url  );
const __dirname = dirname(__filename);

export const nuevoGasto = ( obj ) => {
    try {
        console.log('obj-->', obj)
        obj.id = uuidv4().slice(0,6)
        console.log('Salida de obj-->', obj)
        const gastosJSON = fs.readFileSync(__dirname +"/../data/gastos.json", "utf8" )
        console.log("gastosJSON-->", JSON.parse( gastosJSON ))
        const { gastos } = JSON.parse( gastosJSON )
        gastos.push( obj )
        fs.writeFileSync(__dirname +"/../data/gastos.json", JSON.stringify({ gastos }),"utf8")
    } catch (error) {
        console.error('Salida del error', error)
    }
}

export const eliminarGasto = (gastoId) => {
    try {
        const gastosJSON = fs.readFileSync(__dirname + "/../data/gastos.json", "utf8");
        let { gastos } = JSON.parse(gastosJSON);
        gastos = gastos.filter(gasto => gasto.id !== gastoId);
        fs.writeFileSync(__dirname + "/../data/gastos.json", JSON.stringify({ gastos }), "utf8");
    } catch (error) {
        console.error('Error al eliminar el gasto:', error);
    }
};

export const getAllGastos = async () => {
    return JSON.parse(fs.readFileSync(__dirname +"/../data/gastos.json", "utf8"))
}

export const editarGasto = (id, nuevoGasto) => {
    const gastosJSON = fs.readFileSync(__dirname + "/../data/gastos.json", "utf8");
    let { gastos } = JSON.parse(gastosJSON);
    
    const index = gastos.findIndex(g => g.id === id);
    
    if (index === -1) {
        throw new Error('El gasto no existe');
    }
    
    gastos[index] = { ...gastos[index], ...nuevoGasto };
    
    fs.writeFileSync(__dirname + "/../data/gastos.json", JSON.stringify({ gastos }), "utf8");
    
    return { message: 'Gasto editado exitosamente' };
};