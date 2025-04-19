## Personal Website and Blog

This repository coonatins my own pwersonal website for showing my resume/portfolio for others to know about me. Also this contains blogs created using Jekyll which are essentially my notes for improving myself.

### Contents of this folder
- **index.html** - Contains html for the main website 
- **assets** - Contains css, js and images required for personal website
- **_config.yml** - jekyll configuration file
- **Gemfile** - jekyll environment file
- **vendor** - jekyll application binary, cache, extensitons, plugins 
- **_site** - For some reason it is copying above files and some other to this. Some jekyll stuff
- **_posts** - Write your blog posts following pattern from exiting patterns. Filename follows this pattern *<YYYY>-<MM>-<DD>-<FileName>.md*. Anything not starting with date will not be displayed in blog.
- **blog.html** - jekyll's blog section. Do not change as the URL format from here is being used by javascript to show on index.html.
- **about.html** - jekyll's about section
- **404.html** - ..
- **new_post.sh** - Create a markdown file in _posts directory. It kind of have the template to start writing the blog. Make sure to modify the title and add categories. 
- **publish_post.sh** - If you are keeping the blog up to date and want to add a new blog post, just running this post will publish the newly created post to github. If you want to commit any changes add and push the file manaully. Add any charecter to the beginning of filename in _posts to make it not visible as blog.

### General workflow

Method 1 - Follow these steps when you are committed in keeping the blog up-to-date:

- Create a new blog post: `new_post.sh <FileName>`
- Publish the created one: `publish_post.sh`

Method 2 - If you are lazy and procastinating add manually as always:

- Add created or modified files: `git add <filename(s)>`
- Commit changes to repo: `git commit -m "Some context to changes"`
- Push changes to repo: `git push`

Try to follow the first method
