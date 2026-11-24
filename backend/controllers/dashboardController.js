import { Experience, Message, Project, Skill } from '../models/index.js';

export async function getDashboard(_req, res) {
  const [projects, messages, skills, experience, unreadMessages, recentMessages] = await Promise.all([
    Project.countDocuments(),
    Message.countDocuments(),
    Skill.countDocuments(),
    Experience.countDocuments(),
    Message.countDocuments({ isRead: false }),
    Message.find().sort({ createdAt: -1 }).limit(5).select('name email subject isRead createdAt'),
  ]);

  res.json({
    success: true,
    data: {
      counts: { projects, messages, skills, experience, unreadMessages },
      recentMessages,
    },
  });
}
