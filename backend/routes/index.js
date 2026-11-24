import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import { login, logout, me, updateAccount } from '../controllers/authController.js';
import { getProfile, updateProfile, uploadCv, uploadPortrait } from '../controllers/profileController.js';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
  uploadThumbnail,
} from '../controllers/projectController.js';
import { createSkill, deleteSkill, listSkills, updateSkill } from '../controllers/skillController.js';
import {
  createExperience,
  deleteExperience,
  listExperience,
  updateExperience,
} from '../controllers/experienceController.js';
import {
  createMessage,
  deleteMessage,
  getMessage,
  listMessages,
  updateReadState,
} from '../controllers/contactController.js';
import { getDashboard } from '../controllers/dashboardController.js';
import { streamMedia } from '../controllers/seoController.js';
import { requireAuth } from '../middleware/auth.js';
import { contactLimiter, loginLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { documentUpload, imageUpload } from '../middleware/upload.js';
import {
  contactRules,
  experienceRules,
  idParam,
  accountRules,
  loginRules,
  profileRules,
  projectRules,
  readRules,
  skillRules,
} from '../validators/index.js';

const router = Router();

router.get('/health', getHealth);
router.get('/media/:id', streamMedia);

router.post('/auth/login', loginLimiter, loginRules, validate, login);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAuth, me);
router.patch('/auth/account', requireAuth, accountRules, validate, updateAccount);

router.get('/profile', getProfile);
router.put('/profile', requireAuth, profileRules, validate, updateProfile);
router.put('/profile/portrait', requireAuth, imageUpload, uploadPortrait);
router.put('/profile/cv', requireAuth, documentUpload, uploadCv);

router.get('/projects', listProjects);
router.get('/projects/:slug', getProject);
router.post('/projects', requireAuth, projectRules, validate, createProject);
router.put('/projects/:id', requireAuth, idParam, projectRules, validate, updateProject);
router.delete('/projects/:id', requireAuth, idParam, validate, deleteProject);
router.put('/projects/:id/thumbnail', requireAuth, idParam, validate, imageUpload, uploadThumbnail);

router.get('/skills', listSkills);
router.post('/skills', requireAuth, skillRules, validate, createSkill);
router.put('/skills/:id', requireAuth, idParam, skillRules, validate, updateSkill);
router.delete('/skills/:id', requireAuth, idParam, validate, deleteSkill);

router.get('/experience', listExperience);
router.post('/experience', requireAuth, experienceRules, validate, createExperience);
router.put('/experience/:id', requireAuth, idParam, experienceRules, validate, updateExperience);
router.delete('/experience/:id', requireAuth, idParam, validate, deleteExperience);

router.post('/contact', contactLimiter, contactRules, validate, createMessage);
router.get('/contact', requireAuth, listMessages);
router.get('/contact/:id', requireAuth, idParam, validate, getMessage);
router.patch('/contact/:id/read', requireAuth, idParam, readRules, validate, updateReadState);
router.delete('/contact/:id', requireAuth, idParam, validate, deleteMessage);

router.get('/admin/dashboard', requireAuth, getDashboard);

export default router;
