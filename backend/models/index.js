import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema(
  {
    github: { type: String, trim: true, maxlength: 300, default: '' },
    linkedin: { type: String, trim: true, maxlength: 300, default: '' },
    x: { type: String, trim: true, maxlength: 300, default: '' },
    email: { type: String, trim: true, maxlength: 200, default: '' },
  },
  { _id: false },
);

const interestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    summary: { type: String, required: true, trim: true, maxlength: 300 },
  },
  { _id: false },
);

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    greeting: { type: String, trim: true, maxlength: 80, default: '' },
    headline: { type: String, trim: true, maxlength: 160, default: '' },
    headlineAccent: { type: String, trim: true, maxlength: 40, default: '' },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    statement: { type: String, trim: true, maxlength: 300, default: '' },
    summary: { type: String, trim: true, maxlength: 500, default: '' },
    biography: { type: String, required: true, trim: true, maxlength: 4000 },
    mission: { type: String, trim: true, maxlength: 400, default: '' },
    university: { type: String, trim: true, maxlength: 140, default: '' },
    education: { type: String, trim: true, maxlength: 200, default: '' },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    currentFocus: { type: String, trim: true, maxlength: 400, default: '' },
    careerGoal: { type: String, trim: true, maxlength: 400, default: '' },
    profileImage: { type: String, trim: true, maxlength: 300, default: '' },
    cvUrl: { type: String, trim: true, maxlength: 300, default: '' },
    socialLinks: { type: socialSchema, default: () => ({}) },
    interests: { type: [interestSchema], default: [] },
  },
  { timestamps: true, versionKey: false },
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true, maxlength: 600 },
    detailedDescription: { type: String, trim: true, maxlength: 8000, default: '' },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    technologies: { type: [{ type: String, trim: true, maxlength: 40 }], default: [] },
    thumbnail: { type: String, trim: true, maxlength: 300, default: '' },
    gallery: { type: [{ type: String, trim: true, maxlength: 300 }], default: [] },
    githubUrl: { type: String, trim: true, maxlength: 300, default: '' },
    liveDemoUrl: { type: String, trim: true, maxlength: 300, default: '' },
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['planned', 'in-progress', 'completed'],
      default: 'planned',
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, required: true, trim: true, maxlength: 80, index: true },
    icon: { type: String, trim: true, maxlength: 40, default: '' },
    displayOrder: { type: Number, default: 0, min: 0, max: 999 },
  },
  { timestamps: true, versionKey: false },
);
skillSchema.index({ category: 1, displayOrder: 1, name: 1 });
skillSchema.index({ name: 1, category: 1 }, { unique: true });

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    organization: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    type: {
      type: String,
      enum: [
        'education',
        'experience',
        'hackathon',
        'collaboration',
        'competition',
        'workshop',
        'certification',
        'milestone',
      ],
      default: 'experience',
      index: true,
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false },
);

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    subject: { type: String, required: true, trim: true, maxlength: 140 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false },
);
messageSchema.index({ createdAt: -1 });

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: true, versionKey: false },
);

export const Profile = mongoose.model('Profile', profileSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Skill = mongoose.model('Skill', skillSchema);
export const Experience = mongoose.model('Experience', experienceSchema);
export const Message = mongoose.model('Message', messageSchema);
export const Admin = mongoose.model('Admin', adminSchema);
