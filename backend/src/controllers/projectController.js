const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('createdBy', 'name email');
    } else {
      const userTasks = await Task.find({ assignedTo: req.user.id }).select('project');
      const projectIds = userTasks.map(t => t.project);
      projects = await Project.find({ _id: { $in: projectIds } }).populate('createdBy', 'name email');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProject = async (req, res) => {
  const { name, description, status } = req.body;
  try {
    const project = new Project({ name, description, status: status || 'Active', createdBy: req.user.id });
    await project.save();
    await project.populate('createdBy', 'name email');
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { name, description, status } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;

    await project.save();
    await project.populate('createdBy', 'name email');
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
