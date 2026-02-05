# FinHealth — Gestão de Produção Médica

Sistema **Fullstack** projetado para o controle de **produção médica** e **repasses financeiros**.  
O ecossistema é composto por:

O ecossistema é composto por backend, frontend web e mobile, sendo que **toda a implementação do backend e do frontend foi desenvolvida por mim**, garantindo a **integração completa entre as camadas**, comunicação eficiente via API e consistência entre as regras de negócio e a interface do usuário.

- **API em Django**
- **Dashboard Web administrativo**
- **Aplicativo Mobile**

---

## Como Rodar o Ecossistema

### 1️-Backend & Banco de Dados (Docker)

O coração do sistema roda em containers, garantindo que tudo funcione de forma padronizada, independente da máquina.

#### Pré-requisitos

- **Docker**
- **Docker Compose**

#### Passos

Na raiz do projeto, execute:

```bash
docker-compose up --build
```

## Acessos

### API

- **URL:** http://localhost:8004/api

### Frontend Web

- **URL:** http://localhost:5173

---

## Credenciais Padrão

(criadas na primeira execução do container)

- **Usuário:** `admin`
- **Senha:** `admin123`

## Configuração do Mobile (Expo)

Para que o aplicativo mobile consiga se comunicar com o backend rodando na sua máquina, é necessário configurar o **IP da rede local**.

---

### 1️⃣ Configurar o IP do Servidor

Abra o arquivo:

```ts
mobile / services / api.ts;
```

Localize a constante IP e substitua pelo IPv4 da sua máquina:

```ts
// Exemplo
const IP = "192.168.1.25";
```

O IP deve ser o da mesma rede em que o celular ou emulador está conectado.

### Como Descobrir seu IP

Execute no terminal de acordo com o seu sistema operacional:

```ts
// windows
ipconfig;
```

```ts
// linux
hostname -I
# ou
ifconfig

```

### Instalar as dependencias e executar arquivo

Logo após as configurações acima, acesse a pasta do mobile:

```bash
cd mobile
npm install
# ou
yarn install
npx expo start
```

---

### Testar no Celular Real

**Importante:**  
O celular e o computador devem estar conectados ao **mesmo Wi-Fi**.

#### Android

- Instale o **Expo Go** na **Play Store**
- Abra o app e **escaneie o QR Code** exibido no terminal ou navegador

#### iOS (iPhone)

- Instale o **Expo Go** na **App Store**
- Abra a **Câmera**, aponte para o **QR Code** e toque no link exibido

## Funcionalidades Implementadas

**Web** & **Mobile**

### Dashboard Financeiro

- Total produzido
- Total repassado
- Saldo devedor

### Filtros Inteligentes

- Seleção de médicos e hospitais
- Modais e selects otimizados

### Gestão de Médicos

- Cadastro, edição e remoção (CRUD)

### Gestão de Hospitais

- Controle por unidade de saúde (CNES)

### Lançamento de Produção

- Histórico com data (DD/MM/AAAA)
- Conversão automática para o padrão do backend

### Controle de Repasses

- Registro de pagamentos
- Busca rápida
- Exclusão de registros

### Segurança

- Autenticação JWT
- SecureStore (Mobile)
- LocalStorage (Web)

---

## Stack Tecnológica

### Backend

- Python
- Django / Django Rest Framework
- PostgreSQL
- Docker

### Frontend Web

- React JS
- Vite
- Tailwind / StyleSheet
- Lucide Icons

### Mobile

- React Native
- Expo
- Expo Router
