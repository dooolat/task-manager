import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'docs', 'report');
const tempDir = path.join(outputDir, '.docx-temp');
const screenshotsDir = path.join(rootDir, 'docs', 'screenshots');

const reportPath = path.join(outputDir, 'Task_Manager_Practice_Report.docx');
const calendarPath = path.join(outputDir, 'Task_Manager_Calendar_Plan.docx');
const evaluationPath = path.join(outputDir, 'Task_Manager_Evaluation_Letter.docx');

const student = {
  fullName: '[Student full name]',
  group: '[Group]',
  educationalProgram: '[Educational program]',
  supervisor: '[Practice supervisor]',
  practiceBase: 'Task Manager Full-Stack Web Application Project',
  cityYear: 'Astana, 2026'
};

const liveLinks = {
  frontend: 'https://task-manager-frontend-coral-rho.vercel.app',
  backend: 'https://task-manager-backend-i9ac.onrender.com',
  github: 'https://github.com/dooolat/task-manager'
};

const screenshots = [
  { file: 'login.jpg', title: 'Login page' },
  { file: 'register.jpg', title: 'Registration page' },
  { file: 'dashboard.jpg', title: 'Dashboard page' },
  { file: 'tasks.jpg', title: 'Task management page' },
  { file: 'categories.jpg', title: 'Category management page' },
  { file: 'profile.jpg', title: 'Profile page' }
];

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const ensureCleanDir = (dir) => {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
};

const writeFile = (filePath, content) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
};

const paragraph = (text = '', options = {}) => {
  const {
    align = 'both',
    bold = false,
    fontSize = 28,
    indent = true,
    spacingAfter = 120,
    pageBreakBefore = false
  } = options;

  const runs = Array.isArray(text) ? text : [{ text }];
  const runXml = runs
    .map((run) => {
      const isBold = run.bold ?? bold;
      const size = run.fontSize ?? fontSize;
      return `
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
            ${isBold ? '<w:b/><w:bCs/>' : ''}
            <w:color w:val="000000"/>
            <w:sz w:val="${size}"/>
            <w:szCs w:val="${size}"/>
          </w:rPr>
          <w:t xml:space="preserve">${escapeXml(run.text)}</w:t>
        </w:r>`;
    })
    .join('');

  return `
    <w:p>
      <w:pPr>
        ${pageBreakBefore ? '<w:pageBreakBefore/>' : ''}
        <w:jc w:val="${align}"/>
        <w:spacing w:line="360" w:lineRule="auto" w:after="${spacingAfter}"/>
        ${indent ? '<w:ind w:firstLine="709"/>' : ''}
      </w:pPr>
      ${runXml}
    </w:p>`;
};

const heading = (text, level = 1, pageBreakBefore = true) =>
  paragraph(text, {
    align: 'center',
    bold: true,
    indent: false,
    spacingAfter: 240,
    pageBreakBefore,
    fontSize: level === 1 ? 28 : 28
  });

const centered = (text, options = {}) =>
  paragraph(text, {
    align: 'center',
    indent: false,
    spacingAfter: options.spacingAfter ?? 120,
    bold: options.bold ?? false,
    fontSize: options.fontSize ?? 28
  });

const pageBreak = () => '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';

const imageParagraph = (relationshipId, title, figureNumber) => `
  <w:p>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:line="360" w:lineRule="auto" w:after="120"/>
    </w:pPr>
    <w:r>
      <w:drawing>
        <wp:inline distT="0" distB="0" distL="0" distR="0"
          xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
          xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
          xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
          <wp:extent cx="5486400" cy="3086100"/>
          <wp:docPr id="${figureNumber}" name="Figure ${figureNumber}"/>
          <a:graphic>
            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
              <pic:pic>
                <pic:nvPicPr>
                  <pic:cNvPr id="${figureNumber}" name="${escapeXml(title)}"/>
                  <pic:cNvPicPr/>
                </pic:nvPicPr>
                <pic:blipFill>
                  <a:blip r:embed="${relationshipId}"/>
                  <a:stretch><a:fillRect/></a:stretch>
                </pic:blipFill>
                <pic:spPr>
                  <a:xfrm>
                    <a:off x="0" y="0"/>
                    <a:ext cx="5486400" cy="3086100"/>
                  </a:xfrm>
                  <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
                </pic:spPr>
              </pic:pic>
            </a:graphicData>
          </a:graphic>
        </wp:inline>
      </w:drawing>
    </w:r>
  </w:p>
  ${centered(`Figure ${figureNumber} – ${title}`, { spacingAfter: 240 })}`;

