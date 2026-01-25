---
layout: post
title: "WekaFS : An Innvotive File System"
date: 2025-04-19
categories: HPC Storage
---

* TOC
{:toc}

### **What is WekaFS?**

WekaFS is a **software-defined**, **parallel file system** built for **NVMe-based storage** and designed to deliver **low latency** and **high throughput** at scale. It’s particularly optimized for **modern compute workloads** like AI, genomics, finance, and cloud-native HPC.

---

### **Core Architecture Highlights**

|Feature|Description|
|---|---|
|**Fully POSIX-compliant**|Seamlessly supports traditional workloads alongside modern ones.|
|**All-flash optimized**|Designed for NVMe SSDs; low latency and ultra-fast IOPS.|
|**Shared-nothing architecture**|Each node handles its own metadata and data.|
|**Hybrid deployment**|Can run on-prem, in the cloud (AWS, Azure, GCP), or across both.|
|**Single namespace**|One global file system, regardless of scale or tiering.|

---

### **Key Components**

- **Front-end clients**: Apps interact with Weka via a POSIX interface (or SMB/NFS/Object).
- **WekaFS cluster**: Made up of compute/storage nodes. Each node can handle metadata, data, or both.
- **Weka Agents**: Software that runs on each participating node.
- **Tiering**: Supports hot/cold storage (e.g., NVMe tier + S3 backend).

---

### **Data Flow (Simplified)**

1. A client (e.g., ML app, simulation software) requests a file.
2. The request goes to the metadata engine — handled by any node in the cluster.
3. The data is retrieved in parallel from multiple nodes for high throughput.
4. Metadata and data operations are **distributed and parallel**, allowing massive IOPS and bandwidth.

---

### **Why Choose WekaFS over Lustre/GPFS/etc.?**

| Feature               | WekaFS Advantage                                                  |
| --------------------- | ----------------------------------------------------------------- |
| **Cloud-native**      | Fully supports public cloud deployments.                          |
| **NVMe-first design** | Built from scratch for flash, not retrofitted like older systems. |
| **Zero tuning**       | Minimal tuning required, works out-of-the-box.                    |
| **Multi-protocol**    | File, object, and block interfaces available.                     |
| **GUI & API**         | Rich web UI and RESTful API for orchestration and monitoring.     |

---

### Use Cases

- AI/ML training (TensorFlow, PyTorch, etc.)
- Genomic sequencing
- Financial simulations
- Real-time analytics
- Containerized workloads (via CSI driver for Kubernetes)

---

### CLI Basics (via Weka CLI or REST API)
```
# List filesystems 
weka fs list 

# Create a new file system 
weka fs create myfs 

# Monitor performance
weka stats top  

# Add new nodes to the cluster 
weka cluster add-node --ip <IP>  

# Create object store tiering 
weka tier create s3 --bucket <bucket-name> ...

```

---

## WekaFS + Slurm Integration Overview

**Goal: ** Enable Slurm jobs to **read/write data efficiently** to a WekaFS-mounted filesystem during job execution.

---

#### **Basic Setup**

#### **Mount WekaFS on all compute nodes:**

Usually mounted via the **Weka client**, which supports POSIX. This can be done:

- As part of the system image.
- Or dynamically as part of the Slurm `Prolog`.

`# Example mount command (on compute node)`
`mount -t wekafs <cluster-name>/<fs-name> /mnt/weka`

You can automate this via a Slurm **Prolog** script so every compute node has access before the job runs:
```
#!/bin/bash 
mountpoint -q /mnt/weka || mount -t wekafs mycluster/myfs /mnt/weka`
```

---

#### **WekaFS Client Requirements**

- Kernel module or FUSE client depending on environment
- Ensure same version of Weka client across all compute nodes
- Network access to Weka cluster (preferably RDMA-capable    

---

#### **WekaFS as Job Scratch or Data Dir**

In the Slurm job script:

```
#!/bin/bash 
#SBATCH --job-name=my_job 
#SBATCH --output=result.log 
#SBATCH --ntasks=16  
export DATA_DIR=/mnt/weka/myproject 
srun ./my_binary -i $DATA_DIR/input -o $DATA_DIR/output`
```
- You can use WekaFS for both **input staging** and **scratch space**.
- It supports high concurrency, so many jobs can hit it in parallel.

