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
CMD ["./wait-for-it.sh", "db:3306", "--", "node", "script.js"]