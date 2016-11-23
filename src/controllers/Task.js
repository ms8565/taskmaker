const models = require('../models');

const Task = models.Task;

const makerPage = (req, res) => {
  Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }
    let orderedList = docs.sort((a, b) => b.createdData - a.createdData);

    if (orderedList.length > 10) {
      orderedList = orderedList.slice(4);
    }

    return res.render('app', { csrfToken: req.csrfToken(), Tasks: orderedList });
  });
};

function isToday(value) {
  const today = new Date();
  if (today.getFullYear() === value.dueDate.getFullYear()) {
    if (today.getMonth() + 1 === value.dueDate.getMonth() + 1) {
      return today.getDate() === value.dueDate.getDate() + 1;
    }
  }
  return false;
}

function isNotCompleted(value) {
  return !value.completed;
}

const todayPage = (req, res) => {
  Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }
    let todayList = docs.filter(isToday);
    todayList = todayList.filter(isNotCompleted);

    return res.render('today', { csrfToken: req.csrfToken(), Tasks: todayList });
  });
};


const allPage = (req, res) => {
  Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }
    const orderedList = docs.sort((a, b) => b.dueDate - a.dueDate);
    return res.render('all', { csrfToken: req.csrfToken(), Tasks: orderedList });
  });
};

module.exports.makerPage = makerPage;
module.exports.todayPage = todayPage;
module.exports.allPage = allPage;

const makeTask = (req, res) => {
  if (!req.body.name || !req.body.dueDate) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const dueDate = new Date(req.body.dueDate);

  const month = dueDate.getUTCMonth() + 1;
  const day = dueDate.getUTCDate();
  const year = dueDate.getUTCFullYear();

  const date = `${month}/${day}/${year}`;

  const spacelessName = req.body.name.replace(/\s+/g, '');

  const TaskData = {
    name: spacelessName,
    formattedName: req.body.name,
    dueDate,
    owner: req.session.account._id,
    formattedDate: date,
  };

  const newTask = new Task.TaskModel(TaskData);

  return newTask.save((err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred! 2' });
    }
    return res.json({ redirect: '/maker' });
  });
};

const completeTask = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required!' });
  }

  return Task.TaskModel.findByName(req.body.name, req.session.account._id, (err, doc) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred! 3' });
    }

    if (!doc) {
      return res.status(400).json({ error: 'Task not found!' });
    }


    const newTask = doc;
    newTask.completed = true;

    newTask.save((err2) => {
      if (err2) {
        return res.status(400).json({ error: 'An error occurred! 4' });
      }
      return res.json({ redirect: req.body.origin });
    });


    return 0;
  });
};

module.exports.completeTask = completeTask;

module.exports.make = makeTask;
