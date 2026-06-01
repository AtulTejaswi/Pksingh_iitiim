import fs from 'fs';
import path from 'path';

const base = (process.env.BASE || 'http://localhost:4000/api').trim();

async function apiJson(pathname, method = 'GET', body, token) {
  const res = await fetch(`${base}${pathname}`, {
    method,
    headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch (e) { return text; }
}

async function uploadFile(token, lessonId, filePath, title) {
  const fd = new FormData();
  fd.append('lessonId', lessonId);
  fd.append('title', title);
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.pdf' ? 'application/pdf' : ext === '.mp4' ? 'video/mp4' : 'application/octet-stream';
  const blob = new Blob([buffer], { type: mime });
  fd.append('file', blob, path.basename(filePath));

  const res = await fetch(`${base}/media/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const text = await res.text().catch(()=>null);
  let parsed = null;
  try { parsed = text ? JSON.parse(text) : null; } catch (e) { parsed = text; }
  return { ok: res.ok, status: res.status, body: parsed };
}

(async function run(){
  console.log('base:', base);
  console.log('Logging in');
  const loginRes = await fetch(`${base}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@pksingh.com', password: 'adminpassword123' }) });
  const login = await loginRes.json();
  console.log('login response raw:', login);
  const token = login.accessToken;
  console.log('token:', !!token);

  console.log('Creating course');
  const course = await apiJson('/courses', 'POST', { title: 'Upload Test Course', description: 'Created by automated test', subject: 'PHYSICS', examTags: ['JEE_MAINS'], isFree: true }, token);
  console.log('course:', course.course?.id);
  const courseId = course.course?.id;

  console.log('Creating lesson');
  const lesson = await apiJson('/lessons', 'POST', { courseId, title: 'Upload Lesson', description: 'Lesson for upload test', isFree: true, isPublished: true }, token);
  console.log('lesson:', lesson.lesson?.id);
  const lessonId = lesson.lesson?.id;

  console.log('Uploading PDF');
  const pdfRes = await uploadFile(token, lessonId, path.join(process.cwd(),'tests','assets','sample.pdf'), 'Test PDF');
  console.log('pdfRes', pdfRes.status, pdfRes.body);

  console.log('Uploading MP4');
  const mp4Res = await uploadFile(token, lessonId, path.join(process.cwd(),'tests','assets','sample.mp4'), 'Test MP4');
  console.log('mp4Res', mp4Res.status, mp4Res.body);

})();
