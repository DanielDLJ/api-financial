import 'reflect-metadata';
import {
  IsString,
  IsEmail,
  MinLength,
  ValidateNested,
  IsNumber,
  Min,
  validate,
} from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { VALIDATION_PIPE_OPTIONS } from './validation.config';

class AddressDto {
  @IsString()
  street: string;

  @IsNumber()
  @Min(1)
  number: number;
}

class UserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

class ItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}

class OrderDto {
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}

describe('ValidationPipe Options', () => {
  const runValidation = async (dto: any, input: any) => {
    const dtoInstance = plainToInstance(dto, input);
    return validate(dtoInstance, VALIDATION_PIPE_OPTIONS);
  };

  describe('Simple Validation', () => {
    it('should validate correct data', async () => {
      const input = { name: 'John', email: 'john@example.com' };
      const result = await runValidation(UserDto, input);
      expect(result).toEqual([]);
    });

    it('should return errors for invalid email', async () => {
      const input = { name: 'John', email: 'invalid-email' };
      const result = await runValidation(UserDto, input);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].property).toBe('email');
      expect(result[0].constraints).toHaveProperty('isEmail');
    });

    it('should return errors for short name', async () => {
      const input = { name: 'Jo', email: 'john@example.com' };
      const result = await runValidation(UserDto, input);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].property).toBe('name');
      expect(result[0].constraints).toHaveProperty('minLength');
    });
  });

  describe('Nested Object Validation', () => {
    it('should validate correct nested data', async () => {
      const input = {
        name: 'John',
        email: 'john@example.com',
        address: {
          street: 'Main St',
          number: 123,
        },
      };

      const result = await runValidation(UserDto, input);
      expect(result).toEqual([]);
    });

    it('should return errors for invalid nested object', async () => {
      const input = {
        name: 'John',
        email: 'john@example.com',
        address: {
          street: 'Main St',
          number: -1, // Invalid number
        },
      };

      const result = await runValidation(UserDto, input);

      expect(result.length).toBeGreaterThan(0);
      const addressErrors = result[0].children;
      expect(addressErrors[0].property).toBe('number');
      expect(addressErrors[0].constraints).toHaveProperty('min');
    });
  });

  describe('Array Validation', () => {
    it('should validate correct array data', async () => {
      const input = {
        items: [
          { name: 'Item 1', price: 10 },
          { name: 'Item 2', price: 20 },
        ],
      };

      const result = await runValidation(OrderDto, input);
      expect(result).toEqual([]);
    });

    it('should return errors for invalid array items', async () => {
      const input = {
        items: [
          { name: 'Item 1', price: -10 }, // Invalid price
          { name: 'Item 2', price: 'invalid' }, // Invalid price type
        ],
      };

      const result = await runValidation(OrderDto, input);

      expect(result.length).toBeGreaterThan(0);
      const itemErrors = result[0].children;
      expect(itemErrors).toHaveLength(2);
      expect(itemErrors[0].children[0].constraints).toHaveProperty('min');
      expect(itemErrors[1].children[0].constraints).toHaveProperty('isNumber');
    });

    it('should return error for non-array value', async () => {
      const input = {
        items: 'not an array',
      };

      const result = await runValidation(OrderDto, input);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].property).toBe('items');
    });
  });

  describe('Unknown Properties', () => {
    it('should return error for unknown properties', async () => {
      const input = {
        name: 'John',
        email: 'john@example.com',
        unknownProp: 'test',
      };

      const result = await runValidation(UserDto, input);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].constraints).toHaveProperty('whitelistValidation');
    });
  });
});
