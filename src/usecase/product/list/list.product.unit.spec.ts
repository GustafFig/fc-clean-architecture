import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import ListProductUseCase from "./list.product.usecase";

const testProducts = [
  new Product("abc", "Product 1", 150),
  new Product("efg", "Product 2", 5),
];

const MockProductRespository = (): ProductRepositoryInterface => ({
  find: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn().mockReturnValueOnce(testProducts),
  create: jest.fn(),
});

describe("Unit test list product use case", () => {
  it("should take product", async () => {
    const productRepository = MockProductRespository();

    const listProductUseCase = new ListProductUseCase(productRepository);

    const products = await listProductUseCase.execute({});

    expect(products.products).toEqual([
      { id: "abc", name: "Product 1", price: 150 },
      { id: "efg", name: "Product 2", price: 5 },
    ]);
  });
});
