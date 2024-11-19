# Build app

```
cd app
npx webpack --config webpack.config.js
```

# Docker build

```
cd /FE
docker build -t fe-app-node:1.0 .  
```

# Running
## Docker run

```
cd /FE
docker run -p 80:9000 fe-app-node:1.0 .  
```

## minikube

```
kubectl apply -f deployment.yaml
```

check
```
kubectl get services
```