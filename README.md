Olá, repositório criado por mim para contemplar práticas de git, github e docker, aulas ministradas pelo professor **Juliano Marcelino**.

Ambiente: Windows, utilizando docker4.33.1, VSCode

Esse exercício é um complemento de uma atividade da disciplina de Embarcados do curso de Analise e Desenvolvimento de Sistemas da faculdade **SENAC de Jaraguá do Sul.**

<details><summary><h2>Subir um container Docker com serviço Node.js e MySQL</h2></summary>

Para subir o container Docker com um serviço web Node.js e MySQL, vamos usar o `docker-compose`. Vamos utilizar um exemplo básico de configuração do *docker-compose.yml* e *Dockerfile.dockerfile* já configurado para essa situação.

1) Baixe e descompacte o repositório, a estrutura de pastas e arquivos deve ficar assim:

![Estrutura de pastas e arquivos](https://i.imgur.com/L4sQGzz.jpeg)

2) No Visual Code abra a pasta descompactada, se não for renomeada estará com o nome **embed242a1-master**
![Estrutura de pastas e arquivos no VS](https://i.imgur.com/lj6CyxL.jpeg)

3) Para subir o container docker, certifique de que possui instalado o **Docker** em seu computador, a versão que estou utilizando é a **V 4.33**. Com o docker instalado e o compose habilitado, execute o comando:
```sh
docker-compose up --build
```
![enter image description here](https://i.imgur.com/5MiR6LQ.jpeg)Aguarde finalizar o processo de ***Build***, onde serão aplicadas todas as configurações inseridas nos arquivos do docker *Dockerfile.dockerfile* e *compose docker-compose.yml*

4) Após a finalização do processo de ***Build*** do nosso container, até aqui tudo ocorrendo bem já podemos rodar nossa aplicação web com **Node.js** rodando no link padrão local abaixo:

Copie e cole no em um navegador.

```sh
http://localhost:8008
```

5) Se aparecer a tela de ***LOGIN***, podemos validar a conexão com o banco de dados.
```sh
usuário: admin
senha: 1234
```

Caso não digitar  as credenciais válidas o navegador deverá mostrar **"Credenciais Inválidas"**, caso contrário parabéns você conseguiu acesso e a validação via banco de dados foi um sucesso!!!
</details>

<details><summary><h2>Configurações Dockerfile e Compose</h2></summary>

<details><summary><h3>Dockerfile.dockerfile</h3></summary>

```sh
# Usar uma imagem Node.js como base
FROM node:18
# Criar e definir o diretório de trabalho
WORKDIR /embed242a1

# Copiar os arquivos package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install
# Copiar o restante dos arquivos do projeto
COPY . .

# Baixar o script wait-for-it
RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && chmod +x wait-for-it.sh

# Expor a porta da aplicação
EXPOSE 8008

# Comando para iniciar a aplicação, aguardando o MySQL estar pronto
CMD ["./wait-for-it.sh", "db:3306", "--timeout=60", "--", "node", "script.js"]
```
</details>

<details><summary><h3>docker-compose.yml</h3></summary>

```sh
version: '3.8'  # Define a versão do Compose a ser usada.

services:
  web:
    build: 
      context: ./web  # Define o diretório de contexto de onde o Dockerfile será construído.
      dockerfile: Dockerfile.dockerfile  # Especifica o nome do Dockerfile que será usado.
    ports:
      - "8008:8008"  # Mapeia a porta 8008 do contêiner para a porta 8008 do host.
    environment:
      - DATABASE_HOST=db  # Define a variável de ambiente para o host do banco de dados.
      - DATABASE_USER=root  # Define a variável de ambiente para o usuário do banco de dados.
      - DATABASE_PASSWORD=root99  # Define a variável de ambiente para a senha do banco de dados.
      - DATABASE_NAME=apapp  # Define a variável de ambiente para o nome do banco de dados.
    depends_on:
      - db  # Define que o serviço 'web' depende do serviço 'db' e só será iniciado após o 'db'.
    networks:
      - embed242a1  # Define a rede em que o serviço 'web' será conectado.

  db:
    image: mysql:8.1  # Especifica a imagem do MySQL a ser usada, versão 8.1.
    environment:
      MYSQL_ROOT_PASSWORD: root99  # Define a senha root do MySQL.
      MYSQL_DATABASE: apapp  # Cria automaticamente um banco de dados chamado 'apapp' ao iniciar.
    ports:
      - "3307:3306"  # Mapeia a porta 3306 do contêiner (porta padrão do MySQL) para a porta 3307 no host.
    volumes:
      - ./db/apapp_dump.sql:/docker-entrypoint-initdb.d/apapp_dump.sql  # Mapeia um arquivo SQL do host para ser executado durante a inicialização do banco de dados.
    networks:
      - embed242a1  # Define a rede em que o serviço 'db' será conectado.

networks:
  embed242a1:
    driver: bridge  # Define o driver de rede como 'bridge', criando uma rede interna isolada para os serviços.

```
</details>
