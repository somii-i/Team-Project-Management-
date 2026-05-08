const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.find().populate('project', 'name status').populate('assignedTo', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate('project', 'name status').populate('assignedTo', 'name email');
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, project, assignedTo, dueDate } = req.body;
  try {
    const task = new Task({ title, description, project, assignedTo, dueDate });
    await task.save();
    const populatedTask = await Task.findById(task._id).populate('project', 'name status').populate('assignedTo', 'name email');
    res.status(201).json(populatedTask);
  } catch (err) {
    console.error('createTask error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'Admin' && task.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = req.user.role === 'Admin' ? req.body : { status: req.body.status };
    Object.assign(task, updates);
    await task.save();
    const populatedTask = await Task.findById(task._id).populate('project', 'name status').populate('assignedTo', 'name email');
    res.json(populatedTask);
  } catch (err) {
    console.error('updateTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
