---
layout: post
title: Summarize-OpenHPC-Deployment
date: 2025-03-06
categories: ""
---

* TOC
{:toc}

Add the blog content here.

# Introduction
Provide a brief introduction to the topicExplain what the post is about and why it matters.

1 Introduction
1.1 Target Audience.
1.2 Requirements/Assumptions
1.3 Inputs

2 Install Base Operating System (BOS)

3 Install OpenHPC Components
3.1 Enable OpenHPC repository for local use
3.2 Installation template
3.3 Add provisioning services on master node
3.4 Add resource management services on master node
3.5 Complete basic Warewulf setup for master node.
3.6 Define compute image for provisioning.
3.6.1 Build initial BOS image.
3.6.2 Add OpenHPC components
3.6.3 Customize system configuration.
3.6.4 Additional Customization (optional)
3.6.4.1 Enable ssh control via resource manager
3.6.4.2 Enable forwarding of system logs
3.6.4.3 Add ClusterShell.
3.6.4.4 Add genders
3.6.4.5 Add Magpie
3.6.4.6 Add ConMan
3.6.4.7 Add NHC.
3.6.5 Import files.
3.7 Finalizing provisioning configuration
3.7.1 Assemble bootstrap image.
3.7.2 Assemble Virtual Node File System (VNFS) image
3.7.3 Register nodes for provisioning.
3.7.4 Optional kernel arguments.
3.7.5 Optionally configure stateful provisioning
3.8 Boot compute nodes

4 Install OpenHPC Development Components
4.1 Development Tools18
4.2 Compilers.19
4.3 MPI Stacks19
4.4 Performance Tools19
4.5 Setup default development environment19
4.6 3rd Party Libraries and Tools.20
4.7 Optional Development Tool Builds21

5 Resource Manager Startup

6 Run a Test Job
6.1 Interactive execution23
6.2 Batch execution.24