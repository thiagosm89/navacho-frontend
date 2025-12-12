# Como Iniciar o Servidor de Desenvolvimento

## Passo a Passo

1. **Abra o terminal na pasta do projeto:**
   ```bash
   cd C:\Users\thiag\IdeaProjects\barbearia\barbearia-frontend
   ```

2. **Instale as dependências (se ainda não instalou):**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   - O Vite normalmente inicia na porta **5173**
   - Acesse: `http://localhost:5173`
   - Se a porta estiver ocupada, o Vite usará a próxima disponível (5174, 5175, etc.)
   - **Verifique no terminal qual URL foi exibida!**

## Solução de Problemas

### Porta já em uso
Se a porta 5173 estiver ocupada:
- O Vite automaticamente tentará a próxima porta disponível
- Verifique no terminal qual URL foi exibida
- Ou pare o processo que está usando a porta 5173

### Servidor não inicia
1. Verifique se o Node.js está instalado: `node --version`
2. Verifique se o npm está instalado: `npm --version`
3. Limpe o cache: `npm cache clean --force`
4. Delete `node_modules` e reinstale: 
   ```bash
   rm -rf node_modules
   npm install
   ```

### Erros de compilação
- Verifique se há erros no terminal
- Verifique se todos os arquivos estão salvos
- Tente parar o servidor (Ctrl+C) e iniciar novamente

## URLs Alternativas

Se `localhost` não funcionar, tente:
- `http://127.0.0.1:5173`
- `http://0.0.0.0:5173`

## Verificar se o Servidor Está Rodando

No terminal, você deve ver algo como:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Copie e cole a URL exibida no seu navegador!

