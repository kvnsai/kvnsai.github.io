#!/bin/bash

# Get all modified or new posts in _posts/ directory
new_posts=$(git status _posts/ --porcelain | awk '{print $2}' | sort -r)

# Check if there are any modified posts
if [ -z "$new_posts" ]; then
  echo "No new or modified blog posts found in _posts/."
  exit 1
fi

# Git commands to add, commit, and push all modified posts
git add .
git commit -m "Publishing new and modified posts: $new_posts"
git push origin main

echo "Successfully published the following posts: "
echo "$new_posts"
