#!/bin/bash

# Function to find and kill process running on port 4321
kill_port_process() {
  echo "Checking for processes on port 4321..."
  
  # Get process ID using lsof
  PID=$(lsof -ti:4321)
  
  if [ -n "$PID" ]; then
    echo "Found process $PID running on port 4321. Killing it..."
    kill -9 $PID
    echo "Process killed."
  else
    echo "No process found on port 4321."
  fi
}

# Kill any existing process on port 4321
kill_port_process

# Start Next.js dev server on port 4321
echo "Starting development server on port 4321..."
exec npm run dev -- --port 4321 