const table = (rows) => {
  const cell = (content, width = 3200) => `
    <w:tc>
      <w:tcPr>
        <w:tcW w:w="${width}" w:type="dxa"/>
        <w:tcBorders>
          <w:top w:val="single" w:sz="8" w:space="0" w:color="000000"/>
          <w:left w:val="single" w:sz="8" w:space="0" w:color="000000"/>
          <w:bottom w:val="single" w:sz="8" w:space="0" w:color="000000"/>
          <w:right w:val="single" w:sz="8" w:space="0" w:color="000000"/>
        </w:tcBorders>
      </w:tcPr>
      ${paragraph(content, { indent: false, spacingAfter: 0 })}
    </w:tc>`;

  return `
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="0" w:type="auto"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="8" w:space="0" w:color="000000"/>
          <w:left w:val="single" w:sz="8" w:space="0" w:color="000000"/>
          <w:bottom w:val="single" w:sz="8" w:space="0" w:color="000000"/>
          <w:right w:val="single" w:sz="8" w:space="0" w:color="000000"/>
          <w:insideH w:val="single" w:sz="8" w:space="0" w:color="000000"/>
          <w:insideV w:val="single" w:sz="8" w:space="0" w:color="000000"/>
        </w:tblBorders>
      </w:tblPr>
      ${rows
        .map(
          (row) => `
        <w:tr>
          ${row.map((value, index) => cell(value, index === 0 ? 2200 : index === 1 ? 4700 : 3000)).join('')}
        </w:tr>`
        )
        .join('')}
    </w:tbl>`;
};

const documentXml = (bodyXml, relationshipFooterId = 'rFooter1') => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:footerReference w:type="default" r:id="${relationshipFooterId}"/>
      <w:titlePg/>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="850" w:bottom="1134" w:left="1701" w:header="708" w:footer="708" w:gutter="0"/>
      <w:cols w:space="708"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:pPr>
      <w:jc w:val="both"/>
      <w:spacing w:line="360" w:lineRule="auto"/>
      <w:ind w:firstLine="709"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
      <w:color w:val="000000"/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
    </w:rPr>
  </w:style>
</w:styles>`;

const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="708"/>
</w:settings>`;

const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
        <w:sz w:val="28"/>
      </w:rPr>
      <w:fldChar w:fldCharType="begin"/>
    </w:r>
    <w:r><w:instrText xml:space="preserve">PAGE</w:instrText></w:r>
    <w:r><w:fldChar w:fldCharType="separate"/></w:r>
    <w:r><w:t>2</w:t></w:r>
    <w:r><w:fldChar w:fldCharType="end"/></w:r>
  </w:p>
</w:ftr>`;

const baseRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const contentTypesXml = (imageFiles = []) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
</Types>`;

const documentRelsXml = (imageRelationships = []) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rSettings" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rFooter1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
  ${imageRelationships
    .map(
      (relationship) =>
        `<Relationship Id="${relationship.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${relationship.file}"/>`
    )
    .join('\n')}
