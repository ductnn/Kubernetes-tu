---
title: Kubernetes 
---

## Overview

![](./img/k8s.png)

* **Kubernetes**(k8s): Là một nền tảng mã nguồn mở được dùng để  quản lý các container, automating deployment, scaling, quản lý các ứng dụng được đóng gói và services.
* Các tiện ích: 
    - Triển khai ứng dụng nhanh
    - Scale ứng dụng dễ  dàng
    - Tôi ưu hóa việc sử dụng tài nguyên

## Architecture

![architecture](./img/architecture.png)

### Master Node
* Máy chủ điều khiển các máy Worker chạy ứng dụng, bao gồm 4 thành phần chính

1. Etcd
* Cơ sở dữ liệu `key: value` của Kubernetes, tất cả thông tin cố  định của Kubernetes được lưu trữ cố  định vào đây.
* Nó chủ yếu được sử dụng để chia sẻ các cấu hình và **service discovery**

2. Kubernetes API Server
* Kết nối, giao tiếp giữa các thành phần
* Nơi tiếp nhận các lệnh REST được sử dụng để kiểm soát cluster

3. Controller Manager Service
* Quản lý và kiểm tra trạng thái các Worker, đảm nhận việc nhân bản ứng dụng

4. Scheduler Service
* Lập lịch triển khai cho các ứng dụng, ưng dụng được đặt vào Worker nào để chạy.

### Worker Node
* Máy chủ chạy ứng dụng trên đó.
* Là nơi mà các pod sẽ chạy. 
* Chứa tất cả các dịch vụ cần thiết để quản lý kết nối mạng giữa các container, giao tiếp với master node, và gán các tài nguyên cho các container theo kế hoạch.

