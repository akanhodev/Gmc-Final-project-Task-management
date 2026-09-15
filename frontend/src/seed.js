import { iso, today } from './utils.js';

const t = today();
const rel = (n) => iso(new Date(t.getFullYear(), t.getMonth(), t.getDate() + n));

export const SEED_USER = { name: 'Amara Okoye', email: 'amara.okoye@university.edu' };

export const SEED_TASKS = [
  { _id: '1', title: 'Submit statistics problem set 4', description: 'Questions 1-9 from the Moore chapter. Upload the PDF to the portal before midnight.', status: 'in-progress', priority: 'high', deadline: rel(0) },
  { _id: '2', title: 'Finish CS-340 database ERD', description: 'Normalise to 3NF and label every relationship cardinality. Bring a printout to the lab session.', status: 'pending', priority: 'high', deadline: rel(1) },
  { _id: '3', title: 'Read Ch. 7 - Operating Systems', description: 'Deadlock detection and avoidance. Take notes on the banker\u2019s algorithm.', status: 'pending', priority: 'medium', deadline: rel(2) },
  { _id: '4', title: 'Group project: split the MERN backend routes', description: 'Decide who owns auth vs. tasks. Agree on the response shape before anyone starts writing controllers.', status: 'in-progress', priority: 'medium', deadline: rel(5) },
  { _id: '5', title: 'Draft thesis proposal outline', description: 'Two pages: problem, prior work, method. Send to the supervisor for a first read.', status: 'pending', priority: 'medium', deadline: rel(14) },
  { _id: '6', title: 'Return the reserve books to the library', description: 'Three-day loan, already one day late.', status: 'pending', priority: 'low', deadline: rel(-2) },
  { _id: '7', title: 'Email Prof. Nkemdirim about the extension', description: 'Ask for two extra days on the seminar paper.', status: 'completed', priority: 'low', deadline: rel(-1) },
  { _id: '8', title: 'Book a study room for Friday', description: 'Room 2B if it is free, 09:00-12:00.', status: 'completed', priority: 'low', deadline: rel(-3) }
];
