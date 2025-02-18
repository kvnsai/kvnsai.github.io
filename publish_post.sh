#!/bin/bash

# Get the most recently modified file in _posts/
latest_post=$(ls -t _posts/ | head -n 1)

# Check if a post exists
if [ -z "$latest_post" ]; then
  echo "No new blog post found in _posts/."
  exit 1
fi

# Git commands to add, commit, and push
git add .
git commit -m "Adding new post: $latest_post"
git push origin main

echo "Successfully published: $latest_post"
