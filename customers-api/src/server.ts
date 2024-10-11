import express from "express"
import { router } from "./routes"
import { PrismaClient } from "@prisma/client"

//const express = require("express") // outra forma de importar

const app = express();

app.use(express.json());

const prisma = new PrismaClient();
/*
 Model
    id String 
    name String
    email String
    document String
    createdAt Date now()
    updatedAt Date now()
*/

// GET POST PUT DELETE

app.get("/customers", async(req, res) => {
    try{
        const customers = await prisma.customers.findMany();
        return res.json(customers);
    //res.send("Requisão GET ");
    }catch(error){
        console.log(error);
        return res.status(500).json({error: error});
    }
    
});
app.get("/customers/:id", async(req, res) => {
    try{
        const id = req.params.id;
    const customer = await prisma.customers.findUnique({
        where: {id}
    });
    if(customer ==null){
       return res.status(404).json(); 
    }
    return res.json(customer);
    
    //res.send("Requisão GET id " + id);
    } catch(error){
        console.log(error);
        return res.status(500).json({error: error}); 
    }
    
});

app.post("/customers", async(req, res) => {
  try{
    const {name, email, document} = req.body;
  console.log("Name",name);
  console.log("email",email);
  console.log("document",document);
  const customers = await prisma.customers.create({
    data: {
        name,
        email,
        document
    }
  });
  return res.json(customers);
  //res.send(`Requisão POST Name ${name} email ${email} document ${document}`);
  } catch(error){
    console.log(error);
    return res.status(500).json({error: error}); 
  }
});
app.delete("/customers/:id", async (req, res) => {
    try{
        const id = req.params.id;
        const customer = await prisma.customers.findUnique({
        where: {id}
        });
  
    if (customer == null) {
        return res.status(404).json();
    }
    await prisma.customers.delete({
        where: {id}
    });
    return res.status(204).json();
    } catch(error){
        console.log(error);
        return res.status(500).json({error: error}); 
    }
});
app.put("/customers/:id", async (req, res) =>{
    try{
    const id = req.params.id; 
    const {name, email, document} = req.body;

    const customer = await prisma.customers.findUnique({
        where: {id}
    });

    if (customer == null) {
        return res.status(404).json({msg: "Not found."});
    }

    const customerUpdated = await prisma.customers.update({
        where: {id},
        data: {
            name,
            email,
            document
        }
    });
    return res.json(customerUpdated);
}catch(error){
    console.log(error);
    return res.status(500).json({error: error});
}

});


app.use(router)

app.listen(3000, () => console.log("Server is running!"))