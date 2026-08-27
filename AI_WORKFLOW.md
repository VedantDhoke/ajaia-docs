# AI Workflow Note

## AI Tools Used

I used AI coding assistants during development to accelerate implementation and debugging.

The primary tools used were:

- ChatGPT
- AI-assisted code generation and debugging tools

## Where AI Helped

AI was primarily used for:

- Initial project structure
- Boilerplate generation
- React component scaffolding
- Express route/controller structure
- Debugging API issues
- Debugging deployment issues
- Reviewing implementation approaches
- Generating test cases
- Improving documentation

AI was used as an implementation accelerator rather than as a replacement for engineering decisions.

## How I Used AI

I generally broke the work into smaller tasks instead of asking AI to build the entire application in one step.

For example:

1. Define the required product scope.
2. Create the frontend structure.
3. Create authentication.
4. Implement document CRUD.
5. Add rich-text editing.
6. Add sharing.
7. Add file upload.
8. Add authorization tests.
9. Deploy frontend and backend.
10. Debug production-specific issues.

This made it easier to verify each feature independently.

## AI Output That Required Changes

AI-generated code was not always used directly.

During development, I encountered issues involving:

- Vite/plugin version compatibility
- React routing after deployment
- Production API URL configuration
- CORS configuration
- Render file upload behavior
- MongoDB connections during automated testing

These required manual investigation, testing, and changes rather than blindly accepting generated solutions.

## Example: Production Upload Issue

The upload feature worked locally but initially returned a 500 error after deployment.

The production logs showed an `ENOENT` error because the upload directory did not exist in the Render environment.

I used the error output to identify the actual problem and updated the backend to create the upload directory when required.

The fix was then deployed and verified against the live application.

## Verification Process

I verified functionality through:

- Manual end-to-end testing
- Browser network inspection
- Backend logs
- Automated Jest tests
- Refresh/persistence testing
- Testing authenticated and unauthenticated flows
- Testing owner vs shared-user behavior
- Production deployment testing

## Engineering Judgment

AI accelerated implementation, but product scope and tradeoffs were decided based on the assessment requirements and available time.

I intentionally prioritized:

- A complete document lifecycle
- Reliable persistence
- Basic sharing
- File import
- Authorization
- A usable editor
- Production deployment

Instead of attempting to build advanced Google Docs features that would have resulted in a less complete product.

## Key Principle

The goal was to use AI to reduce implementation time while keeping responsibility for architecture, validation, debugging, prioritization, and final decisions with the developer.