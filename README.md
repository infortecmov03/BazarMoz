
# Bazar Moçambique E-commerce

Este é um projeto de e-commerce moderno construído com Next.js, Firebase e Tailwind CSS, preparado para ser publicado na Netlify.

## Funcionalidades Principais

- **Catálogo de Produtos:** Visualização de produtos com detalhes.
- **Carrinho de Compras:** Adicionar, atualizar e remover produtos.
- **Checkout:** Processo de finalização de compra para utilizadores autenticados.
- **Autenticação de Utilizadores:** Suporte para login com E-mail/Palavra-passe e Telemóvel.
- **Painel de Administração:** Área restrita para gestão (em construção).
- **Design Responsivo:** Adaptado para mobile e desktop.

## Stack Tecnológica

- **Frontend:** [Next.js](https://nextjs.org/) (com App Router)
- **UI:** [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Base de Dados:** [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **IA (Opcional):** [Genkit](https://firebase.google.com/docs/genkit)
- **Alojamento (Hosting):** Preparado para [Netlify](https://www.netlify.com/)

---

## Como Gerir o Conteúdo

### Como Gerir Produtos

Os seus produtos são guardados na base de dados **Firestore**. Para adicionar, editar ou remover produtos, siga estes passos:

1.  Aceda à [Consola da Firebase](https://console.firebase.google.com/) e selecione o seu projeto.
2.  No menu à esquerda, vá para **Construir** -> **Firestore Database**.
3.  Se a coleção `products` ainda não existir, clique em **"+ Iniciar coleção"** e nomeie-a `products`.
4.  Para adicionar um novo produto, clique em **"+ Adicionar documento"**. Pode deixar o ID do Documento ser gerado automaticamente.
5.  Preencha os campos do produto. Pode copiar e colar o exemplo abaixo para garantir que a estrutura está correta.

**Exemplo de um Documento de Produto (JSON):**

```json
{
    "name": "Nome do Produto",
    "description": "Uma descrição detalhada e apelativa sobre o seu produto.",
    "price": 1500,
    "stock": 50,
    "isFeatured": true,
    "isOnSale": false,
    "images": [
        "https://picsum.photos/seed/produto1/600/400"
    ]
}
```

- `name`: (Texto) O nome do produto.
- `description`: (Texto) A descrição.
- `price`: (Número) O preço em Meticais (sem vírgula).
- `stock`: (Número) A quantidade disponível.
- `isFeatured`: (Booleano - `true`/`false`) Se `true`, aparece na secção "Produtos em Destaque".
- `isOnSale`: (Booleano - `true`/`false`) Se `true`, aparece na página "Promoções".
- `images`: (Array) Uma lista de links para as imagens do produto.

### Como Gerir Administradores

O acesso de administrador é controlado por uma lista de IDs de utilizador (UIDs).

1.  **Publique o site e crie uma conta:** Primeiro, faça o deploy do site na Netlify. Depois, aceda ao seu site e crie uma conta de utilizador (por e-mail ou telemóvel).
2.  **Encontre o seu UID:**
    *   Vá à [Consola da Firebase](https://console.firebase.google.com/).
    *   Vá para **Construir** -> **Authentication**.
    *   Na lista de utilizadores, encontre a sua conta. O seu UID é a sequência de letras e números na coluna "Identificador de utilizador". Copie este valor.
3.  **Adicione o seu UID ao código:**
    *   Abra o ficheiro: `src/hooks/use-admin.ts`.
    *   Adicione o seu UID que copiou à lista `ADMIN_UIDS`.
    *   Exemplo: `const ADMIN_UIDS = ['SEU_UID_ADMIN_VAI_AQUI', 'gD7n37dhqigCk6sxRezuLPeHwQ33', 'SEU_NOVO_UID_AQUI'];`
4.  **Faça o deploy novamente:** Envie esta alteração para o seu GitHub, e a Netlify irá fazer um novo deploy automaticamente com as suas novas permissões.

---

## Como Fazer o Deploy na Netlify

Siga estes passos para publicar o seu site na Netlify.

### Pré-requisitos

- Uma conta no [GitHub](https://github.com/).
- Uma conta na [Netlify](https://www.netlify.com/).
- O seu projeto Firebase já criado.

### Passo 1: Publicar o Código no GitHub

1.  Crie um novo repositório no seu GitHub.
2.  Envie todo o código deste projeto para esse repositório.

### Passo 2: Configurar o Projeto na Netlify

1.  Faça login na sua conta Netlify.
2.  Clique em **"Add new site"** -> **"Import an existing project"**.
3.  Escolha o GitHub como provedor e autorize o acesso.
4.  Selecione o repositório que acabou de criar.
5.  A Netlify deverá detetar automaticamente as configurações de compilação a partir do ficheiro `netlify.toml` incluído no projeto. As configurações devem ser:
    - **Build command:** `next build`
    - **Publish directory:** `.next`
6.  Antes de fazer o deploy, clique em **"Show advanced"** e depois em **"New variable"** para adicionar as variáveis de ambiente.

### Passo 3: Adicionar as Variáveis de Ambiente

As variáveis de ambiente são as "chaves" que permitem que o seu site na Netlify comunique de forma segura com o seu backend na Firebase.

Copie o valor de cada uma das variáveis abaixo do seu ficheiro `src/firebase/config.ts` e adicione-as uma a uma no painel da Netlify. **É crucial que os nomes das variáveis na Netlify sejam exatamente os que estão listados abaixo.**

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Exemplo:**
- **Nome da Variável:** `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Valor:** `"AIzaSyDeRS_6-Ld-AGRwBuUTtY_0uPODyR2GXGs"` (copie o valor do seu ficheiro)

### Passo 4: Fazer o Deploy

1.  Depois de adicionar todas as variáveis, clique no botão **"Deploy site"**.
2.  A Netlify irá compilar e publicar o seu site. Este processo pode demorar alguns minutos.
3.  Assim que terminar, o seu site estará disponível no link fornecido pela Netlify!
