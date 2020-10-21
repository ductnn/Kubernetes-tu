---
title: Kubernetes 
---

## Minikube

*  Một công cụ chạy một Kubernetes cluster chỉ gồm một node trong một máy ảo (VM) trên Local

### Setup

1. Kiểm tra tính năng VT-x/AMD-v virtualization
```sh
grep -E --color 'vmx|svm' /proc/cpuinfo
```

2. Install `kubectl`
* Download
```sh
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
```

* Make & move the kubectl binary executable
```sh
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```

* Test 
```sh
kubectl version --client
```

Result:

> `Client Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.3", GitCommit:"1e11e4a2108024935ecfcb2912226cedeafd99df", GitTreeState:"clean", BuildDate:"2020-10-14T12:50:19Z", GoVersion:"go1.15.2", Compiler:"gc", Platform:"linux/amd64"}`

3. Install minikube 
```sh
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
  && sudo mv minikube /usr/local/bin/
```

### Deploy

* Start local Kubernetes cluster
```sh
➜  ~ git:(master) ✗ minikube start
😄  minikube v1.14.0 on Ubuntu 18.04
✨  Automatically selected the docker driver
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
🔥  Creating docker container (CPUs=2, Memory=2200MB) ...

🧯  Docker is nearly out of disk space, which may cause deployments to fail! (95% of capacity)
💡  Suggestion: 

    Try at least one of the following to free up space on the device:
    
    1. Run "docker system prune" to remove unused docker data
    2. Increase the amount of memory allocated to Docker for Desktop via
    Docker icon > Preferences > Resources > Disk Image Size
    3. Run "minikube ssh -- docker system prune" if using the docker container runtime
🍿  Related issue: https://github.com/kubernetes/minikube/issues/9024

🐳  Preparing Kubernetes v1.19.2 on Docker 19.03.8 ...
    > kubectl.sha256: 65 B / 65 B [--------------------------] 100.00% ? p/s 0s
    > kubelet.sha256: 65 B / 65 B [--------------------------] 100.00% ? p/s 0s
    > kubeadm.sha256: 65 B / 65 B [--------------------------] 100.00% ? p/s 0s
    > kubectl: 41.01 MiB / 41.01 MiB [---------------] 100.00% 2.27 MiB p/s 19s
    > kubeadm: 37.30 MiB / 37.30 MiB [---------------] 100.00% 1.50 MiB p/s 25s
    > kubelet: 104.88 MiB / 104.88 MiB [-------------] 100.00% 2.58 MiB p/s 41s
🔎  Verifying Kubernetes components...
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" by default
```

* Kiểm tra các **Node** trong cluster
```sh
➜  ~ git:(master) ✗ kubectl get nodes
NAME       STATUS   ROLES    AGE   VERSION
minikube   Ready    master   56s   v1.19.2
``` 

* Kiểm tra **pods** đang chạy 
```sh
➜  ~ git:(master) ✗ kubectl get pods --all-namespaces
NAMESPACE     NAME                               READY   STATUS    RESTARTS   AGE
kube-system   coredns-f9fd979d6-hpd9z            1/1     Running   0          60s
kube-system   etcd-minikube                      0/1     Running   0          59s
kube-system   kube-apiserver-minikube            1/1     Running   0          59s
kube-system   kube-controller-manager-minikube   0/1     Running   0          59s
kube-system   kube-proxy-wthvf                   1/1     Running   0          60s
kube-system   kube-scheduler-minikube            0/1     Running   0          59s
kube-system   storage-provisioner                1/1     Running   1          64s
```

* Kiểm tra **service** đang chạy
```sh
➜  ~ git:(master) ✗ kubectl get svc --all-namespaces
NAMESPACE     NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE
default       kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP                  82s
kube-system   kube-dns     ClusterIP   10.96.0.10   <none>        53/UDP,53/TCP,9153/TCP   80s
``` 

### [me](https://github.com/ductnn)