/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { DatabaseException } = require('../../exceptions');

class BaseEntity {
  constructor(db, collection, schema) {
    this.model = db.model(collection, schema);
  }

  async create(data) {
    const user = await this.model.findOne({ email: data.email });
    if (!user) {
      // eslint-disable-next-line new-cap
      const newEntity = new this.model(data);
      await newEntity.save();
      const { _id, __v, ...result } = newEntity.toObject();
      return result;
    }
    return false;
  }

  async delete(id) {
    const { deletedCount } = await this.model.deleteOne({ _id: id });
    return deletedCount > 0;
  }

  async get(id) {
    return this.model.findById(id, { _id: 0, __v: 0 });
  }

  async getAll() {
    return this.model.find({}, { _id: 0, __v: 0 });
  }

  async find(query) {
    return this.model.find(query, { _id: 0, __v: 0 });
  }

  async findOne(query) {
    return this.model.findOne(query, { _id: 0, __v: 0 });
  }

  async update(id, data) {
    await this.model.findByIdAndUpdate(id, data);
    return this.model.findById(id);
  }
}

module.exports = {
  BaseEntity,
};
