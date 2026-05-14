const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Create project (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    
    const project = new Project({
      name,
      description,
      owner: req.user._id,
      members: members || []
    });
    
    await project.save();
    await project.populate('owner', 'name email');
    await project.populate('members', 'name email');
    
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find()
        .populate('owner', 'name email')
        .populate('members', 'name email');
    } else {
      projects = await Project.find({
        $or: [
          { owner: req.user._id },
          { members: req.user._id }
        ]
      })
      .populate('owner', 'name email')
      .populate('members', 'name email');
    }
    
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check access
    if (req.user.role !== 'admin' && 
        project.owner._id.toString() !== req.user._id.toString() &&
        !project.members.some(m => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update project (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email')
     .populate('members', 'name email');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete project (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add member to project (admin only)
router.post('/:id/members', auth, adminOnly, async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }
    
    await project.populate('members', 'name email');
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;