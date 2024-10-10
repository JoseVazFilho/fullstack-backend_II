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
    const customers = await prisma.customers.findMany();
    return res.json(customers);
    //res.send("Requisão GET ");
});
app.get("/customers/:id", async(req, res) => {
    const id = req.params.id;
    const customer = await prisma.customers.findUnique({
        where: {id}
    });
    if(customer ==null){
       return res.status(404).json(); 
    }
    return res.json(customer);
    
    //res.send("Requisão GET id " + id);
});

app.post("/customers", async(req, res) => {
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
});
app.delete("/customers/:id", async (req, res) => {
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
});
app.put("/customers/:id", async (req, res) =>{
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
});


app.use(router)

app.listen(3000, () => console.log("Server is running!"))