</Relationships>`;

const zipDocx = (sourceDir, targetFile) => {
  fs.rmSync(targetFile, { force: true });
  const command = `
    Add-Type -AssemblyName System.IO.Compression;
    Add-Type -AssemblyName System.IO.Compression.FileSystem;
    if (Test-Path -LiteralPath '${targetFile.replace(/'/g, "''")}') { Remove-Item -LiteralPath '${targetFile.replace(/'/g, "''")}' -Force }
    $sourceDir = '${sourceDir.replace(/'/g, "''")}';
    $targetFile = '${targetFile.replace(/'/g, "''")}';
    $fileStream = [System.IO.File]::Open($targetFile, [System.IO.FileMode]::CreateNew);
    $archive = New-Object System.IO.Compression.ZipArchive($fileStream, [System.IO.Compression.ZipArchiveMode]::Create);
    try {
      Get-ChildItem -LiteralPath $sourceDir -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring($sourceDir.Length).TrimStart('\\', '/').Replace('\\', '/');
        $entry = $archive.CreateEntry($relativePath, [System.IO.Compression.CompressionLevel]::Optimal);
        $entryStream = $entry.Open();
        $inputStream = [System.IO.File]::OpenRead($_.FullName);
        try {
          $inputStream.CopyTo($entryStream);
        } finally {
          $inputStream.Dispose();
          $entryStream.Dispose();
        }
      }
    } finally {
      $archive.Dispose();
      $fileStream.Dispose();
    }
  `;
  execFileSync('powershell.exe', ['-NoProfile', '-Command', command], { stdio: 'inherit' });
};

const buildDocx = ({ targetFile, bodyXml, imageFiles = [] }) => {
  ensureCleanDir(tempDir);
  writeFile(path.join(tempDir, '[Content_Types].xml'), contentTypesXml(imageFiles));
  writeFile(path.join(tempDir, '_rels', '.rels'), baseRelsXml);
  writeFile(path.join(tempDir, 'word', 'document.xml'), documentXml(bodyXml));
  writeFile(path.join(tempDir, 'word', 'styles.xml'), stylesXml);
  writeFile(path.join(tempDir, 'word', 'settings.xml'), settingsXml);
  writeFile(path.join(tempDir, 'word', 'footer1.xml'), footerXml);
  writeFile(path.join(tempDir, 'word', '_rels', 'document.xml.rels'), documentRelsXml(imageFiles));

  if (imageFiles.length > 0) {
    fs.mkdirSync(path.join(tempDir, 'word', 'media'), { recursive: true });
    imageFiles.forEach((image) => {
      fs.copyFileSync(image.source, path.join(tempDir, 'word', 'media', image.file));
    });
  }

  zipDocx(tempDir, targetFile);
  fs.rmSync(tempDir, { recursive: true, force: true });
};

const reportBody = () => {
  const imageRelationships = screenshots.map((screenshot, index) => ({
    id: `rImage${index + 1}`,
    file: screenshot.file,
    source: path.join(screenshotsDir, screenshot.file),
    title: screenshot.title
  }));

  const titlePage = [
    centered('Ministry of Science and Higher Education of the Republic of Kazakhstan', { spacingAfter: 120 }),
    centered('Astana IT University', { spacingAfter: 520 }),
    centered('REPORT', { bold: true, fontSize: 32, spacingAfter: 120 }),
    centered('On completion of the industrial practice program', { bold: true, spacingAfter: 520 }),
    paragraph(`Practice base: ${student.practiceBase}`, { indent: false, spacingAfter: 160 }),
    paragraph(`Project topic: Task Manager Full-Stack Web Application`, { indent: false, spacingAfter: 160 }),
    paragraph(`Student: ${student.fullName}`, { indent: false, spacingAfter: 160 }),
    paragraph(`Educational program: ${student.educationalProgram}`, { indent: false, spacingAfter: 160 }),
    paragraph(`Group: ${student.group}`, { indent: false, spacingAfter: 160 }),
    paragraph(`Practice supervisor: ${student.supervisor}`, { indent: false, spacingAfter: 160 }),
    centered(student.cityYear, { spacingAfter: 0 }),
    pageBreak()
  ].join('');

  const contents = [
    heading('CONTENTS', 1, false),
    paragraph('INTRODUCTION ........................................................................................................ 3', { indent: false }),
    paragraph('1 PROJECT OVERVIEW AND REQUIREMENTS ........................................................ 4', { indent: false }),
    paragraph('2 BACKEND IMPLEMENTATION ............................................................................... 5', { indent: false }),
    paragraph('3 FRONTEND IMPLEMENTATION ............................................................................ 7', { indent: false }),
    paragraph('4 TESTING AND DEPLOYMENT ............................................................................... 9', { indent: false }),
    paragraph('CONCLUSION ........................................................................................................ 11', { indent: false }),
    paragraph('REFERENCES ......................................................................................................... 12', { indent: false }),
    paragraph('APPENDIX A SCREENSHOTS ................................................................................. 13', { indent: false })
  ].join('');

  const intro = [
    heading('INTRODUCTION'),
    paragraph('The industrial practice project was focused on designing, developing, testing, and deploying a full-stack web application named Task Manager. The application allows users to register, authenticate, create categories, manage tasks, search and filter records, and monitor task progress through a dashboard.'),
    paragraph('The relevance of the project is connected with the need for structured planning tools that help students and employees organize deadlines, priorities, and daily work. A task management system is also a suitable practice project because it demonstrates database design, server-side API development, frontend interface implementation, authentication, validation, security, and deployment.'),
    paragraph('The purpose of the practice was to implement a production-ready full-stack application that satisfies the assignment requirements. The object of the work is a task management information system. The subject of the work is the development of a web application using React, Node.js, Express.js, MongoDB, JWT authentication, and deployment services.'),
    paragraph('The main tasks of the practice were: to analyze functional requirements; to design a modular architecture; to implement database models and relations; to create secure authentication; to implement CRUD operations; to add search, filtering, and pagination; to develop a responsive user interface; to prepare deployment and documentation.')
  ].join('');

  const overview = [
    heading('1 PROJECT OVERVIEW AND REQUIREMENTS'),
    paragraph('The selected topic of the project is Task Manager. The system is intended for personal task organization and includes user accounts, categorized tasks, task status tracking, priority management, due dates, and progress statistics.'),
    paragraph('The application follows the required technology stack. The frontend is implemented with React and Vite. The backend is implemented with Node.js and Express.js. MongoDB Atlas is used as the cloud database, and Mongoose is used for database modeling. Authentication is implemented with JSON Web Tokens and bcrypt password hashing. Environment variables are managed through dotenv.'),
    paragraph('The database design includes three related collections: Users, Tasks, and Categories. One user can have many tasks and many categories. One category can be assigned to many tasks. Each task and category belongs to a specific user, which prevents users from accessing each other’s data.'),
    paragraph('The project structure is modular. The backend contains separate folders for controllers, routes, models, middleware, validators, services, utilities, and configuration. The frontend contains separate folders for components, pages, hooks, services, context, styles, constants, and utilities. This organization improves readability, maintainability, and separation of concerns.')
  ].join('');

  const backend = [
    heading('2 BACKEND IMPLEMENTATION'),
    paragraph('The backend application is built with Express.js. The entry point loads and validates environment variables, connects to MongoDB Atlas, creates the Express application, and starts the server on the configured port. The server disables the X-Powered-By header, uses Helmet for security headers, Compression for response compression, CORS allowlisting, JSON body parsing, and Morgan logging.'),
    paragraph('Authentication consists of three main endpoints: POST /register, POST /login, and GET /profile. During registration, the password is validated and hashed with bcrypt before saving the user. During login, the submitted password is compared with the stored hash. After successful authentication, the server signs a JWT token. Protected routes use middleware that checks the Authorization header and verifies the token.'),
    paragraph('The Tasks API implements complete CRUD operations: POST /tasks, GET /tasks, GET /tasks/:id, PUT /tasks/:id, and DELETE /tasks/:id. The GET /tasks endpoint supports search by title, filtering by status and priority, and pagination using page and limit query parameters. The backend also provides GET /tasks/summary for dashboard statistics.'),
    paragraph('The Categories API implements POST /categories, GET /categories, PUT /categories/:id, and DELETE /categories/:id. Category ownership is checked through the userId field. When a category is deleted, related tasks are kept and their category reference is cleared, which prevents accidental task loss.'),
    paragraph('Validation is implemented with Joi. Email format, password complexity, required fields, task title, category color, object identifiers, and query parameters are validated before controller logic is executed. Validation errors return HTTP 400 responses with readable messages. Centralized error middleware returns consistent JSON error responses for the whole API.'),
    paragraph('Security features include password hashing, JWT authentication, protected route middleware, authentication rate limiting, CORS allowlisting through CLIENT_URL, environment validation on startup, Helmet security headers, and removal of sensitive password fields from JSON responses.')
  ].join('');

  const frontend = [
    heading('3 FRONTEND IMPLEMENTATION'),
    paragraph('The frontend application is implemented with React and Vite. React Router is used for page navigation, Axios is used for API communication, and Context API is used for authentication state, notifications, and theme management. The frontend stores the JWT token in local storage and attaches it to protected API requests.'),
    paragraph('The application includes the required pages: Login Page, Registration Page, Dashboard, Profile Page, Task Management Page, and Category Management Page. Protected routes redirect unauthenticated users to the login page, while authenticated users can access the main application shell.'),
    paragraph('The Dashboard displays total tasks, completed tasks, pending tasks, and high-priority tasks. These values are received from the backend summary endpoint. The Tasks page includes a task form, search field, status filter, priority filter, page size selector, pagination controls, and task list. The Categories page allows creating, editing, and deleting color-coded categories.'),
    paragraph('The user interface is responsive and supports desktop, tablet, and mobile screen sizes. The design uses a modern dark and light mode, cards, gradients, readable typography, loading states, error messages, success notifications, and reusable UI components. The application stores the last selected filters and search query in local storage to improve user experience.'),
    paragraph('The frontend communicates with the backend through the VITE_API_URL environment variable. This makes the application suitable for both local development and deployment on Vercel.')
  ].join('');

  const testingDeployment = [
    heading('4 TESTING AND DEPLOYMENT'),
    paragraph('The application was tested locally using npm commands. The frontend production build was verified with npm run build --workspace frontend. Production dependencies were checked using npm audit --omit=dev, and no vulnerabilities were reported. Backend startup, MongoDB Atlas connection, authentication, task management, category management, filtering, pagination, and UI navigation were tested during development.'),
    paragraph('The backend is deployed on Render. Render receives the application from the GitHub repository, installs dependencies, and starts the backend with npm run start. Required environment variables on Render include MONGODB_URI, JWT_SECRET, CLIENT_URL, NODE_ENV, JWT_EXPIRES_IN, RATE_LIMIT_WINDOW_MS, and RATE_LIMIT_MAX.'),
    paragraph('The frontend is deployed on Vercel. Vercel builds the frontend from the frontend folder using npm run build and serves the dist output. The frontend uses VITE_API_URL to communicate with the deployed Render API. MongoDB Atlas is used as the production database.'),
    paragraph(`Live frontend link: ${liveLinks.frontend}.`),
    paragraph(`Live backend API link: ${liveLinks.backend}.`),
    paragraph(`GitHub repository: ${liveLinks.github}.`)
  ].join('');

  const conclusion = [
    heading('CONCLUSION'),
    paragraph('As a result of the industrial practice, a complete full-stack Task Manager web application was developed and deployed. The project satisfies the main assignment requirements: frontend implementation, backend implementation, database design, modular architecture, authentication, CRUD operations, validation, error handling, search, filtering, pagination, responsive interface, and deployment preparation.'),
    paragraph('The practical work improved skills in React, Express.js, MongoDB, Mongoose, JWT authentication, API design, validation, security hardening, and deployment. The final application can be used as a working task management system and as a demonstration of full-stack development competencies.'),
    paragraph('Further improvements may include email verification, password reset, task reminders, file attachments, team collaboration, and advanced analytics. However, the current implementation already covers the required functionality for the practice defense.')
  ].join('');

  const references = [
    heading('REFERENCES'),
    paragraph('1 React Documentation. URL: https://react.dev/', { indent: false }),
    paragraph('2 Vite Documentation. URL: https://vite.dev/', { indent: false }),
    paragraph('3 Express.js Documentation. URL: https://expressjs.com/', { indent: false }),
    paragraph('4 Mongoose Documentation. URL: https://mongoosejs.com/', { indent: false }),
    paragraph('5 MongoDB Atlas Documentation. URL: https://www.mongodb.com/docs/atlas/', { indent: false }),
    paragraph('6 JSON Web Token Documentation. URL: https://jwt.io/', { indent: false }),
    paragraph('7 Joi Documentation. URL: https://joi.dev/', { indent: false }),
    paragraph('8 Render Documentation. URL: https://render.com/docs/', { indent: false }),
    paragraph('9 Vercel Documentation. URL: https://vercel.com/docs/', { indent: false })
  ].join('');

  const appendix = [
    heading('APPENDIX A SCREENSHOTS'),
    ...imageRelationships.flatMap((image, index) => [
      imageParagraph(image.id, image.title, index + 1)
    ])
  ].join('');

  return {
    body: [titlePage, contents, intro, overview, backend, frontend, testingDeployment, conclusion, references, appendix].join(''),
    images: imageRelationships
  };
};

const calendarBody = () => {
  const rows = [
    ['Period', 'Work performed', 'Result'],
    ['Week 1', 'Analysis of assignment requirements and selection of project topic.', 'Task Manager topic selected and project scope defined.'],
    ['Week 2', 'Backend architecture design, MongoDB models, and Express routes planning.', 'Users, Tasks, and Categories collections designed.'],
    ['Week 3', 'Authentication implementation with JWT and bcrypt.', 'Register, login, and profile endpoints implemented.'],
    ['Week 4', 'Task and category CRUD API implementation.', 'Protected CRUD endpoints completed.'],
    ['Week 5', 'Frontend pages and reusable React components implementation.', 'Login, registration, dashboard, tasks, categories, and profile pages completed.'],
    ['Week 6', 'Search, filtering, pagination, local storage, notifications, and responsive design.', 'User experience features completed.'],
    ['Week 7', 'Validation, error handling, security middleware, and deployment configuration.', 'Joi validation, global errors, CORS, rate limits, Render and Vercel configs completed.'],
    ['Week 8', 'Testing, screenshots, documentation, and final report preparation.', 'Project verified, deployed, documented, and prepared for defense.']
  ];

  return [
    centered('CALENDAR PLAN', { bold: true, fontSize: 32, spacingAfter: 240 }),
    paragraph(`Student: ${student.fullName}`, { indent: false }),
    paragraph(`Group: ${student.group}`, { indent: false }),
    paragraph(`Project topic: Task Manager Full-Stack Web Application`, { indent: false }),
    table(rows),
    paragraph('Student signature: ______________________', { indent: false, spacingAfter: 240 }),
    paragraph('Practice supervisor signature: ______________________', { indent: false })
  ].join('');
};

const evaluationBody = () => [
  centered('EVALUATION LETTER', { bold: true, fontSize: 32, spacingAfter: 240 }),
  paragraph(`This evaluation letter is issued for ${student.fullName}, a student of ${student.educationalProgram}, group ${student.group}, who completed industrial practice on the project “Task Manager Full-Stack Web Application”.`),
  paragraph('During the practice period, the student demonstrated knowledge of full-stack web development, including frontend development with React, backend development with Node.js and Express.js, database modeling with MongoDB and Mongoose, authentication with JWT, validation with Joi, and deployment using Render and Vercel.'),
  paragraph('The student completed the assigned tasks responsibly and developed a working application with user authentication, protected routes, task management, category management, search, filtering, pagination, dashboard statistics, responsive design, and deployment documentation.'),
  paragraph('The quality of the completed work can be evaluated positively. The student showed independence, attention to detail, and the ability to apply theoretical knowledge in a practical software development project.'),
  paragraph('Recommended evaluation: ______________________', { indent: false, spacingAfter: 240 }),
  paragraph('Practice supervisor: ______________________', { indent: false }),
  paragraph('Signature: ______________________', { indent: false }),
  paragraph('Date: ______________________', { indent: false })
].join('');

fs.mkdirSync(outputDir, { recursive: true });

const report = reportBody();
buildDocx({ targetFile: reportPath, bodyXml: report.body, imageFiles: report.images });
buildDocx({ targetFile: calendarPath, bodyXml: calendarBody() });
buildDocx({ targetFile: evaluationPath, bodyXml: evaluationBody() });

console.log(`Created: ${reportPath}`);
console.log(`Created: ${calendarPath}`);
console.log(`Created: ${evaluationPath}`);
