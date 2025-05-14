## Refactor DeepSeek Integration and Editor Components

This commit includes a comprehensive refactoring of the DeepSeek AI integration and editor components, improving code quality, error handling, and documentation across the codebase.

### Major Changes

- **API Route Refactoring**: Restructured `/api/generate` route for better organization, separation of concerns, and error handling
- **Middleware Improvements**: Enhanced the authentication middleware to properly add user information to API requests
- **Template System**: Added 9 comprehensive templates with consistent styling and formatting
- **Documentation**: Added detailed JSDoc comments and updated README with DeepSeek integration details

### API Improvements

- Refactored DeepSeek API route with better function organization and typing
- Enhanced error handling for API responses
- Improved template detection and content formatting
- Added TypeScript interfaces for request/response types
- Implemented more robust fallback content generation
- Ensured consistent H1 formatting across all generated content

### UI Components

- Updated PromptInput component with better error handling
- Enhanced user feedback for API failures 
- Added accessibility attributes to UI components
- Implemented proper styling across all templates

### Other Improvements

- Updated package.json with version bump to 0.2.0
- Added node engine requirements
- Improved error handling and logging throughout
- Ensured consistent name replacement across templates
- Fixed template styling for bullet points and lists

This refactoring improves maintainability, code quality, and user experience while preserving all existing functionality. 