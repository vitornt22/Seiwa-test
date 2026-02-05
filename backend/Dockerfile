# backend/Dockerfile
FROM python:3.10
# Evita buffers de output
ENV PYTHONUNBUFFERED=1

# Cria pasta do projeto
WORKDIR /app

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
	build-essential \
	libpq-dev \
	&& rm -rf /var/lib/apt/lists/*

# Copia arquivos de requisitos e instala pacotes
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copia o código
COPY . .

# Comando padrão (rodar o servidor de desenvolvimento)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8004"]
