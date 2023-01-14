import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

describe("Integration test update product use case", () => {
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

  afterAll(async () => {
    await sequelize.close();
  });

  test("should update a created product", async () => {
    const productRepository = new ProductRepository();
    const createdProduct = new Product("1", "Product 1", 150);

    await productRepository.create(createdProduct);

    const updateProductUseCase = new UpdateProductUseCase(productRepository);
    const input = {
      id: createdProduct.id,
      name: "Other name",
      price: 932,
    };
    const result = await updateProductUseCase.execute(input);
    expect(result).toEqual({
      id: createdProduct.id,
      name: "Other name",
      price: 932,
    });
    const updatedProduct = await productRepository.find(createdProduct.id);
    expect(updatedProduct).toEqual(
      new Product(createdProduct.id, result.name, result.price)
    );
  });

  test("should throw error if name is empty", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("2", "product 2", 6);
    await productRepository.create(product);
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const input = {
      id: product.id,
      name: "",
      price: 456,
    };
    await expect(() =>
      updateProductUseCase.execute(input)
    ).rejects.toThrowError("Name is required");
  });

  test("should throw error if price is lower than 0", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("2", "product 2", 6);
    await productRepository.create(product);
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const input = {
      id: product.id,
      name: "valid name",
      price: -1,
    };
    await expect(() =>
      updateProductUseCase.execute(input)
    ).rejects.toThrowError("Price must be greater than zero");
  });

  test("should throw error if product not found", async () => {
    const productRepository = new ProductRepository();
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "?",
      name: "valid name",
      price: -1,
    };
    await expect(() =>
      updateProductUseCase.execute(input)
    ).rejects.toThrowError("Product not found");
  });
});
