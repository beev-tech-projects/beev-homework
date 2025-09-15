#!/bin/bash

# Quick setup script - minimal version
CANDIDATE_NAME=$(basename "$PWD")

# Initialize and update env (macOS compatible)
[ ! -f .env ] && make env-init
sed -i '' "s/APP_NAME=candidate_test/APP_NAME=${CANDIDATE_NAME}/g" .env
sed -i '' "s/APP_NETWORK_NAME=candidate-test-network/APP_NETWORK_NAME=${CANDIDATE_NAME}-network/g" .env

# Install packages
make install

# Create tmux session
SESSION_NAME="${CANDIDATE_NAME}-dev"
tmux kill-session -t "$SESSION_NAME" 2>/dev/null

# Create session with all windows
tmux new-session -d -s "$SESSION_NAME" -n "docker" \; \
  send-keys "make du" Enter \; \
  new-window -n "backend" \; \
  send-keys "sleep 10 && make backend" Enter \; \
  new-window -n "frontend" \; \
  send-keys "sleep 15 && make frontend" Enter \; \
  new-window -n "terminal" \; \
  select-window -t 0

echo "Setup complete! Attaching to tmux session: $SESSION_NAME"
echo "Use Ctrl+B then window number (0-3) to switch between windows"
tmux attach-session -t "$SESSION_NAME"