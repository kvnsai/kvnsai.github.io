---
layout: post
title: "Rust Programming Basic"
date: 2025-05-19
categories: "Rust"
---

* TOC
{:toc}


# Getting Started with Rust Programming
Rust is a modern systems programming language that blends performance, reliability, and productivity. Created by Mozilla, it is designed to empower developers to write fast and memory-safe code, without the hassle of garbage collection. Rust is an excellent choice for system-level work, web assembly, embedded programming, and high-performance applications.

# Installing Rust
Before we dive into coding, let’s get Rust installed on your machine.

Rust provides an easy-to-use installer called rustup, which sets up the latest stable toolchain.

Install via command line (Linux/macOS):

``` bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

For Windows, you can download and run the installer from the official Rust website: https://www.rust-lang.org/tools/install

After installation, ensure everything is set up by running:

```bash
rustc --version
cargo --version
```

# First Rust Program: Hello, World!
Let’s write the traditional “Hello, World!” program in Rust. Create a new `main.rs` file and fill with this code:

```rust
fn main() {
    println!("Hello, world!");
}
```
What’s Happening Here?
- `fn main()`: This defines the main function, which is the entry point of every Rust program.
- `println!`: A Rust macro that prints text to the console, followed by a newline.
- "Hello, world!": The string we’re printing.

> Note: The exclamation mark ! in println! signifies that it’s a macro, not a regular function.

Compile the Program using the Rust compiler `rustc` to compile the code:

``` bash
rustc main.rs
```

This will generate an executable named `main` or `main.exe` (on Windows) in the current directory. Run the program by executing this.

``` bash
./main
#Output
Hello, world!
```

#  Cargo: Rust’s Build System and Package Manager
Rust comes bundled with Cargo, a powerful tool that handles building your code, downloading dependencies, running tests, and more. When working with Rust, you'll almost always use Cargo to manage your projects. 

Why Use Cargo?
- Simplifies project creation
- Manages dependencies via Cargo.toml
- Handles building and running
- Integrates testing and formatting tools

> Cargo is installed by default when you install Rust using rustup.

#### Creating a New Project with Cargo
Create a New Project using `cargo new hello_cargo`. This creates a new directory named hello_cargo with the following structure:

```bash
hello_cargo/
├── Cargo.toml
└── src/
|   └── main.rs
└── target
|   └── debug
|       └── hello_cargo
└── Cargo.toml    
# Other files and dirctories are unimportant at this point of study.
```
What’s Inside?
- `Cargo.toml`: The manifest file where you define the package name, version, dependencies, and metadata.
- `src/main.rs`: Your main Rust source file. Cargo expects your code to be in src/.
- `./target/debug/hello_cargo` : This is the executable corresponding to the main function compiled using Rust.  
> By defult the main program is populated with "Hello, world!" program and compiled.  

**Build the project** using `cargo build`. This compiles your project and creates an executable in the target/debug directory.

**Run the program** with `cargo run` which can also run and build it in one step. If you've already built it once and no code has changed, Cargo will skip recompilation. 
```sh
$ cargo run

   Compiling hello_cargo v0.1.0
    Finished dev [unoptimized + debuginfo] target(s) in 0.46s
     Running `target/debug/hello_cargo`
Hello, world!
```
**Quick build check (with no binary)** using `cargo check` to check for errors without producing an executable.

Cargo makes it easy to manage larger Rust projects with multiple modules and dependencies. You’ll use it throughout your Rust development journey. This is much faster and great for development.

#### Formatting a File
Maintaining clean, consistent code style is essential for readability and collaboration. Fortunately, Rust provides a powerful tool called rustfmt to automatically format your code according to the official Rust style guidelines.

> It is already available if you're using rustup (the recommended way to install Rust), rustfmt can be added like this.
```
rustup component add rustfmt
rustfmt --version
```

Let’s say you have a Rust file with messy formatting like this:

```rust
fn main(){let x=5;println!("x is {}",x);}
```

You can format it using: `rustfmt main.rs`
After formatting, it will look like:

```rust
fn main() {
    let x = 5;
    println!("x is {}", x);
}
```

When working in a Cargo project, the easiest way to format your entire project is using `cargo fmt`.

# Variables, Constants, Shadowing, and Immutability 

Rust gives you fine-grained control over how data is stored and accessed. Understanding variables, constants, immutability, and shadowing is essential to writing idiomatic Rust code.

#### Variables
By default, ***variables*** in Rust are ***immutable***. This means once a value is assigned to a variable, it cannot be changed

```rust
fn main() {
    let x = 5;
    println!("The value of x is: {}", x);
    
    // x = 6; // ❌ This will cause a compile-time error
}
```
> **If you want a mutable variable, you need to explicitly use the `mut` keyword**

```rust
fn main() {
    let mut x = 5;
    println!("The value of x is: {}", x);
    
    x = 6; // ✅ This is allowed
    println!("Now the value of x is: {}", x);
}
```

#### Constants
***Constants*** are always ***immutable***, and they must be annotated with a type. You can define them using the `const` keyword outside or inside functions.

```rust
const MAX_USERS: u32 = 100_000;

fn main() {
    println!("The maximum number of users is: {}", MAX_USERS);
}
```

- Constants must be **set to a constant expression**, not a value that’s only known at runtime.
- They are typically written in *SCREAMING_SNAKE_CASE*.

#### Shadowing
Rust allows you to "**shadow**" a variable by redeclaring it using `let`. This creates a new variable with the *same name*, which can even have a different type or mutability.

```rust
fn main() {
    let x = 5;
    let x = x + 1; // shadows the previous x
    let x = x * 2;

    println!("The value of x is: {}", x); // prints 12
}
```
Shadowing is useful in the following situations: 
- To transform a variable without needing a new name.
- To change the type or mutability in a new scope.

```rust
fn main() {
    let spaces = "   ";
    let spaces = spaces.len(); // Now it's an integer!
    
    println!("Spaces count: {}", spaces);
}
```

If you had tried to mutate the original string into an integer, it would have resulted in a type error. Shadowing makes this kind of transformation clean and idiomatic.

| Feature   | Mutable                       | Type Change Allowed | Scope        |
| --------- | ----------------------------- | ------------------- | ------------ |
| `let`     | No (default) / Yes with `mut` | No                  | Local        |
| `const`   | No                            | No                  | Global/Local |
| Shadowing | No                            | Yes               | Local        |

> Rust’s strict rules about immutability and clarity in variable declaration help catch bugs at compile time and encourage safe, predictable code.