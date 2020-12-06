---
title: Trả lời câu hỏi seminar
---

1. Container Orchestration
* Container Orchestration là các công cụ, dịch vụ dùng để  quản lý và điều phối nhiều container 
* Một số  loại Container Orchestration: Kubernetes, Docker Swarm, Google container Engine

2. Self-healing
* **Self-healing**: Khởi động lại các container bị dừng, thay thế và sắp xếp lại các container khi các node die, xóa bỏ container bị hỏng.

3. Control Plane là gì ? Control plane bao gồm những thành phần nào ? Ngoài control plane thì còn plane khác không ?
* Cụm Kubernetes được chia ra thành các thành phần 
    - Master (Control Plane)
    - Node (Worker)
* **Control Plane**: Có 4 thành phần 
    - API Server
    - Controller Manager
    - Scheduler
    - etcd

4. Desired state
* **Desired state** của mỗi cụm Kubernetes xác định các ứng dụng hoặc các workloads đang chạy
* **Desired state** được xác định theo các file manifest.
* **Desired State** is the state that you want the system to be in
* **Actual State** is the state that the system is actually in

5. PodSpecs
* **kubelet** hoạt động theo các **PodSpecs**. 
* **PodSpecs** là file `yml` hoặc `json` để  mô tả Pod

6. Selector
* **Labels**: Là các cặp `key: value` được gán vào các đối tượng. VD: pods, replication controllers, ...
```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```
* **Selector**: Là cặp `key: value` dùng để  chọn 1 `label` nhất định hoặc 1 tập các label
```yml
metadata: 
  name: varnish-deploy
spec:
  replicas: 1
  selector:
    matchLabels: 
      app: varnish-deploy
```
* Kubernetes API hỗ  trợ 2 loại `selector`
    - **Equality-based**: Filter theo `keys` và `values`
    - **Set-based**: Filter `keys` theo `values`

7. User-space, IPVS
### User-space

![User space](../k8s/img/services-userspace-overview.svg)

- `kube-proxy` sẽ kiểm tra *Kubernetes master* để  thêm và xóa các đối tượng **Service** và **Endpoint**, đối với mỗi dịch vụ, nó sẽ mở ngẫu nhiên 1 port trên node local. Bất kỳ kết nối nào đến "proxy port" đều được ủy quyền cho 1 trong các Pods. *kube-proxy* sẽ cài đặt `SessionAffinity` khi quyết định chọn pod. **User-space** proxy cài đặt các iptables rules để  xác định lưu lượng truy cập vào `clusterIP` và `port` của Services.

### IPVS (IP Virtual Server)

![IPVS](../k8s//img/services-ipvs-overview.svg)

- `kube-proxy` kiểm tra **Service** và **Endpoint** của Kubernetes, giao diện **netlink** tạo các rules IPVS phù hợp và đồng bộ hóa các rules IPVS với **Service** và **Endpoint** Kubernetes theo định kỳ. Vòng điều khiển này đảm bảo rằng trạng thái IPVS phù hợp với trạng thái mong muốn. Khi truy cập Service, IPVS hướng lưu lượng truy cập đến một trong các pods.
- Mode proxy IPVS dựa trên chức năng **netfilter** tương tự như chế độ iptables, nhưng sử dụng bảng băm làm cấu trúc dữ liệu cơ bản và hoạt động trong **Kernel space**, kube-proxy ở mode IPVS chuyển hướng lưu lượng truy cập với độ trễ thấp hơn kube-proxy ở mode `iptables`, với hiệu suất tốt hơn nhiều khi đồng bộ hóa các rules proxy. So với modes proxy khác, IPVS cũng hỗ  trợ lưu lượng mạng cao hơn.

8. Docker có phải là container runtime không ?
* **Container runtime**: Thành phần chạy và quản lý container 
* Docker là container runtime 

9. Docker vs containerd

![](../k8s/img/docker-containerd.png)

10. Những dữ liệu lưu trong etcd là dữ liệu gì ? Tại sao phải dùng etcd ?
* Etcd là hệ thống cơ sở dữ liệu phân tán, nó lưu trữ `configuration data`, `state`
* Data được đọc từ command `kubectl` đều được lấy ra từ `etcd`
* Những thay đổi khi sau khi dùng command `kubectl apply` sẽ được tạo hoặc update vào etcd
```bash
➜  kubernetes git:(master) ✗ kubectl -n kube-system get pod
NAME                               READY   STATUS    RESTARTS   AGE
coredns-f9fd979d6-qbvpp            1/1     Running   0          69m
etcd-minikube                      1/1     Running   0          69m
kube-apiserver-minikube            1/1     Running   0          69m
kube-controller-manager-minikube   1/1     Running   0          69m
kube-proxy-vg95m                   1/1     Running   0          69m
kube-scheduler-minikube            1/1     Running   0          69m
storage-provisioner                1/1     Running   1          69m
```
* Etcd cũng lưu trữ 2 trạng thái của hệ thống `actual` và `desired`



### Reference
* [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/)
* [Kunernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
* [Kubernetes Glossary](https://kubernetes.io/vi/docs/reference/glossary/?fundamental=true)
* [Docker vs Containerd](https://computingforgeeks.com/docker-vs-cri-o-vs-containerd/)
