const Task = require('../models/Task');

const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 };
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get all tasks belonging to the logged-in user
// @route   GET /api/tasks
// @access  Private
// @query   status   - filter by task status (pending | in-progress | completed)
// @query   search   - case-insensitive match against title or description
// @query   sortBy   - deadline | priority | createdAt (default: createdAt)
// @query   order    - asc | desc (default: asc for deadline/priority, desc for createdAt)
const getTasks = async (req, res, next) => {
  try {
    const { status, search, sortBy, order } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (search) {
      const re = new RegExp(escapeRegExp(search), 'i');
      filter.$or = [{ title: re }, { description: re }];
    }

    const tasks = await Task.find(filter);

    const dir = order === 'desc' ? -1 : order === 'asc' ? 1 : null;
    if (sortBy === 'priority') {
      const d = dir ?? 1;
      tasks.sort((a, b) => d * (PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]));
    } else if (sortBy === 'deadline') {
      const d = dir ?? 1;
      const time = (t) => (t.deadline ? new Date(t.deadline).getTime() : Infinity);
      tasks.sort((a, b) => d * (time(a) - time(b)));
    } else {
      const d = dir ?? -1;
      tasks.sort((a, b) => d * (new Date(a.createdAt) - new Date(b.createdAt)));
    }

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by id
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      deadline,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const allowedFields = ['title', 'description', 'status', 'priority', 'deadline'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
