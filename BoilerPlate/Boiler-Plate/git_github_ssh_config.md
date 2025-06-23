# Guia Completo: Configuração do Git, GitHub e SSH

## 1. Configurando o Git Localmente

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
git config --global init.defaultBranch main
```

## 2. Instalando o GitHub CLI (`gh`)

- Baixe e instale o GitHub CLI: https://cli.github.com/
- Após instalar, autentique:

```bash
gh auth login
```

Siga as instruções na tela para conectar sua conta GitHub.

## 3. Gerando uma Chave SSH

```bash
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
```

- Pressione Enter para aceitar o local padrão (`~/.ssh/id_ed25519`).
- Defina uma senha forte (opcional, recomendado).

## 4. Adicionando a Chave SSH ao ssh-agent

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

## 5. Adicionando a Chave SSH ao GitHub

- Copie a chave pública:

```bash
cat ~/.ssh/id_ed25519.pub
```

- Acesse https://github.com/settings/keys
- Clique em **New SSH key**, cole a chave e salve.

## 6. Clonando um Repositório Usando SSH

No GitHub, clique em **Code** > **SSH** e copie o link. Exemplo:

```bash
git clone git@github.com:usuario/repositorio.git
```

## 7. Inicializando o Git em um Projeto Existente

```bash
git init
git add .
git commit -m "Primeiro commit"
```

## 8. Adicionando o Repositório Remoto via SSH

```bash
git remote add origin git@github.com:usuario/repositorio.git
```

## 9. Enviando Commits para o GitHub

```bash
git push -u origin main
```

---

## Resumo dos Comandos Básicos

- `git status` — Verifica o status dos arquivos
- `git add <arquivo>` — Adiciona arquivos para commit
- `git commit -m "mensagem"` — Cria um commit
- `git push` — Envia commits para o repositório remoto
- `git pull` — Atualiza o repositório local com o remoto

---

> **Dica:** Sempre prefira SSH para maior segurança e praticidade ao trabalhar com múltiplos repositórios!
