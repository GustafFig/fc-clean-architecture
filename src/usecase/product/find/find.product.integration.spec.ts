import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Integration test find product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 150);
    await productRepository.create(product);

    const findProductUseCase = new FindProductUseCase(productRepository);

    const input = {
      id: product.id,
    };
    const result = await findProductUseCase.execute(input);
    expect(result).toEqual({
      id: "123",
      name: "Product 1",
      price: 150,
    });
  });

  it("should throw product not found", async () => {
    const productRepository = new ProductRepository();
    const findProductUseCase = new FindProductUseCase(productRepository);

    const input = {
      id: "not found",
    };
    await expect(() => findProductUseCase.execute(input)).rejects.toThrowError(
      "Product not found"
    );
  });
});
