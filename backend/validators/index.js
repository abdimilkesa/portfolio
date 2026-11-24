import { body, param } from 'express-validator';

const optionalUrl = (field) =>
  body(field)
    .optional({ values: 'falsy' })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Enter a full URL starting with http:// or https://.');

const optionalDate = (field) =>
  body(field).optional({ values: 'falsy' }).isISO8601().withMessage('Enter a valid date.');

export const loginRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.').isLength({ max: 200 }),
  body('password')
    .isString()
    .isLength({ min: 12, max: 72 })
    .withMessage('Enter your password.'),
];

export const profileRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Enter your name.'),
  body('title').trim().isLength({ min: 2, max: 160 }).withMessage('Enter a title.'),
  body('statement').optional({ values: 'falsy' }).trim().isLength({ max: 300 }),
  body('summary').optional({ values: 'falsy' }).trim().isLength({ max: 500 }),
  body('biography').trim().isLength({ min: 20, max: 4000 }).withMessage('Write a short biography.'),
  body('mission').optional({ values: 'falsy' }).trim().isLength({ max: 400 }),
  body('university').optional({ values: 'falsy' }).trim().isLength({ max: 140 }),
  body('education').optional({ values: 'falsy' }).trim().isLength({ max: 200 }),
  body('location').optional({ values: 'falsy' }).trim().isLength({ max: 120 }),
  body('currentFocus').optional({ values: 'falsy' }).trim().isLength({ max: 400 }),
  body('careerGoal').optional({ values: 'falsy' }).trim().isLength({ max: 400 }),
  optionalUrl('socialLinks.github'),
  optionalUrl('socialLinks.linkedin'),
  optionalUrl('socialLinks.x'),
  body('socialLinks.email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('Enter a valid email address for the public contact link.'),
  body('interests').optional().isArray({ max: 8 }).withMessage('Keep the interest list to 8 items.'),
  body('interests.*.title').optional().trim().isLength({ min: 2, max: 80 }),
  body('interests.*.summary').optional().trim().isLength({ min: 2, max: 300 }),
];

export const projectRules = [
  body('title').trim().isLength({ min: 2, max: 140 }).withMessage('Enter a project title.'),
  body('slug').optional({ values: 'falsy' }).trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Use a lowercase slug with hyphens.'),
  body('description').trim().isLength({ min: 10, max: 600 }).withMessage('Enter a short description.'),
  body('detailedDescription').optional({ values: 'falsy' }).trim().isLength({ max: 8000 }),
  body('category').trim().isLength({ min: 2, max: 80 }).withMessage('Choose a category.'),
  body('technologies').optional(),
  optionalUrl('githubUrl'),
  optionalUrl('liveDemoUrl'),
  body('featured').optional().isBoolean().withMessage('Featured must be true or false.'),
  body('status')
    .optional()
    .isIn(['planned', 'in-progress', 'completed'])
    .withMessage('Choose planned, in progress, or completed.'),
];

export const skillRules = [
  body('name').trim().isLength({ min: 1, max: 80 }).withMessage('Enter a skill name.'),
  body('category').trim().isLength({ min: 2, max: 80 }).withMessage('Enter a category.'),
  body('icon').optional({ values: 'falsy' }).trim().isLength({ max: 40 }),
  body('displayOrder').optional().isInt({ min: 0, max: 999 }).withMessage('Order must be a number from 0 to 999.'),
];

export const experienceRules = [
  body('title').trim().isLength({ min: 2, max: 140 }).withMessage('Enter a title.'),
  body('organization').trim().isLength({ min: 2, max: 140 }).withMessage('Enter an organization.'),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 2000 }),
  body('type')
    .optional()
    .isIn([
      'education',
      'experience',
      'hackathon',
      'collaboration',
      'competition',
      'workshop',
      'certification',
      'milestone',
    ])
    .withMessage('Choose a valid entry type.'),
  optionalDate('startDate'),
  optionalDate('endDate'),
  body('current').optional().isBoolean(),
];

export const contactRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Enter your name.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').isLength({ max: 200 }),
  body('subject').trim().isLength({ min: 2, max: 140 }).withMessage('Enter a subject.'),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Write a message of at least 10 characters.'),
  body('company').optional({ values: 'falsy' }).trim().isLength({ max: 200 }),
];

export const idParam = [param('id').isMongoId().withMessage('That record could not be found.')];

export const readRules = [body('isRead').isBoolean().withMessage('Choose whether the message is read.')];