1. Container runtimes
* Thành phần giúp ứng dụng chạy dưới dạng container (thông thường là docker)
* Container runtimes sử  dụng phổ  biến với Kubernetes
  - [**containerd**](#containerd)
  - [**CRI-O**](#CRI-O)
  - [**Docker**](#Docker)

<a name="containerd"></a>
### **Containerd**
* A container runtime with an emphasis on simplicity, robustness and portability
* **containerd** quan tâm đến việc lấy và lưu trữ các images, thực thi container, cung cấp quyền truy cập mạng.

<a name="CRI-O"></a>
### **CRI-O**
* **Container Runtime Interface**(CRI): API phục vụ cho việc tích hợp container runtimes với kubelet trên 1 node 
* **CRI-O** tool dùng để  sử dụng các *OCI container runtime* với Kubernetes CRI 
* **CRI-O** là 1 thực thi của Container Runtime Interface để  cho phép các container runtime tương thích với  **Open Container Initiative (OCI) runtime spec**.

<a name="Docker"></a>
### **Docker**

### Container network runtime
* [**Network Plugins**](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
* [**CNI - the Container Network Interface**](https://github.com/containernetworking/cni)

2. Kubelet
* Thành phần giao tiếp với **Kubernetes API Server**, và đảm bảo các containers up và running.
* Chịu trách nhiệm liên lạc với **Master Node**.
* Nó cũng liên lạc với etcd, để có được thông tin về dịch vụ và viết chi tiết về những cái mới được tạo ra.

3. Kubernetes Service Proxy
* Kube-proxy hoạt động như một proxy mạng và cân bằng tải cho một dịch vụ trên một work node.
* Nó liên quan đến việc định tuyến mạng cho các gói TCP và UDP.
* **kube-proxy** quản lý việc chuyển tiếp lưu lượng truy cập được gửi đến các địa chỉ IP ảo (VIPs) của **Service** trong cụm, kube-proxy hỗ trợ 3 modes
  - [**User space**](#user-space)
  - [**iptables**](#iptables)
  - [**IPVS(IP Virtual Server)**](#IPVS)

<a name="user-space"></a>
### **User space**

![User space](./img/services-userspace-overview.svg)

- `kube-proxy` sẽ kiểm tra *Kubernetes master* để  thêm và xóa các đối tượng **Service** và **Endpoint**, đối với mỗi dịch vụ, nó sẽ mở ngẫu nhiên 1 port trên node local. Bất kỳ kết nối nào đến "proxy port" đều được ủy quyền cho 1 trong các Pods. *kube-proxy* sẽ cài đặt `SessionAffinity` khi quyết định chọn pod. **User-space** proxy cài đặt các iptables rules để  xác định lưu lượng truy cập vào `clusterIP` và `port` của Services.

<a name="iptables"></a>
### **IPtables**

![iptables](./img/services-iptables-overview.svg)

- `kube-proxy` sẽ kiểm tra *Kubernetes control plane* để  thêm và xóa các đối tượng **Service** và **Endpoint**. Đối với mỗi **Service**, nó cài đặt các iptables rules, các rules này nắm bắt lưu lượng truy cập vào `clusterIP` và `port` của **Service**, đồng thời chuyển hướng lưu lượng đó đến một trong các pods của **Service**. Với mỗi đối **Endpoint**, nó cài đặt các iptables rules để chọn một Pod phụ trợ.
- Tại mode này, `kube-proxy` sẽ chọn ngẫu nhiên 1 pod
- Sử  dụng `iptables` sẽ cho chi phí thấp hơn và đáng tin cậy hơn do lưu lượng sẽ được xử  lý bởi **Linux Netfilter** mà không cần chuyển đổi giữa **user space** và **kernel space** 
 
<a name="IPVS"></a>
### **IPVS(IP Virtual Server)**

![IPVS](./img/services-ipvs-overview.svg)

- `kube-proxy` kiểm tra **Service** và **Endpoint** của Kubernetes, giao diện **netlink** tạo các rules IPVS phù hợp và đồng bộ hóa các rules IPVS với **Service** và **Endpoint** Kubernetes theo định kỳ. Vòng điều khiển này đảm bảo rằng trạng thái IPVS phù hợp với trạng thái mong muốn. Khi truy cập Service, IPVS hướng lưu lượng truy cập đến một trong các pods.
- Mode proxy IPVS dựa trên chức năng **netfilter** tương tự như chế độ iptables, nhưng sử dụng bảng băm làm cấu trúc dữ liệu cơ bản và hoạt động trong **Kernel space**, kube-proxy ở mode IPVS chuyển hướng lưu lượng truy cập với độ trễ thấp hơn kube-proxy ở mode `iptables`, với hiệu suất tốt hơn nhiều khi đồng bộ hóa các rules proxy. So với modes proxy khác, IPVS cũng hỗ  trợ lưu lượng mạng cao hơn.

* [Work](https://www.stackrox.com/post/2020/01/kubernetes-networking-demystified/)
* [IPtables](https://blogd.net/linux/iptables-chuyen-sau/)

4. Kubectl
* Giao diện dòng lệnh để giao tiếp với API service.
* Gửi lệnh đến **Master Node**.
  
## Ingress

![](./img/ingress.png)

* **Ingress** là thành phần được dùng để  điều hướng các yêu cầu **traffic** giao thức HTTP và HTTPS từ bên ngoài (interneet) vào các dịch vụ bên trong Cluster.
* **Ingress** chỉ để phục vụ các cổng, yêu cầu HTTP, HTTPS còn các loại cổng khác, giao thức khác để truy cập được từ bên ngoài thì dùng **Service** với kiểu `NodePort` và `LoadBalancer`
* **Ingress Controller**: Ứng dụng chạy trong 1 cluster và sử  dụng cấu hình `LoadBalancer` HTTP theo tài nguyên trong Ingress 
* [Deploy HAProxy Ingress Controller](./app/HAProxy_Ingress.md)
* [Deploy NGINX Ingress Controller](./app/nginx_Ingress.md)

## Node Server
1. Pod
* **Pod**: Là 1 nhóm (từ 1 trở lên) các container cùng chia sẻ tài nguyên mạng, lưu trữ. Pod được tạo ra hoặc xóa tùy thuộc vào yêu cầu. 
* Pods in a Kubernetes cluster are used in two main ways:
    - **Pods that run a single container**: Mô hình **one-container-per-pod**, 1 container tương ứng với 1 pod, Kubernetes quản lý pod thay vì quản lý container
    - **Pods that run mutiple containers that need to work together**: Một Pod có thể  đóng gói một ứng dụng bao gồm nhiều container được liên kết chặt chẽ và cần phải chia sẻ tài nguyên với nhau giữa các container.
* Pod cung cấp 2 loại tài nguyên chia sẻ cho các container:
    - **Networking**: Mỗi pod sẽ được gán 1 địa chỉ IP. Tất cả các container trong pod cùng chia sẻ network namespaces bao gồm địa chỉ IP và port. Các container trong cùng pod có thể  giao tiếp với nhau và giao tiếp với các container ở pod khác.
    - **Storage**: Mỗi pod có thể  chỉ định một **shared storage volumes**. Tất cả các container trong pod có thể  truy cập vào các **volumes** này.

2. Replication Controllers
* Là thành phần quản trị bản sao của Pod, giúp nhân bản hoặc giảm số lượng Pod.

3. Service

![svc](./img/svc.png)

* Vì pod có tuổi thọ ngắn, do vậy sẽ không đảm bảo về  địa chỉ IP cố  định
* **Service**(svc): Là một lớp nằm trên một nhóm pod, được gán 1 IP tĩnh và có thể  trỏ vào domain của dịch vụ này.
* Mỗi service sẽ được gán 1 domain do người dùng lựa chọn, khi ứng dụng cần kết nối đến service, ta chỉ cần dùng domain là xong. Domain được quản lý bởi hệ thống name server SkyDNS nội bộ của k8s - một thành phần sẽ được cài khi ta cài k8s

### Cluster IP
* **Cluster IP**: Service mặc định của kubernetes. Các pod trong từng cụm có thể  truy cập vào, không được quyền truy cập bên ngoài. 
* Tạo service cluster IP 
```yaml
apiVersion: v1
kind: Service
metadata:
  name: svc1
spec:
  type: ClusterIP
  ports:
  - name: port1
    port: 80
    targetPort: 80
```
* Triển khai `kubectl apply -f svc1.yaml`
* Lấy các service `kubectl get svc -o wide`
```sh
➜  app git:(webserver-test) ✗ kubectl get svc -o wide
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE     SELECTOR
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP   3h29m   <none>
svc1         ClusterIP   10.96.129.109   <none>        80/TCP    167m    <none>
```
* Check thông tin service svc1 `kubectl describe svc/svc1`
```bash
➜  app git:(webserver-test) ✗ kubectl describe svc/svc1
Name:              svc1
Namespace:         default
Labels:            <none>
Annotations:       <none>
Selector:          <none>
Type:              ClusterIP
IP:                10.96.129.109
Port:              port1  80/TCP
TargetPort:        80/TCP
Endpoints:         <none>
Session Affinity:  None
Events:            <none>
```

### NodePort

![](./img/nodeport.png)

* **NodePort**: Tạo ra các truy cập từ ngoài bằng IP của các node
* **NodePort**: Tạo ra truy cập từ IP của node với `port` ngẫu nhiên trong khoảng `30000–32767`, để  ấn định port thì sử dụng tham số  `nodeport`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: svc2
spec:
  selector:
     app: app1
  type: NodePort
  ports:
  - name: port1
    port: 80
    targetPort: 80
    nodePort: 31080
```
* Check thông tin service svc1 `kubectl describe svc/svc2`
```sh
➜  app git:(webserver-test) ✗ kubectl describe svc/svc2
Name:                     svc2
Namespace:                default
Labels:                   <none>
Annotations:              <none>
Selector:                 app=app1
Type:                     NodePort
IP:                       10.103.101.219
Port:                     port1  80/TCP
TargetPort:               80/TCP
NodePort:                 port1  31080/TCP
Endpoints:                <none>
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

4. Volumes

![volumes](./img/volume.png)

* Volumes thể hiện vị trí nơi mà các container có thể truy cập và lưu trữ thông tin.
* Volumes có thể là local filesystem, local storage, Ceph, Gluster, Elastic Block Storage,...
* **Persistent Volumes**(PV): Là khái niệm để  đưa ra một dung lượng lưu trữ **THỰC TẾ  1G, 10G,...** 
* **Persistent volume claim**(PVC): Là khái niệm ảo, đưa ra một dung lượng **CẦN THIẾT**, mà ứng dụng yêu cầu.

5. Namespaces

![namespaces](./img/namespaces.png)

* Kubernetes hỗ  trợ nhiều cụm ảo trên cùng 1 cụm vật lý, các cụm ảo này là **namespaces**
* Đây là một công cụ dùng để nhóm hoặc tách các nhóm đối tượng. 
* Namespaces được sử dụng để kiểm soát truy cập, kiểm soát truy cập network, quản lý resource và quoting

6. ConfigMaps and Secrets
* **ConfigMaps** là giải pháp để  đưa 1 file config / đặt các ENV hay set các argument khi gọi câu lệnh. ConfigMap là một cục config, mà pod nào cần, thì chỉ định là nó cần - giúp dễ dàng chia sẻ file cấu hình.
* **Secrets** dùng để lưu trữ các password, token,... Nó nằm bên trong container.

7. Labels 
* **Labels**: Là các cặp `key: value` được gán vào các đối tượng. VD: pods, replication controllers, ...
```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

### Slide
* [Kubernetes](https://docs.google.com/presentation/d/1tSl0gA71_AkeThP9193PUBxn3kA2KRtqqRBFHwe2FA4/edit#slide=id.ga6a1abf4ee_0_55)

### Reference 
* [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/)
* [Kunernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
* [Kubernetes Glossary](https://kubernetes.io/vi/docs/reference/glossary/?fundamental=true)
* [Kubernetes NodePort vs LoadBalancer vs Ingress](https://medium.com/google-cloud/kubernetes-nodeport-vs-loadbalancer-vs-ingress-when-should-i-use-what-922f010849e0)

### [me](https://github.com/ductnn)