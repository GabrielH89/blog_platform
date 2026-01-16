# Blog_platform

## Blog 
![GitHub repo size](https://img.shields.io/github/repo-size/GabrielH89/blog_platform)
![GitHub language count](https://img.shields.io/github/languages/count/GabrielH89/blog_platform)


![project_image](https://github.com/user-attachments/assets/b8d4e33c-1615-47b9-8cdf-697d00be2c7e)

![project_image](https://github.com/user-attachments/assets/6e86cf9e-c001-41ef-bb7d-6c5b5746f5f5)

## Tecnologias usadas no projeto: 
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

## Descrição
Este projeto permite que o usuário crie uma conta e faça login no sistema. Após autenticado, o usuário pode criar posts, editar, deletar posts. 

Além disso, há a sessão de comentários, onde todos os usuários podem comentar numa postagem e responder aos comentários dos demais. Há a opção de dar um rating, que vai de 0 a 5, no post.

Há a sessão de usuário, onde tem a opção de "informações pessoais, onde o usuário pode verificar seus dados, atualizá-los; o histórico de postagens e comentários que fez, deletar todas as suas postagens.

O primeiro a se cadastrar no sistema será, por padrão, o usuário admin, que terá permissão geral. 

Funcionalidades pendentes: dar like nos posts e comentários
e a parte de "ver estatísticas".


## ✅ Funcionalidades

### 👤 Usuários e autenticação
- Cadastro e login de usuários
- Autenticação com controle de sessão
- Atualização de perfil (nome, e-mail, senha e foto)
- Área do usuário com informações pessoais
- Histórico de postagens realizadas
- Histórico de comentários realizados
- Exclusão de todas as postagens do próprio usuário

### 📝 Postagens
- Criação de postagens
- Edição de postagens
- Exclusão de postagens
- Upload de imagens para postagens
- Avaliação de postagens (rating de 0 a 5)

### 💬 Comentários
- Comentários em postagens
- Respostas a comentários (comentários encadeados)


## Requisitos
Ter o java, npm e o mysql instalados na máquina

## Instalação e execução do projeto na máquina local
1. Execute o comando: git clone git@github.com:GabrielH89/blog_platform.git

#### No diretório backend (raiz)
1. Importe esse diretório na sua IDE

2. Crie um arquivo .env e insira, nele, as variáveis do arquivo .env.example, que está na raíz do diretório backend. 

3. Para criar o banco de dados execute o seguinte comando: $mysql -u seu_usuario_mysql -p -e "CREATE DATABASE IF NOT EXISTS nomedobanco" 

4. Na raiz do diretório backend, crie o diretório /uploads, para que possa armazenar as imagens na máquina local.

5. Após isso, rode o aplicação no backend

#### No diretório frontend
1. Dentro do diretório frontend, execute o comando $ npm install.   

2. No arquivo .env, coloque a variável de ambiente que está no .env.example, essa variável tem que ser http://localhost:(aqui você coloca a mesma porta lá do backend). 

3. Após as dependências serem instaladas, através do comando anterior, o projeto está pronto para funcionar em sua própria máquina, com o comando $ npm run dev, que mostrará em qual porta está rodando a aplicação, no lado do cliente, geralmente a localhost:5173.
