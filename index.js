import express from 'express';
const app = express();
import { fileURLToPath } from 'url';
import { dirname  } from 'path';
const __filename = fileURLToPath(  import.meta.url  );
const __dirname = dirname(__filename);


import { nuevoRoommate, getAllRoomate, nuevoGastoRoomate } from './models/roonmmates.js';
import { nuevoGasto, getAllGastos, eliminarGasto, editarGasto } from './models/gastos.js';

// Midlleware para recibir Json
app.use( express.json() )

console.clear();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


app.post("/roommate", async (req, res) => {
    try {
      const response = await nuevoRoommate();
      recalcularDeudas();
      res
        .status(201)
        .send({status:'OK',response })
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  })


  app.get("/roommates", async(req, res) => {
     try{
        const response = await getAllRoomate();
        res
        .status(200)
        .send({status:'OK', response })

     }catch(error){
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
     }
  } )

  app.post('/gasto', (req, res) => {
    try {
        nuevoGasto( req.body )
        res.status(201).send({status:'OK', message:"Se inserto nuevo gasto"})
    } catch (error) {
      res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  })

  app.get('/gastos', async( req, res ) => {
    try {
      const response = await getAllGastos();
      res
      .status(200)
      .send({status:'OK', response })
    } catch (error) {
      res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
    }
  })

  app.delete('/gasto', (req, res) => {
    const gastoId = req.query.id; 
    try {
        eliminarGasto(gastoId);
        res.status(200).send({ status: 'OK', message: 'Gasto eliminado exitosamente' });
    } catch (error) {
        res.status(500).send({ status: 'FAILED', data: { error: error.message } });
    }
});

app.put('/gasto', (req, res) => {
    const gastoId = req.query.id;
    const nuevoGasto = req.body;

    try {
        const respuesta = editarGasto(gastoId, nuevoGasto);
        res.status(200).json(respuesta);
    } catch (error) {
        console.error('Error al editar el gasto:', error);
        res.status(500).json({ error: 'Error al editar el gasto' });
    }
});

app.listen(3000, () => console.log('SERVER ON , PORT 3000'))