import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CreateProductUseCase from "./create.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Test create product use case", () => {
  let sequelize: Sequelize;
  
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    
    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  test("should create product of defaut type a", async () => {
    const productRepository = new ProductRepository();

    const input = {
      type: "a",
      name: "Product",
      price: 10,
    };

    const output = {
      id: expect.any(String),
      name: "Product",
      price: 10,
    };

    const createProductUseCase = new CreateProductUseCase(productRepository);

    const result = await createProductUseCase.execute(input);
    expect(result).toEqual(output);

    const product = await productRepository.find(result.id);
    expect(product.name).toBe(result.name);
    expect(product.price).toBe(result.price);
  });

  test("should create product of type b", async () => {
    const productRepository = new ProductRepository();

    const input = {
      type: "b",
      name: "Product",
      price: 15,
    };

    const output = {
      id: expect.any(String),
      name: "Product",
      price: 30,
    };

    const createProductUseCase = new CreateProductUseCase(productRepository);

    const result = await createProductUseCase.execute(input);
    expect(result).toEqual(output);

    const product = await productRepository.find(result.id);
    expect(product.name).toBe(result.name);
    expect(product.price).toBe(output.price);
  });
});
