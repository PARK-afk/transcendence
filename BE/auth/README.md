# Docker build

```
docker build -t django-auth:1.0 .
```

# Docker run
```
docker-compose up build
```

# kube

```
kubectl create secret generic auth-secrets --from-env-file=.env
kubectl create secret generic auth-secrets --from-env-file=.env --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -f postgres-deployment.yaml
kubectl apply -f django-deployment.yaml
```

Testing
```
kubectl port-forward service/django-auth 8000:8000
```