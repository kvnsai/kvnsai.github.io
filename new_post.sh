#!/bin/bash


## Usage:
# ./new_post.sh <Title with - insteead of space>

# Set variables
POSTS_DIR="_posts"
DATE=$(date +"%Y-%m-%d")
TITLE=$1
FILENAME="${POSTS_DIR}/${DATE}-${TITLE}.md"

# Create the _posts directory if it doesn't exist
mkdir -p "$POSTS_DIR"

# Check if the file already exists
if [ -f "$FILENAME" ]; then
    echo "Error: File $FILENAME already exists!"
    exit 1
fi

# Write the template to the file
cat <<EOF > "$FILENAME"
---
layout: post
title: $1
date: $DATE
categories: ""
---

* TOC
{:toc}

Add the blog content here...

# Introduction
Provide a brief introduction to the topic. Explain what the post is about and why it matters.

# Section 1: Overview
Explain the core concept in detail. Use examples and diagrams if necessary.

# Section 2: When and Why to Use It
Discuss scenarios where this concept is useful and its practical applications.

# Section 3: Implementation Steps
Provide step-by-step guidance on how to implement or use the concept.
\`\`\`bash
# Example command or code snippet
echo "Hello, World!"
\`\`\`
# Section 4: Best Practices
List common mistakes, optimizations, and recommended practices.

Conclusion
Summarize key takeaways and possible next steps.


EOF


echo "New blog post created: $FILENAME"

bundle exec jekyll serve