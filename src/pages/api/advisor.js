import moment from 'moment-timezone';
import getConfig from 'next/config';
import {
  insertStudentAdvisingRequest, getStudent, getCareerAdvisor, getStudentOutstandingAdvisingRequests,
} from '../../utils/airtable';

const postmark = require('postmark');

const { serverRuntimeConfig } = getConfig();

const intro = (type, student, advisor) => {
  const greeting = `Hi ${advisor.Name}, thank you for serving as a student advisor in CodeLabs. We are excited to`
                  + ` introduce you to ${student.Name}, a student in CodeLabs.`;

  const reason = {
    Interview: `do a practice technical interview`,
    Advising: `learn more about how the hiring process companies go through, and how they can stand out as a candidate`,
  }[type];
  let cta = `${student['First Name']} would like to set up a meeting with you to ${reason}. Could you suggest a few`
          + ` times you are available?`;
  if (type === 'Resume') {
    cta = `${student['First Name']} would like your feedback on their resume, available here: ${student.Resume}`;
  }

  const outro = `**Please remember to reply-all.**`;

  return `${greeting}\n\n${cta}\n\n${outro}`;
};

export default async ({ body: { id, advisor: advisorId, type } }, res) => {
  const student = await getStudent(id);
  const advisor = await getCareerAdvisor(advisorId);
  const requests = await getStudentOutstandingAdvisingRequests(id);

  const startOfDay = moment.utc().tz('America/Los_Angeles').startOf('day');
  const hasUsed = requests.reduce(
    (accum, r) => accum || (r.Created && moment.utc(r.Created).isAfter(startOfDay)),
    false
  );
  if (hasUsed) throw new Error('You have already used your request for today.');

  try {
    const client = new postmark.ServerClient(serverRuntimeConfig.postmark.key);
    await client.sendEmail({
      From: `"CodeLabs" <labs@codeday.org>`,
      To: `"${advisor.Name}" <${advisor.Email}>, "${student.Name}" <${student.Email}>`,
      Subject: `[CodeLabs] ${student.Name} <> ${advisor.Name} (${advisor.Employer})`,
      Bcc: `"CodeLabs" <labs@codeday.org>`,
      TextBody: intro(type, student, advisor),
    });
    await insertStudentAdvisingRequest(id, advisorId, type);
  } catch (err) {
    console.error(err);
  }

  res.send('ok');
};