---

#### Pro Tips

|Tip|Reason|
|---|---|
|Use environment variables for Weka mount paths|Makes it easier to change targets dynamically|
|Use `Lustre-like` job script structures if porting workloads|WekaFS behaves similarly under POSIX|
|Benchmark before production|Use tools like `fio`, `mdtest`, or `ior`|
|Consider using **job Prolog/Epilog** to mount/unmount WekaFS|For temporary mounts only|

---

#### Example Prolog Integration in `slurm.conf`

```
Prolog=/etc/slurm/weka_prolog.sh 
Epilog=/etc/slurm/weka_epilog.sh`
```

Script in `/etc/slurm/weka_prolog.sh`:

```
#!/bin/bash 
mountpoint -q /mnt/weka || mount -t wekafs mycluster/myfs /mnt/weka
```

---

#### Weka during Jobs

Use the Weka CLI: `weka stats top --type fs`

Or REST API/Prometheus if integrated.

---

#### Security Considerations

- Enforce user access policies via Weka’s RBAC and export rules.
- Can integrate with LDAP for auth.

---

#### **Job Staging with WekaFS in Slurm**

There are two common approaches that lets the user do, if WekaFS is already mounted using **autofs**

#####  _Pre-Staging Data_:

Use Slurm **Prolog** scripts to stage data from S3 or another Weka tier before the job begins.
```
#!/bin/bash 

# weka_prolog.sh 
# Pull from Weka object tier if tiering is enabled 

weka fs recall myfs /project/$SLURM_JOB_ID
```

#####  _Post-Staging Results_:

Use **Epilog** scripts to move data to an object tier or delete temp data.
```
#!/bin/bash 

# weka_epilog.sh  
# Push to object tier or delete temp job dir

weka fs evict myfs /project/$SLURM_JOB_ID
```

> This workflow is ideal when you're using WekaFS with an S3-compatible backend (for cost-effective cold storage).

---

#### Performance Tuning Tips for WekaFS Jobs in Slurm

|Area|Tip|
|---|---|
|**I/O Concurrency**|Use multiple threads/processes to saturate Weka’s parallel IO|
|**Data Layout**|Use subdirectories to avoid metadata contention|
|**Large Files**|Prefer large sequential writes for best performance|
|**Cache**|Use Weka’s SSD cache tier smartly — avoid unstructured I/O bursts|
|**Network**|Prefer RDMA (InfiniBand, RoCE) to get full bandwidth and low latency|

**Inside Slurm job script**:

```
export WEKA_THREADS=8 
srun -n 8 ./simulation -i $DATA_DIR/input -o $DATA_DIR/output
```

---
#### WekaFS Tiering Example (with Object Store)

If Weka is tiered to S3 (or on-prem MinIO/Ceph):

```
# Setup tier weka tier 
create mytier s3 --bucket my-bucket --region us-east-1 

# Attach tier to file system 
weka fs tier attach myfs mytier --primary --default 

# Set policy to auto-move cold data 
weka fs tier policy set myfs --default-move-age 6h
```

Your Slurm jobs can now access both SSD and S3-tiered data transparently. Hot data stays on SSD, and Weka handles recall automatically.

---

#### Security + Multi-Tenancy with Slurm

Weka supports:

- **RBAC (role-based access control)**
- **Quota management**
- **Export rules** to restrict clients based on IP/user

If your Slurm cluster supports multiple groups, you can isolate data like:
`/mnt/weka/group1 /mnt/weka/group2`

Each user or Slurm partition can be restricted using Weka export rules.

---

#### Monitoring & Observability

Weka provides:

- **CLI**: `weka stats top`, `weka alerts list`, etc.
- **Grafana integration**: Weka exposes metrics via Prometheus
- **Slurm JobStats**: Use Slurm’s `acct_gather_profile` to correlate IO with jobs

---


