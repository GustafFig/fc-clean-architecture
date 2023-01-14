import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import UpdateProductUseCase from "./update.product.usecase";

const MockProductRepository = (): ProductRepositoryInterface => ({
  find: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
});

describe("Unit test Update Product use case", () => {
  test("should update a product", async () => {
    const productRepository = MockProductRepository();
    const product = new Product("1", "product", 1752);
    productRepository.find = jest.fn().mockResolvedValue(product);
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const input = {
      id: product.id,
      name: product.name,
      price: product.price,
    };
    const result = await updateProductUseCase.execute(input);
    expect(result).toEqual({
      id: "1",
      name: "product",
      price: 1752,
    });
  });
});
