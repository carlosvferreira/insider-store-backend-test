# API de produtos e carrinho - Teste para Backend na Insider Store

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/carlosvferreira/insider-store-backend-test
```

Entre no diretório do projeto

```bash
  cd insider-store-backend-test
```

Instale as dependências

```bash
  npm install
```

Baixe e instale o Docker Desktop

https://www.docker.com/products/docker-desktop/

Inicialize um Container com o MondoDB localmente

```bash
docker run --name insider-store-backend-test -d -p 27017:27017 mongo:latest
```

Inicie o servidor

```bash
  npm run start
```

## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test
```

## Stack utilizada

**Back-end:** Node, Express, Jest

**Banco de dados:** MongoDB
