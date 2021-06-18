const { BaseEntity } = require('../../../../src/db/entities/baseEntity');

describe('Base Entity', () => {
  describe('constructor', () => {
    test('should create model', () => {
      const expectedModel = { some: 'model' };

      const collection = 'some_collection';
      const schema = { some: 'schema' };
      const dbMock = { model: jest.fn() };
      dbMock.model.mockReturnValue(expectedModel);

      const entity = new BaseEntity(dbMock, schema, collection);

      expect(dbMock.model).toHaveBeenCalled();
      expect(entity.model).toEqual(expectedModel);
    });
  });

  describe('create', () => {
    test('should return false if item is already created', async () => {
      const modelMock = { findOne: jest.fn() };
      modelMock.findOne.mockResolvedValue({ some: 'item' });

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'schema' };
      const itemToSave = { email: 'some_email' };

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.create(itemToSave);

      expect(modelMock.findOne).toHaveBeenCalledWith({ email: itemToSave.email });
      expect(items).toBeFalsy();
    });

    test('should return a created user', async () => {
      const itemToSave = { email: 'some_email' };
      const mockSave = jest.fn();
      const modelMock = jest.fn();
      modelMock.findOne = jest.fn();
      modelMock.mockImplementation(() => ({ save: mockSave, toObject: () => itemToSave }));
      modelMock.findOne.mockResolvedValue(null);
      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'schema' };

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.create(itemToSave);

      expect(modelMock.findOne).toHaveBeenCalledWith({ email: itemToSave.email });
      expect(modelMock).toHaveBeenCalledWith(itemToSave);
      expect(mockSave).toHaveBeenCalled();
      expect(items).toEqual(itemToSave);
    });

    test('should throw an exception if some error happens meanwhile saving a item', async () => {
      const error = new Error();
      const modelMock = { findOne: jest.fn() };
      modelMock.findOne.mockResolvedValue(Promise.reject(error));

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'schema' };
      const itemToSave = { email: 'some_email' };

      const entity = new BaseEntity(db, schema, collection);

      expect(entity.create(itemToSave)).rejects.toThrowError();
      expect(modelMock.findOne).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    test('should return true if item is deleted', async () => {
      const modelMock = { deleteOne: jest.fn() };
      modelMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'schema' };
      const id = 'id_to_delete';

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.delete(id);

      expect(modelMock.deleteOne).toHaveBeenCalled();
      expect(items).toBeTruthy();
    });

    test('should return false if item is not deleted', async () => {
      const modelMock = { deleteOne: jest.fn() };
      modelMock.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'schema' };
      const id = 'id_to_delete';

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.delete(id);

      expect(modelMock.deleteOne).toHaveBeenCalled();
      expect(items).toBeFalsy();
    });

    test('should throw an exception if some error happens meanwhile deleting items', async () => {
      const error = new Error();
      const modelMock = { deleteOne: jest.fn() };
      modelMock.deleteOne.mockReturnValue(Promise.reject(error));

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'schema' };
      const id = 'id_to_delete';

      const entity = new BaseEntity(db, schema, collection);

      expect(entity.delete(id)).rejects.toThrowError();
      expect(modelMock.deleteOne).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    test('should return item if item exist', async () => {
      const expectedItem = { item: 'expected' };
      const modelMock = { findById: jest.fn() };
      modelMock.findById.mockResolvedValue(expectedItem);

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'schema' };
      const id = 'some_id';

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.get(id);

      expect(modelMock.findById).toHaveBeenCalled();
      expect(items).toEqual(expectedItem);
    });

    test('should return null if item does not exist', async () => {
      const expectedItem = null;
      const modelMock = { findById: jest.fn() };
      modelMock.findById.mockResolvedValue(expectedItem);

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'schema' };
      const id = 'some_id';

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.get(id);

      expect(modelMock.findById).toHaveBeenCalled();
      expect(items).toBeNull();
    });

    test('should throw an exception if some error happens meanwhile getting item', async () => {
      const error = new Error();
      const modelMock = { findById: jest.fn() };
      modelMock.findById.mockReturnValue(Promise.reject(error));

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'schema' };
      const id = 'some_id';

      const entity = new BaseEntity(db, schema, collection);

      expect(entity.get(id)).rejects.toThrowError();
      expect(modelMock.findById).toHaveBeenCalled();
    });
  });

  describe('get All', () => {
    test('should returns all items of a collection', async () => {
      const expectedItems = [1, 2, 3, 4];
      const modelMock = { find: jest.fn() };
      modelMock.find.mockResolvedValue(expectedItems);

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'shcema' };

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.getAll();

      expect(modelMock.find).toHaveBeenCalled();
      expect(items).toEqual(expectedItems);
    });

    test('should throw an exception if some error happens meanwhile getting items', async () => {
      const error = new Error();
      const modelMock = { find: jest.fn() };
      modelMock.find.mockReturnValue(Promise.reject(error));

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'shcema' };

      const entity = new BaseEntity(db, schema, collection);

      expect(entity.getAll()).rejects.toThrowError();
      expect(modelMock.find).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    test('should returns all items that matches query', async () => {
      const expectedItems = [1, 2, 3, 4];
      const modelMock = { find: jest.fn() };
      modelMock.find.mockResolvedValue(expectedItems);

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'shcema' };
      const query = { some: 'query' };

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.find(query);

      expect(modelMock.find.mock.calls[0]).toContain(query);
      expect(modelMock.find).toHaveBeenCalled();
      expect(items).toEqual(expectedItems);
    });

    test('should throw an exception if some error happens meanwhile finding items', async () => {
      const error = new Error();
      const modelMock = { find: jest.fn() };
      modelMock.find.mockReturnValue(Promise.reject(error));

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'shcema' };
      const query = { some: 'query' };

      const entity = new BaseEntity(db, schema, collection);

      expect(entity.find(query)).rejects.toThrowError();
      expect(modelMock.find.mock.calls[0]).toContain(query);
      expect(modelMock.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    test('should returns one item that matches query', async () => {
      const expectedItems = { item: 'expected' };
      const modelMock = { findOne: jest.fn() };
      modelMock.findOne.mockResolvedValue(expectedItems);

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'shcema' };
      const query = { some: 'query' };

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.findOne(query);

      expect(modelMock.findOne.mock.calls[0]).toContain(query);
      expect(modelMock.findOne).toHaveBeenCalled();
      expect(items).toEqual(expectedItems);
    });

    test('should throw an exception if some error happens meanwhile finding items', async () => {
      const error = new Error();
      const modelMock = { findOne: jest.fn() };
      modelMock.findOne.mockReturnValue(Promise.reject(error));

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'shcema' };
      const query = { some: 'query' };

      const entity = new BaseEntity(db, schema, collection);

      expect(entity.findOne(query)).rejects.toThrowError();
      expect(modelMock.findOne.mock.calls[0]).toContain(query);
      expect(modelMock.findOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    test('should return updated item if it exists', async () => {
      const expectedItem = { item: 'expected' };
      const modelMock = { findByIdAndUpdate: jest.fn(), findById: jest.fn() };
      modelMock.findById.mockResolvedValue(expectedItem);

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'shcema' };
      const id = 'some_id';

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.update(id, expectedItem);

      expect(modelMock.findByIdAndUpdate).toHaveBeenCalled();
      expect(modelMock.findById).toHaveBeenCalled();
      expect(items).toEqual(expectedItem);
    });

    test('should return null if item does not exist', async () => {
      const expectedItem = null;
      const modelMock = { findByIdAndUpdate: jest.fn(), findById: jest.fn() };
      modelMock.findById.mockResolvedValue(expectedItem);

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'shcema' };
      const id = 'some_id';

      const entity = new BaseEntity(db, schema, collection);
      const items = await entity.update(id, { some: 'update' });

      expect(modelMock.findByIdAndUpdate).toHaveBeenCalled();
      expect(modelMock.findById).toHaveBeenCalled();
      expect(items).toBeNull();
    });

    test('should throw an exception if some error happens meanwhile getting item', async () => {
      const error = new Error();
      const modelMock = { findByIdAndUpdate: jest.fn(), findById: jest.fn() };
      modelMock.findByIdAndUpdate.mockReturnValue(Promise.reject(error));

      const db = { model: () => modelMock };
      const collection = 'some_collection';
      const schema = { some: 'shcema' };
      const id = 'some_id';

      const entity = new BaseEntity(db, schema, collection);

      expect(entity.update(id, { some: 'update' })).rejects.toThrowError();
      expect(modelMock.findByIdAndUpdate).toHaveBeenCalled();
      expect(modelMock.findById).not.toHaveBeenCalled();
    });
  });
});
