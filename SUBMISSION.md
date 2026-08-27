# Ajaia Docs — Submission

## Candidate

Vedant Dhoke

## Assignment

Ajaia AI-Native Full Stack Developer Assignment

## Live Application

Frontend: https://ajaia-docs-1-6j5r.onrender.com

Backend: https://ajaia-docs-x4kx.onrender.com

Health Check: https://ajaia-docs-x4kx.onrender.com/api/health

## Source Code

GitHub: https://github.com/VedantDhoke/ajaia-docs

## Video Link

Link: https://drive.google.com/file/d/1pwfGVRIUXo57bMeg9qf-ZzjwqkY3Ww_L/view?usp=sharing

## Included Deliverables

- Source code
- README.md
- ARCHITECTURE.md
- AI_WORKFLOW.md
- SUBMISSION.md
- Automated backend test
- Walkthrough video URL
- Screenshots/demo assets

## Implemented Features

- User registration
- User login
- JWT authentication
- Document creation
- Document editing
- Document renaming
- Rich-text formatting
- Automatic persistence
- Document refresh/reopen
- File upload
- Document sharing
- Owned/shared document distinction
- Document deletion
- Delete confirmation
- Authorization checks
- Automated testing
- Production deployment

## File Upload

Supported formats:

- `.txt`
- `.md`

Maximum file size:

5 MB

## Test Accounts

### Account 1

Name: Alex

Email: alex@gmail.com

Password: abcdefgh

### Account 2

Name: Bob

Email: bob@gmail.com

Password: abcdef

These accounts can be used to demonstrate the document sharing flow.

## Sharing Demonstration

1. Login as Account 1.
2. Create a document.
3. Open the sharing interface.
4. Enter Account 2's email.
5. Share the document.
6. Logout.
7. Login as Account 2.
8. The shared document should appear in the dashboard.

## Automated Test

Run:

```bash
cd server
npm test