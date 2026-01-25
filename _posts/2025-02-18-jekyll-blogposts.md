---
layout: post
title: "Creating blog posts using Jekyll"
date: 2025-02-18
categories: github jekyll
---
* Title
* TOC
{:toc}

# Setting Up the Website on GitHub
#### Create a GitHub Repository for Your Website
- Go to [GitHub](https://github.com) and create a new repository (e.g., `username.github.io`).
- Make sure to choose **Public** so that GitHub Pages can serve your website.

#### Clone the Repository Locally
```bash
git clone https://github.com/username/username.github.io.git
cd username.github.io
```

# Installing Jekyll and Bundler for Blogging
#### Install Jekyll and Bundler

Jekyll is a Ruby-based framework, so you’ll need Ruby installed.

Install Jekyll and Bundler by running the following commands:

```bash
sudo apt install ruby-full  # Debian/Ubuntu
brew install ruby           # macOS (Homebrew)

gem install --user-install bundler jekyll
# Use the --user-install flag to install gems locally
```
By default, Ruby gems installed locally are placed in `~/.gem/ruby/X.X.X/bin` (where `X.X.X` is your Ruby version). You need to add this directory to your `PATH`.

```sh
echo 'export PATH="$HOME/.gem/ruby/$(ruby -e "puts RUBY_VERSION")/bin:$PATH"' >> ~/.zshrc  # If using zsh
echo 'export PATH="$HOME/.gem/ruby/$(ruby -e "puts RUBY_VERSION")/bin:$PATH"' >> ~/.bashrc # If using bash
source ~/.zshrc  # or source ~/.bashrc
```

#### Set Up Bundler in Your Project
If you don't have a Gemfile in your repository yet ( it should be there), create one:

``` bash
touch Gemfile
```

Add the following content to the Gemfile:

```ruby
source "https://rubygems.org"
gem "jekyll", "~> 4.0"
gem "minima", "~> 2.5"
```

####  Convert Your Portfolio Website to a Jekyll Project
Inside your __portfolio website's root__ folder, run:

```sh
jekyll new . --force
```

This will initialize Jekyll inside your existing project. Your directory will now contain:
```bash
├── 404.html
├── about.markdown
├── assets
├── blog.html
├── _config.yml
├── Gemfile
├── Gemfile.lock
├── index.md
├── _posts
├── _site
└── vendor
```

#### Configure Jekyll for Your Portfolio
Modify `_config.yml` to update site settings:

```yaml
title: "My Portfolio and Blog"
author: "Your Name"
description: "A personal blog and portfolio."
theme: minima  # (or remove this if you want a custom layout)it
paginate: 5
```
#### Start Your Jekyll Site

Build and serve the site locally:
```bash
bundle exec jekyll serve
```

Your site should now be live at [http://localhost:4000](http://localhost:4000).

#### Set Up the Blog Page

In Jekyll, you would typically have a blog index page that lists all of your blog posts. You can create a file called `blog.html` or `index.html` inside the `blog/` folder (or any other directory you prefer).

Create a `blog.md` or `blog.html` file in the root of your project:

`blog.md`(or `blog.html`):

```html
<li class="navbar-item">
  <a class="navbar-link" href="/blog.html">Blog</a>
</li>
```
Or, if you're using a dynamic blog (where you can set the blog path in the `_config.yml`), ensure your baseurl and url are correctly set up to support the path:

In `_config.yml`:

```yaml
baseurl: "" # Set to "/" or your blog folder if it's not at the root
url: "https://yourdomain.com"
```

#### Steps for Adding a New Blog Post
__Create a New Blog Post__
- In the _posts directory, create a new markdown file with the format `YYYY-MM-DD-title.md`. For example: `2025-02-18-my-first-post.md`.
- Add the YAML front matter to define the post's metadata:
```yaml
---
layout: post
title: "My First Post"
date: 2025-02-18
---
```
- Write the content of your blog post below the front matter. Body of the post can be Markdown(`.md`) or HTML(`.html`) as needed.
- Run `bundle exec jekyll serve` again to view the blog locally at [http://localhost:4000/blog](http://localhost:4000/blog).
- Once you’re happy with your post, commit the changes and push them to GitHub:
```bash
git add _posts/2025-02-18-my-first-blog-post.md
git commit -m "Add new blog post"
git push origin main
```