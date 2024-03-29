const file = require('../models/todoModel');
const { v4: uuidv4 } = require('uuid'); /// use uuid to give uniqe id for tasks
let tasks;
/// read data from file and put it in Tasks
file
  .read()
  .then((data) => {
    tasks = data;
  })
  .catch((error) => {
    console.error(error.message);
    res.status(404).json({ error: 'Data not found' });
    tasks = [];
  });
// retrive all the Tasks from File
exports.getAll = async (req, res) => {
  try {
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// get specific Task by Id
exports.getById = (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find((task) => task.id === taskId);
  if (!task) {
    res.status(404).json({ error: `Task with ID ${taskId} not found` });
    return;
  }
  res.status(200).json(task);
};
// create new Task
exports.create = (req, res) => {
  try {
    const newTask = req.body;

    newTask.id = uuidv4();
    tasks.push(newTask);
    // Write to the file
    file.write(tasks);
    res.status(200).json(newTask);
  } catch (err) {
    //console.log(err);
    res.status(500).json({ error: 'Internal Server Error , cannt create new task' });
  }
};
// delete Taks by Id
exports.delete = (req, res) => {
  const taskId = req.params.id;
  let task = tasks.find((task) => task.id === taskId);

  if (!task) {
    res.status(404).json({ error: `Task with ID ${taskId} not found` });
    return;
  }

  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    file.write(tasks);
    res.status(200).json({ message: `Task deleted successfully` });
  } else {
    res.status(404).json({ error: `Task with cannot deleted` });
  }
};

// Update Task by Id
exports.update = (req, res) => {
  const taskId = req.params.id;
  //let task = tasks.find((task) => task.id === taskId);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (!taskIndex) {
    res.status(404).json({ error: `Task with ID ${taskId} not found` });
    return;
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  // Write to the file
  file.write(tasks);
  res.status(200).json({ message: `Task with ID ${taskId} updated and saved` });
};
