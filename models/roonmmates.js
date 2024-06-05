import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname  } from 'path';
const __filename = fileURLToPath(  import.meta.url  );
const __dirname = dirname(__filename);

export const nuevoRoommate = async () => {
    const data = await axios.get("https://randomuser.me/api");
    const { name: { first, last }, email } = data.data.results[0];

    if (!first || !last || !email) {
        throw new Error("Los datos del roommate están incompletos");
    }

     // Genera un monto aleatorio entre 1000 y 10000
     const montoDelGasto = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
    if (!montoDelGasto) {
        throw new Error("Error al generar el monto del gasto");
    }

    const nuevoRoommate = {
        id: uuidv4().slice(30),
        nombre: `${first} ${last}`,
        email,
        debe: montoDelGasto,
        recibe: 0,
        total: montoDelGasto
    };

    try {
        let roommates = [];
        const roommatesJSON = fs.readFileSync(__dirname + "/../data/roommates.json", "utf8");
        roommates = JSON.parse(roommatesJSON).roommates || [];
        roommates.push(nuevoRoommate);
        fs.writeFileSync(__dirname + "/../data/roommates.json", JSON.stringify({ roommates }), "utf8");
        recalcularDeudas(); // Recalcula las deudas después de agregar el nuevo roommate
        return roommates;
    } catch (error) {
        console.error("Error al procesar el nuevo roommate:", error);
        throw new Error("Error al guardar el nuevo roommate");
    }
};


export const getAllRoomate = () => {
    return JSON.parse(fs.readFileSync(__dirname +"/../data/roommates.json", "utf8"))
  }

export const nuevoGastoRoomate = async (gasto) => {
    try {
        let gastos = [];
        const gastosJSON = fs.readFileSync(__dirname + "/../data/gastos.json", "utf8");
        gastos = JSON.parse(gastosJSON).gastos || [];
        gastos.push(gasto);
        fs.writeFileSync(__dirname + "/../data/gastos.json", JSON.stringify({ gastos }), "utf8");

        let roommates = JSON.parse(fs.readFileSync(__dirname + "/../data/roommates.json", "utf8")).roommates;
        roommates = roommates.map(roommate => {
            if (roommate.nombre === gasto.roommate) {
                roommate.debe += gasto.monto;
                roommate.total += gasto.monto;
            }
            return roommate;
        });
        fs.writeFileSync(__dirname + "/../data/roommates.json", JSON.stringify({ roommates }), "utf8");

        recalcularDeudas();
    } catch (error) {
        console.error("Error al procesar el nuevo gasto:", error);
    }
};