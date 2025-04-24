---
layout: post
title: "The Lifecycle of a Program: From Storage to Execution"
date: 2025-04-24
categories: OS Memory Process Storage
---

* TOC
{:toc}

When you double-click a desktop icon, run a terminal command like `./my_app`, or tap an app on your phone, you're triggering a complex and fascinating process beneath the surface—one that transitions a program from passive storage on disk to an actively executing process in memory. This transformation is central to how computing systems function, and in this post, we'll explore every stage in intricate detail. This is not just about execution, but the **entire lifecycle**, covering operating system internals, memory management, file systems, CPU interactions, and more.

### Introduction

The ability to execute programs is the cornerstone of modern computing. While it may seem simple on the surface, what actually happens when a user runs a program is the result of multiple layers of software and hardware coordination. This blog will walk through that process with a goal to exceed 10,000 words, serving as a deep dive into the internals of program execution.

### What is a Program?

A **program** is a collection of instructions written to perform a specific task. These instructions are stored in a binary file, typically in an executable format such as ELF (Executable and Linkable Format) on Unix systems or PE (Portable Executable) on Windows. This file resides on a **secondary storage device**, such as an HDD or SSD.

Unlike data files, executable files contain specific sections like headers, code, data, and relocation information. But they are inert on disk—they do nothing until they're executed. That execution requires RAM, a CPU, and crucially, the OS.

### Primary vs Secondary Memory

- **Primary memory (RAM):** Fast, volatile memory where programs run.
- **Secondary memory (Disk):** Persistent but slower storage where programs are stored when not running.

To run a program, the system needs to **load it from secondary memory into primary memory**. This movement is a key part of the execution lifecycle and is governed by the OS and the **memory management unit (MMU)** in modern CPUs.

### The Role of the Operating System

The OS is the central authority managing all hardware and software interactions. It handles:

- **Process creation and management**
- **Memory allocation and mapping**
- **I/O coordination**
- **Security and isolation between processes**

The OS is the primary actor that takes an executable file and turns it into a running process.

### The File System and Executables

The executable program resides on a **file system**, which provides structure to the data stored on disk. File systems organize data into files and directories, each with permissions, metadata, and contents.

When you run `./my_app`, the OS must:

- Locate the file
- Check if it has executable permissions
- Read the file header to determine the format
- Use the correct **loader** to begin execution

### Requesting Execution

This can be done via:

- Command-line interface (CLI): `./program`
- Graphical User Interface (GUI): Double-click
- System boot scripts or daemons

This triggers the OS to begin the program lifecycle. Behind the scenes, this is often a `fork()` followed by an `exec()` in Unix-like systems.

### The OS Creates a Process

The OS creates a new **process control block (PCB)**. This contains:

- PID (Process ID)
- Process state
- CPU register snapshot
- Memory map
- File descriptors

It allocates resources and establishes the process in a new virtual memory space.

### Virtual Memory and Address Space

Every process is given a **virtual address space**, which isolates it from other processes. The key components include:

- Code (Text segment)
- Initialized data
- Uninitialized data (BSS)
- Heap
- Stack

The OS uses **page tables** to map virtual addresses to physical memory.

### The Loader: Bringing the Binary to Life

The **loader** is responsible for:

- Reading the executable's header
- Loading necessary sections into memory
- Resolving symbol addresses
- Setting entry point for execution
- Loading shared libraries (for dynamically linked binaries)

It reads the binary and prepares it for execution.

### Memory Segments: Text, Data, Stack, Heap

Each memory segment has a distinct role:

- **Text:** Contains executable instructions
- **Data:** Stores initialized global and static variables
- **BSS:** Stores uninitialized data
- **Heap:** For dynamic memory (via `malloc`, etc.)
- **Stack:** For function calls, local variables, and return addresses

These segments are loaded into the virtual memory space and mapped appropriately.

### Setting Up the Execution Context

The loader and OS together set up:

- Initial stack content (including `argv`, `argc`, `envp`)
- CPU registers (e.g., Program Counter pointing to `main()`)
- Page tables for virtual memory

At this point, the program is ready to run.

### Transition to Running: Context Switching

The CPU may be running another process. To start our new one, the OS performs a **context switch**, where it:

- Saves the current process's CPU state
- Loads the new process's state
- Updates the CPU to begin executing the new process

### CPU Fetch-Decode-Execute Cycle

Once control is transferred:

1. **Fetch** the instruction from memory
2. **Decode** the instruction (what operation is needed?)
3. **Execute** it using ALU or other units

This cycle continues until the program ends or is interrupted.

### Dynamic Memory and the Heap

If the program uses dynamic memory:

- Calls to `malloc()` request space from the heap
- The OS may need to extend the heap using `brk()` or `mmap()`
- The memory is managed by internal allocators like `ptmalloc` or `jemalloc`

### System Calls and User Mode vs Kernel Mode

Programs run in **user mode**. When they need hardware access (file I/O, memory), they make **system calls**, switching to **kernel mode** where the OS handles privileged operations.

Examples include:

- `read()`
- `write()`
- `open()`
- `execve()`

### Libraries and Dynamic Linking

Many programs use **shared libraries**, which are loaded at runtime:

- The loader or dynamic linker (`ld-linux.so`) resolves symbols
- Libraries are mapped into memory
- Code in the library can then be called by the main program

This saves memory and supports modularity.

### Paging, Swapping, and Memory Pressure

If RAM runs low, the OS:

- Swaps out inactive memory pages to disk (swap space)
- Pages in data from disk as needed

This allows more programs to run than the physical memory would otherwise permit.

### Handling Interrupts and Signals

Programs may receive **signals** like `SIGINT` (Ctrl+C) or `SIGTERM`:

- Signals interrupt normal execution
- Handlers can be defined
- Some signals cause immediate termination

### Process Termination and Cleanup

When the program finishes:

- The OS deallocates memory
- Closes file descriptors
- Updates system tables
- Parent process may call `wait()` to collect the exit status

### Conclusion

The journey from disk to running process is intricate and multi-layered. Each stage involves a different subsystem of the OS and hardware. Understanding this process deepens your appreciation for what happens each time you simply "run a program."

In follow-up posts, we'll dive deeper into each component—paging algorithms, linker internals, syscall tracing, and more. If you’ve made it this far, you now have a solid foundation in the lifecycle of program execution.

