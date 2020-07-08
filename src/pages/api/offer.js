import fs from 'fs';
import PdfDocument from 'pdfkit';
import addSvg from 'svg-to-pdfkit';
import handlebars from 'handlebars';
import { getStudent, getMentor, getProject } from '../../utils/airtable';

const svg = String(fs.readFileSync('resources/offer.svg'));
const svgTemplate = handlebars.compile(svg);

export default async function makeOffer({ query: { id } }, res) {
  const student = await getStudent(id);
  const project = await getProject(student.Projects[0]);
  const mentor = await getMentor(project.Mentors[0]);

  if (!student || !project || !mentor || student.Status !== 'Confirmed') {
    throw new Error('You are not in the program.');
  }

  const doc = new PdfDocument();
  res.writeHead(200, {
    'Content-type': 'application/pdf',
    'Content-disposition': 'attachment; filename="offer.pdf"',
  });

  const rendered = svgTemplate({
    Date: student['Early Start'] ? 'June 1, 2020' : 'June 30, 2020',
    Name: student.Name,
    Mentor: mentor.Name,
    MentorTitle: (mentor.Role && mentor.Company) ? mentor.Role : 'Volunteer',
    MentorEmployer: (mentor.Role && mentor.Company) ? mentor.Company : 'CodeDay',
    MentorManager: mentor.Assignee.name,
    Weeks: student['Extended Internship'] ? '10-12' : '4',
    StartDate: student['Early Start'] ? 'June 15' : 'July 6',
  });
  addSvg(doc, rendered, 0, 0, {
    fontCallback: (name) => {
      if (name === 'sans-serif') return 'Helvetica';
      const finalName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      doc.registerFont(finalName, `resources/fonts/${finalName}.ttf`);
      return finalName;
    },
  });

  doc.pipe(res);
  doc.end();
}
