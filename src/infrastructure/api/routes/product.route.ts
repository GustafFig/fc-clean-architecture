import express, { Request, Response } from "express";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";

export const productRoute = express.Router();

productRoute.get("/", async (req: Request, res: Response) => {
  try {
    const input = {};
    const productRepository = new ProductRepository();
    const listProductUseCase = new ListProductUseCase(productRepository);
    const output = await listProductUseCase.execute(input);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

productRoute.post("/", async (req: Request, res: Response) => {
  try {
    const input = {
      name: req.body.name,
      price: req.body.price,
    };

    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const output = await createProductUseCase.execute(input);
    res.status(200).send(output);
  } catch (err) {
    let message = 'Error: Unknow';
    if (err instanceof Error) message = err.message;
    res.status(500).send(message);
  }
});
