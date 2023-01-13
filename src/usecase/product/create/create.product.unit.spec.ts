import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {
  InputCreateProductDTO,
  OutputCreateProductDTO,
} from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

const MockRepository = (): ProductRepositoryInterface => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create product use case", () => {
  it("should create a product of default type a", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const input: InputCreateProductDTO = {
      name: "Product",
      price: 100,
    };

    const output: OutputCreateProductDTO = {
      id: expect.any(String),
      name: "Product",
      price: 100,
    };

    const result = await productCreateUseCase.execute(input);
    expect(result).toEqual(output);
  });

  it("should create a product of type b, with doble price for that", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const input: InputCreateProductDTO = {
      name: "Product",
      price: 100,
      type: "b",
    };

    const output: OutputCreateProductDTO = {
      id: expect.any(String),
      name: "Product",
      price: 200,
    };

    const result = await productCreateUseCase.execute(input);
    expect(result).toEqual(output);
  });

  it("should throw error when create with an non-exist type", async () => {
    const productRepository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const input: InputCreateProductDTO = {
      name: "Product",
      price: 100,
      type: "c",
    };

    await expect(productCreateUseCase.execute(input)).rejects.toThrowError(
      "Product type not supported"
    );
  });
});
