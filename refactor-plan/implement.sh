#!/bin/bash
set -e

echo "Death Note Project Refactoring Implementation"
echo "============================================="

# Create a backup
echo "Creating backup..."
mkdir -p ./backup
cp -r ./src ./backup/
cp package.json ./backup/

# 1. Remove unused editor implementation
echo "Removing unused EditorJS components..."
rm -f src/components/editorjs-wrapper.tsx
rm -f src/types/editorjs.d.ts

# 2. Update package.json
echo "Updating package.json to remove unused dependencies..."
cp refactor-plan/package-updated.json package.json

# 3. Create .env.example
echo "Creating .env.example file..."
cp refactor-plan/env-example.txt .env.example

# 4. Update README.md
echo "Updating README.md..."
cp refactor-plan/README-new.md README.md

# 5. Add CONTRIBUTING.md
echo "Adding CONTRIBUTING.md..."
cp refactor-plan/CONTRIBUTING.md CONTRIBUTING.md

# 6. Add LICENSE
echo "Adding LICENSE file..."
cp refactor-plan/LICENSE LICENSE

# 7. Document API routes
echo "Documenting API routes..."
mkdir -p docs
cp refactor-plan/api-documentation.md docs/API.md

# 8. Update API route with proper JSDoc comments
echo "Updating API routes with JSDoc comments..."
cp refactor-plan/deepseek-route-documented.ts src/app/api/deepseek/route.ts

# 9. Update TiptapEditor with proper JSDoc comments
echo "Updating TiptapEditor with JSDoc comments..."
cp refactor-plan/tiptap-editor-documented.tsx src/components/tiptap-editor.tsx

# 10. Clean up dependencies
echo "Cleaning up dependencies..."
npm install

# 11. Initialize git repository
echo "Would you like to initialize a git repository? (y/n)"
read answer
if [ "$answer" = "y" ]; then
  echo "Initializing git repository..."
  
  # Check if git is already initialized
  if [ -d .git ]; then
    echo "Git repository already exists"
  else
    git init
    git add .
    git commit -m "Initial commit: Death Note application"
    
    echo "Would you like to add a remote repository? (y/n)"
    read answer
    if [ "$answer" = "y" ]; then
      echo "Enter remote repository URL:"
      read remote_url
      git remote add origin $remote_url
      echo "Would you like to push to the remote repository? (y/n)"
      read answer
      if [ "$answer" = "y" ]; then
        git push -u origin main
      fi
    fi
  fi
fi

echo "Refactoring complete!" 