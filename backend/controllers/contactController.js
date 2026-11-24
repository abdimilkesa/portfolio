import { Message } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asBoolean } from '../utils/values.js';
import { notifyContact } from '../services/mail.js';

export async function createMessage(req, res) {
  if (String(req.body.company || '').trim()) {
    res.status(201).json({ success: true, data: { received: true } });
    return;
  }

  const entry = await Message.create({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  });
  await notifyContact(entry);
  res.status(201).json({ success: true, data: { received: true } });
}

export async function listMessages(_req, res) {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, data: messages });
}

export async function getMessage(req, res, next) {
  const message = await Message.findById(req.params.id);
  if (!message) return next(ApiError.notFound('That message was not found.'));
  res.json({ success: true, data: message });
}

export async function updateReadState(req, res, next) {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { isRead: asBoolean(req.body.isRead) },
    { returnDocument: 'after', runValidators: true },
  );
  if (!message) return next(ApiError.notFound('That message was not found.'));
  res.json({ success: true, data: message });
}

export async function deleteMessage(req, res, next) {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) return next(ApiError.notFound('That message was not found.'));
  res.json({ success: true, data: { deleted: true } });
}
