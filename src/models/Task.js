const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let TaskModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = name => _.escape(name).trim();

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  formattedName: {
    type: String,
  },

  dueDate: {
    type: Date,
    required: true,
  },

  formattedDate: {
    type: String,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

  completed: {
    type: Boolean,
    default: false,
  },
});

TaskSchema.statics.toAPI = doc => ({
  name: doc.name,
  dueDate: doc.dueDate,
  test: doc.test,
});

TaskSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return TaskModel.find(search).select('name dueDate completed formattedDate createdData formattedName').exec(callback);
};

TaskSchema.statics.findByName = (name, ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
  };

  return TaskModel.findOne(search, callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;
