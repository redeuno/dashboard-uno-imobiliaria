#!/bin/bash

# 🚀 Script de Deploy - Dashboard Uno
# Este script automatiza o processo de build e deploy do dashboard

set -e  # Sair em caso de erro

echo "🏠 Dashboard Uno - Script de Deploy"
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "package.json não encontrado. Execute este script no diretório do projeto."
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    error "Node.js não está instalado."
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    error "npm não está instalado."
    exit 1
fi

log "Verificando versões..."
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"

# Verificar arquivo .env
if [ ! -f ".env" ]; then
    warn "Arquivo .env não encontrado."
    if [ -f ".env.example" ]; then
        log "Copiando .env.example para .env"
        cp .env.example .env
        warn "Configure suas credenciais no arquivo .env antes de continuar."
        read -p "Pressione Enter para continuar após configurar o .env..."
    fi
fi

# Instalar dependências
log "Instalando dependências..."
npm ci

# Executar testes (se existirem)
if [ -f "src/tests" ] || grep -q "test" package.json; then
    log "Executando testes..."
    npm test || warn "Alguns testes falharam, mas continuando..."
fi

# Executar linting (se configurado)
if grep -q "lint" package.json; then
    log "Executando linting..."
    npm run lint || warn "Linting falhou, mas continuando..."
fi

# Build do projeto
log "Executando build..."
npm run build

# Verificar se o build foi criado
if [ ! -d "dist" ]; then
    error "Diretório dist não foi criado. Build falhou."
    exit 1
fi

log "Build concluído com sucesso!"

# Mostrar tamanho dos arquivos
log "Tamanho dos arquivos de build:"
du -sh dist/*

# Opções de deploy
echo ""
echo -e "${BLUE}Opções de Deploy:${NC}"
echo "1. Deploy local (servir arquivos localmente)"
echo "2. Deploy Vercel"
echo "3. Deploy Netlify"
echo "4. Deploy manual (apenas mostrar instruções)"
echo "5. Pular deploy"

read -p "Escolha uma opção (1-5): " deploy_option

case $deploy_option in
    1)
        log "Iniciando servidor local..."
        if command -v serve &> /dev/null; then
            serve -s dist -l 3000
        else
            warn "Comando 'serve' não encontrado. Instalando..."
            npm install -g serve
            serve -s dist -l 3000
        fi
        ;;
    2)
        log "Deploy Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            warn "Vercel CLI não encontrado. Instale com: npm i -g vercel"
            echo "Depois execute: vercel --prod"
        fi
        ;;
    3)
        log "Deploy Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=dist
        else
            warn "Netlify CLI não encontrado. Instale com: npm i -g netlify-cli"
            echo "Depois execute: netlify deploy --prod --dir=dist"
        fi
        ;;
    4)
        log "Instruções para deploy manual:"
        echo ""
        echo "1. Faça upload da pasta 'dist' para seu servidor web"
        echo "2. Configure o servidor para servir arquivos estáticos"
        echo "3. Configure redirecionamento para index.html (SPA)"
        echo ""
        echo "Exemplo para Apache (.htaccess):"
        echo "RewriteEngine On"
        echo "RewriteCond %{REQUEST_FILENAME} !-f"
        echo "RewriteCond %{REQUEST_FILENAME} !-d"
        echo "RewriteRule . /index.html [L]"
        echo ""
        echo "Exemplo para Nginx:"
        echo "location / {"
        echo "  try_files \$uri \$uri/ /index.html;"
        echo "}"
        ;;
    5)
        log "Deploy pulado."
        ;;
    *)
        warn "Opção inválida. Deploy pulado."
        ;;
esac

# Limpeza (opcional)
read -p "Deseja limpar arquivos temporários? (y/N): " cleanup
if [[ $cleanup =~ ^[Yy]$ ]]; then
    log "Limpando arquivos temporários..."
    rm -rf node_modules/.cache
    npm cache clean --force
fi

# Backup do build (opcional)
read -p "Deseja fazer backup do build? (y/N): " backup
if [[ $backup =~ ^[Yy]$ ]]; then
    backup_name="dashboard-uno-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    log "Criando backup: $backup_name"
    tar -czf "$backup_name" dist/
    log "Backup criado: $backup_name"
fi

echo ""
log "Deploy concluído! 🎉"
echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo "1. Teste o dashboard em produção"
echo "2. Configure monitoramento"
echo "3. Configure backup automático"
echo "4. Documente a URL de produção"
echo ""
echo -e "${GREEN}Dashboard Uno está pronto para uso!${NC} 🏠📊"

