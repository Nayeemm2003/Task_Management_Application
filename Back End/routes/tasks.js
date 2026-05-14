const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    
    // Verify project access
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user has access to project
    if (req.user.role !== 'admin' && 
        projectDoc.owner.toString() !== req.user._id.toString() &&
        !projectDoc.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      assignedBy: req.user._id,
      priority,
      dueDate
    });
    
    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('assignedBy', 'name email');
    await task.populate('project', 'name');
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tasks for user
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'admin') {
      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name email')
        .populate('project', 'name');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name email')
        .populate('project', 'name');
    }
    
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get tasks by project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check access
    if (req.user.role !== 'admin' && 
        project.owner.toString() !== req.user._id.toString() &&
        !project.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('project', 'name');
    
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const project = await Project.findById(task.project);
    
    // Check if user can update
    const canUpdate = req.user.role === 'admin' || 
                     project.owner.toString() === req.user._id.toString() ||
                     task.assignedTo.toString() === req.user._id.toString();
    
    if (!canUpdate) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email')
     .populate('assignedBy', 'name email')
     .populate('project', 'name');
    
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const project = await Project.findById(task.project);
    
    if (req.user.role !== 'admin' && project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ assignedTo: req.user._id });
    }
    
    const now = new Date();
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => t.dueDate < now && t.status !== 'completed').length
    };
    
    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;