# Geometria.AI - Classificador Teachable Machine

Este é um projeto funcional, focado em simplicidade, elegância e alta compatibilidade. Ele serve como base para identificar **Triângulos** e **Cubos** a partir de uma câmera em tempo real ou do upload de uma imagem, utilizando Inteligência Artificial.

## Funcionalidades
- **Integração Real-time**: Usa a sua câmera em tempo real ou upload de arquivo.
- **Teachable Machine Seamless**: Sem necessidade de mexer em código! Na própria interface você cola o link do seu modelo treinado.
- **Design Premium**: Interface responsiva, com *Dark Mode* adaptado e *Glassmorphism*.
- **Plug-and-Play**: Funciona como arquivos estáticos puros (HTML, CSS, JS).

---

## 🛠 Como criar seu Modelo de IA

Para a detecção funcionar especificamente para Triângulos vs. Cubos, você precisa de um modelo rápido gerado no Teachable Machine:

1. Acesse: [Teachable Machine (Google)](https://teachablemachine.withgoogle.com/train/image)
2. Selecione **Projeto de Imagem (Standard image model)**.
3. Crie 2 categorias/classes. Sugestão:
   - Classe 1: `Triângulo`
   - Classe 2: `Cubo`
4. Use sua webcam ou faça upload de imagens para cada classe. Tire fotos do triângulo e do cubo em vários formatos.
5. Clique em **Train Model** (Treinar Modelo) e aguarde.
6. Clique em **Export Model** (Exportar Modelo).
7. Mantenha as configurações (Tensorflow.js) e clique em **Upload my model**.
8. Pegue o link gerado (Exemplo: `https://teachablemachine.withgoogle.com/models/XXXXXXXX/`)
9. **Cole esse link direto na interface deste site** e clique em "Carregar Modelo"!

---

## 🚀 Como fazer o Deploy (Hospedar na Internet)

Como o projeto é construído em Vanilla (HTML, CSS e JS puros), nenhuma compilação complexa é necessária. O deploy é imediato na maioria das plataformas.

### 1. GitHub Pages (O mais fácil)
1. Crie um repositório no [GitHub](https://github.com/).
2. Faça o upload dos arquivos (`index.html`, `style.css`, `script.js`).
3. Vá nas configurações (Settings) do repositório -> **Pages**.
4. Selecione a *Branch* (ex: `main`) e clique em *Save*.
5. Em alguns minutos, seu site estará no ar!

### 2. Netlify
1. Crie uma conta no [Netlify](https://www.netlify.com/).
2. Na dashboard, vá em **Add new site** -> **Deploy manually**.
3. Arraste a pasta que contém o `index.html` para a área indicada.
4. Pronto! O site estará online com um link público que você pode alterar.

### 3. Vercel / Render
1. Acesse [Vercel](https://vercel.com) ou [Render](https://render.com).
2. Conecte sua conta do GitHub.
3. Importe o repositório que você enviou.
4. Clique em "Deploy" (não é necessário setar nenhum comando de build ou pasta de output, a plataforma entenderá o HTML automaticamente).

### 4. Firebase Hosting
1. Instale as ferramentas (via terminal): `npm install -g firebase-tools`
2. No direitório do projeto, rode `firebase login` e depois `firebase init`.
3. Escolha *Hosting*, selecione seu projeto, e defina sua pasta raiz (a que contém o index).
4. Rode `firebase deploy` no terminal.
