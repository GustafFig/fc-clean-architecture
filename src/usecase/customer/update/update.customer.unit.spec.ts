import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUseCase from "./update.customer.usecase";
const customer = CustomerFactory.createWithAddress(
  "John",
  new Address("Street", 123, "Zip", "City")
);

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    update: jest.fn(),
  };
};

describe("Unit test for customer update use case", () => {
  it("should update a customer", async () => {
    const customerRepository = MockRepository();
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository);

    const input = {
      id: customer.id,
      name: "John Updated",
      address: {
        street: "Street Updated",
        number: 1234,
        zip: "Zip Updated",
        city: "City Updated",
      },
    };

    const output = await customerUpdateUseCase.execute(input);

    expect(output.id).toEqual(customer.id);
    expect(output.name).toEqual("John Updated");
    expect(output.address.street).toEqual("Street Updated");
    expect(output.address.number).toEqual(1234);
    expect(output.address.zip).toEqual("Zip Updated");
    expect(output.address.city).toEqual("City Updated");
    expect(customerRepository.update).toHaveBeenCalled();
  });
});
