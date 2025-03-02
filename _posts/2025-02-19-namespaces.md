---
layout: post
title: "Understanding Linux Namespaces"
date: 2025-Feb-19
categories: "Linux Containerization"
author: Niranjan Sai
---

* TOC
{:toc}

# Introduction
Linux namespaces provide the foundation for containerization technologies like Docker and Kubernetes, allowing multiple services (processes) to run on a single machine without interfering with each other. They enable processes to have their own separate instances of global system resources, effectively creating lightweight virtual environments. The technical definition is as follows:

> *Namespaces are a feature of the Linux kernel that partition kernel resources such that one set of processes sees one set of resources, while another set of processes sees a different set of resources. The feature works by having the same namespace for a set of resources and processes, but those namespaces refer to distinct resources. Resources may exist in multiple namespaces.*
>
> — *[Wikipedia - Linux Namespaces](https://en.wikipedia.org/wiki/Linux_namespaces)*

Just as `chroot` restricts a process to view a specific directory as its root, isolating it from the rest of the filesystem, Linux namespaces extend this concept by allowing various aspects of an operating system such as process IDs, network interfaces, and user privileges to be isolated and independently controlled. This enables the creation of self-contained environments where processes operate as if they are running on separate systems, enhancing security, flexibility, and resource management. In this post, we will explore the **seven** main types of Linux namespaces and how they contribute to process isolation.

---

## 1. Process ID Namespace (PID)
Traditionally, the Linux kernel maintains a single process tree, representing all running processes in a hierarchical parent-child structure. Given the right permissions, a process can inspect, trace, or even terminate another process within this shared tree. With the introduction of **PID** namespaces, it became possible to create multiple, isolated process trees. Each namespace has its own independent set of processes, ensuring that processes inside one namespace cannot see, inspect, or interfere with those in another. 

At system startup, Linux begins execution with a single process (*PID 1*), which serves as the root of the process tree. This process is responsible for system initialization, managing services, and launching other processes. The PID namespace allows for the creation of a new, isolated process tree, where a new PID 1 is designated within its own namespace. While the parent process remains in the original namespace, the child process sees itself as the root of its own independent process hierarchy.

A key aspect of PID namespaces is **one-way visibility**: processes inside a child namespace are completely unaware of the parent namespace and its processes. However, the parent namespace retains full visibility into all child namespaces, treating their processes as standard system processes.

Additionally, PID namespaces support nesting, meaning a process can create a new PID namespace and launch a process within it, which in turn can create another PID namespace, forming a layered hierarchy. This allows for highly flexible and isolated execution environments.

Due to this feature, a single process can now be associated with multiple PIDs—one for each namespace in which it exists. This is reflected in the Linux kernel source code, where the traditional struct pid, which previously tracked a single PID, now accommodates multiple namespace-specific PIDs using a structure called struct `upid`.


Mare details about changes in `struct pid` after the entry ofs namespaces can be found on [LWN.net](https://lwn.net/Articles/259217/). Here is how the struct pid looked like before introducing the PID namespaces:

```c
struct pid {
atomic_t count;				/* reference counter */
int nr;					/* the pid value */
struct hlist_node pid_chain;		/* hash chain */
struct hlist_head tasks[PIDTYPE_MAX];	/* lists of tasks */
struct rcu_head rcu;			/* RCU helper */
};
```

And this is how it looks now:

```c
struct upid {
int nr;					/* moved from struct pid */
struct pid_namespace *ns;		/* namespace this value is visible */
struct hlist_node pid_chain;		/* moved from struct pid */
};

struct pid {
atomic_t count;
struct hlist_head tasks[PIDTYPE_MAX];
struct rcu_head rcu;
int level;				/* the number of upids */
struct upid numbers[0];
};
```

By leveraging PID namespaces, Linux provides a powerful mechanism for process isolation, which is fundamental to containerization and secure multi-tenant computing.

---

## 2. Network Namespace (NET)

**Network namespaces** in Linux provide an isolated network stack for processes, ensuring that they have their own network interfaces, routing tables, firewall rules, and sockets. This allows multiple applications to run independently on the same system, each with its own networking environment, similar to how containers like Docker operate.

Each network namespace starts with only a loopback (lo) interface, and additional interfaces must be manually configured. This enables scenarios such as running multiple isolated networking environments on a single host, testing network configurations without affecting the main system, or securely isolating applications.

To create and enter a new network namespace:

```sh
unshare --net /bin/bash
```
This starts a new shell with a separate network namespace, but this namespace is temporary and will be lost once you exit the shell.By default, you'll only see the lo (loopback) interface, and it will be down.
```sh
root@my-pc:/home/nsai# ip a
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
```

To  bring it up
```sh
root@my-pc:/home/nsai# ip link set lo up
root@my-pc:/home/nsai# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
```

Create a `veth` pair. This creates two virtual Ethernet interfaces (`veth0` and `veth1`), which act as a tunnel between two namespaces.

```sh
root@my-pc:/home/nsai# ip link add veth0 type veth peer name veth1
root@my-pc:/home/nsai# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: veth1@veth0: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether 5a:6b:07:90:2c:58 brd ff:ff:ff:ff:ff:ff
3: veth0@veth1: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether d6:52:0c:fe:c1:82 brd ff:ff:ff:ff:ff:ff
```

Create a Network Namespace which is named and persistant. Move veth1 to the New Namespace

```sh
root@my-pc:/home/nsai# ip netns add myns
root@my-pc:/home/nsai# ip link set veth1 netns myns

# Observe the Network Namespace
# On the Host:
root@my-pc:/home/nsai# ip link show
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
3: veth0@if2: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 82:31:be:44:0c:8c brd ff:ff:ff:ff:ff:ff link-netns myns

# Inside myns:
root@my-pc:/home/nsai# ip netns exec myns ip link show
1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: veth1@if3: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether 72:aa:80:06:56:db brd ff:ff:ff:ff:ff:ff link-netnsid 0
root@my-pc:/home/nsai# 
```
Configure networking by assigning IP address and enabling communication
```sh
root@my-pc:/home/nsai# ip addr add 192.168.1.1/24 dev veth0
root@my-pc:/home/nsai# ip link set veth0 up

3: veth0@if2: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state LOWERLAYERDOWN group default qlen 1000
    link/ether d6:52:0c:fe:c1:82 brd ff:ff:ff:ff:ff:ff link-netns myns
    inet 192.168.1.1/24 scope global veth0
       valid_lft forever preferred_lft forever

root@my-pc:/home/nsai# ip netns exec myns ip addr add 192.168.1.2/24 dev veth1
root@my-pc:/home/nsai# ip netns exec myns ip link set veth1 up

2: veth1@if3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 5a:6b:07:90:2c:58 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 192.168.1.2/24 scope global veth1
       valid_lft forever preferred_lft forever
    inet6 fe80::586b:7ff:fe90:2c58/64 scope link 
       valid_lft forever preferred_lft forever

root@my-pc:/home/nsai# ping -c 2 192.168.1.2
PING 192.168.1.2 (192.168.1.2) 56(84) bytes of data.
64 bytes from 192.168.1.2: icmp_seq=1 ttl=64 time=0.052 ms
64 bytes from 192.168.1.2: icmp_seq=2 ttl=64 time=0.082 ms
--- 192.168.1.2 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1022ms
rtt min/avg/max/mdev = 0.052/0.067/0.082/0.015 ms
```
To delete the created network namespace use: `sudo ip netns del myns`

---

## 3. Unix Timesharing System Namespace (UTS)
The **UTS (Unix Timesharing System) Namespace** is crucial in containerization and virtualization, as it allows processes to have their own isolated system identifiers. Specifically, it isolates the hostname and NIS domain name for each namespace, enabling multiple containers or virtualized environments to run with different hostnames, even on the same physical host.

This feature is particularly valuable in scenarios like Docker, Kubernetes, or any virtualized environment where each container or virtual machine needs to appear as though it is running on its own independent system, with its own identity, even though they share the same underlying physical machine.

To create a UTS namespace, the `unshare` command is used with the `--uts` option. You can then change the hostname within this namespace using the hostname command:
```sh
root@my-pc:~# unshare --uts /bin/bash
root@my-pc:/home/nsai# hostname newhostname
root@my-pc:/home/nsai# hostname
newhostname 
```
It can be checked that it will be `my-pc` isntead of `newhostname`. This is important for:
- **Unique Hostnames:** Containers can have their own hostnames, making service discovery and communication easier, and ensuring logs and metrics are container-specific.
- **NIS Domain Name Isolation:** Although less common, isolating NIS settings ensures containers do not interfere with each other’s domain configurations.
- **Managing Multiple Services:** Containers can run independently without conflicts, essential for microservices or multi-tier applications.
- **Security and Fault Isolation:** Isolating hostnames improves security and ensures that failures in one container do not affect others.

**Use Case:**
- Containers and virtualized environments use UTS namespaces to set custom hostnames.
- Running multiple applications with different hostname configurations on the same machine.

In practice, you can assign unique hostnames to containers which ensures containers are treated as independent systems, even on the same host. It can be done using the `--hostname` flag in Docker:

```sh
docker run --rm -it --hostname container1 ubuntu bash
hostname
# Output: container1
```
---

## 4. User Namespace (user)
The **user namespace** enables privilege isolation by allowing processes to have different user and group IDs inside the namespace while being mapped to different or non-privileged users outside.

The **user namespace** provide isolation for *user IDs (UIDs)* and *group IDs (GIDs)*, allowing containers to have their own set of users and groups that are independent of the host system. This isolation enables processes inside containers to run with *non-privileged* user IDs, even if the host system assigns those users higher privileges.

In practical terms, user namespaces allow containers to run as root inside the container but with limited privileges on the host system. This improves security by reducing the risk of privilege escalation attacks.

To implement user namespaces, Docker uses the `--userns` flag, where containers can run with their own UID/GID mappings:

**Use Case:**
- Running unprivileged containers with root access inside the namespace while remaining a non-root user on the host.
- Secure privilege separation for different applications.

---

## 5. Mount Namespace (mnt)
The **mount namespace** isolates the mount points seen by processes in different namespaces. This means each namespace can have a different filesystem layout.

**Use Case:**
- Containers can have their own root filesystem separate from the host.
- Chroot-like environments but with better isolation.

---

## 6. Interprocess Communication Namespace (IPC)
The **IPC (Inter-Process Communication) namespace** allows isolation of System V IPC objects and POSIX message queues between different process groups.

**Use Case:**
- Prevents processes inside a container from accessing shared memory segments or message queues from the host.
- Ensures better isolation for applications requiring shared memory.

---

## 7. Cgroups
The **cgroup namespace** provides isolation of control groups (cgroups), ensuring that processes in one namespace cannot see or modify the resource limits of processes in another.

**Use Case:**
- Ensuring that resource limits (CPU, memory, I/O) applied to containers remain private.
- Enhancing security by restricting process visibility across different containers.

---

Using `unshare` to create namespaces:

To create a new lightweight container namespace and verify it:
```bash
# Forks a new process to avoid reusing the parent namespace.
# Starts a new shell 
unshare --pid --net --uts --user --map-root-user --mount --ipc --cgroup --fork bash

echo $$

ip a
ip link set lo up

hostname
hostname new-container

id 

mount
mount --bind /home /mnt

ipcs -m

cat /proc/self/cgroup
```
Inside the namespace, the shell process will have PID 1, as it is now the root of the process tree.


## Conclusion

Linux namespaces provide powerful mechanisms to isolate system resources, making them essential for containerization and security. By combining multiple namespaces, container runtimes like Docker, Podman, and Kubernetes achieve near-complete process isolation. Understanding namespaces is crucial for anyone working with Linux security, containerization, and system administration.

Do you use Linux namespaces in your workflow? Let me know in the comments!
