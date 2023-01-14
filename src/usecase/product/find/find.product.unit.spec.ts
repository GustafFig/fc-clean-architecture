import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import FindProductUseCase from "./find.product.usecase";

const MockProductRepository = (): ProductRepositoryInterface => ({
  find: jest.fn().mockResolvedValueOnce(new Product("abc", "Product", 100)),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

describe("Unit test find product usecase", () => {
  test("should find a product", async () => {
    const productRepository = MockProductRepository();
    const findProductUseCase = new FindProductUseCase(productRepository);

    const input = {
      id: "abc",
    };
    const result = await findProductUseCase.execute(input);
    expect(result).toEqual({
      id: "abc",
      name: "Product",
      price: 100,
    });
    expect(productRepository.find).toHaveBeenCalledWith(input.id);
  });

  test("should not find a product", async () => {
    const productRepository = MockProductRepository();
    const findProductUseCase = new FindProductUseCase(productRepository);
    productRepository.find = jest
      .fn()
      .mockRejectedValueOnce(Error("Product not found"));
    const input = {
      id: "efg",
    };

    await expect(() => findProductUseCase.execute(input)).rejects.toThrowError(
      "Product not found"
    );
  });
});
