pkill -f tunnel
minikube stop
minikube start --memory=11838mb --cpus=4

minikube addons enable metrics-server
kubectl get deployment metrics-server -n kube-system

minikube addons enable istio-provisioner
minikube addons enable istio
istioctl install --set profile=demo -y
istioctl manifest apply --set values.pilot.env.PILOT_HTTP10=1 -y
kubectl label namespace default istio-injection=enabled

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.22/samples/addons/prometheus.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.22/samples/addons/kiali.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.22/samples/addons/grafana.yaml
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.22/samples/addons/jaeger.yaml


istioctl install --set profile=demo -y
openssl genpkey -algorithm RSA -out cert/private.key
openssl req -new -key cert/private.key -out cert/certificate.csr -subj "/CN=localhost"
openssl x509 -req -days 365 -in cert/certificate.csr -signkey cert/private.key -out cert/certificate.crt
kubectl create -n istio-system secret tls fe-app-node-tls --cert=cert/certificate.crt --key=cert/private.key
kubectl get secrets -n istio-system
kubectl rollout restart deployment istiod -n istio-system
kubectl rollout restart deployment istio-ingressgateway -n istio-system

eval $(minikube -p minikube docker-env)

cd BE/auth/
docker build -t django-auth:1.0 .
kubectl create secret generic auth-secrets --from-env-file=.env
kubectl create secret generic auth-secrets --from-env-file=.env --dry-run=client -o yaml | kubectl apply -f -
kubectl get pvc
kubectl get pv
kubectl delete pv postgres-pvc
kubectl apply -f postgres-deployment.yaml
kubectl apply -f django-deployment.yaml
cd ../../

cd FE
kubectl create secret generic fe-app-node-secrets --from-env-file=.env
kubectl create secret generic fe-app-node-secrets --from-env-file=.env --dry-run=client -o yaml | kubectl apply -f -
docker build -t fe-app-node:1.0 .
kubectl apply -f deployment.yaml
cd ../

kubectl delete pods -l app=fe-app-node
kubectl delete pods -l app=django-auth

kubectl delete pods -l app=fe-app-node
kubectl delete pods -l app=django-auth

kubectl get pods -A

minikube tunnel --bind-address='127.0.0.1'
