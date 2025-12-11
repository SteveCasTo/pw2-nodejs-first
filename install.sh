#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║      PW2 NODE.JS PROJECT - INSTALADOR AUTOMÁTICO         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

echo -e "${BOLD}${BLUE}[1/5] Verificando prerrequisitos...${NC}"
echo ""

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ ERROR: Node.js no está instalado${NC}"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ ERROR: Se requiere Node.js >= 20.x${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node --version)"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ ERROR: npm no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm $(npm --version)"

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ ERROR: git no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} git $(git --version | cut -d' ' -f3)"

if ! command -v openssl &> /dev/null; then
    echo -e "${YELLOW}⚠${NC}  OpenSSL no disponible"
    OPENSSL_AVAILABLE=false
else
    echo -e "${GREEN}✓${NC} OpenSSL detectado"
    OPENSSL_AVAILABLE=true
fi

echo ""

echo -e "${BOLD}${BLUE}[2/5] Instalando dependencias...${NC}"
echo ""

cd backend

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERROR: package.json no encontrado${NC}"
    exit 1
fi

npm install --silent

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias instaladas${NC}"
else
    echo -e "${RED}❌ ERROR: Falló la instalación${NC}"
    exit 1
fi

echo ""

echo -e "${BOLD}${BLUE}[3/5] Configurando variables de entorno...${NC}"
echo ""

if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC}  El archivo .env ya existe"
    read -p "   ¿Sobrescribir? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "   Manteniendo .env existente"
    else
        cp .env.example .env
        echo -e "${GREEN}✓${NC} .env actualizado"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✓${NC} Archivo .env creado"
fi

echo ""

echo -e "${BOLD}${BLUE}[4/5] Verificando certificados SSL...${NC}"
echo ""

if [ "$OPENSSL_AVAILABLE" = true ]; then
    mkdir -p certs
    
    if [ -f "certs/key.pem" ] && [ -f "certs/cert.pem" ]; then
        echo -e "${GREEN}✓${NC} Certificados SSL existentes"
    else
        echo "🔐 Generando certificados SSL..."
        cd certs
        openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes \
            -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost" 2>/dev/null
        cd ..
        echo -e "${GREEN}✓${NC} Certificados SSL generados"
    fi
else
    if [ -f "certs/key.pem" ] && [ -f "certs/cert.pem" ]; then
        echo -e "${GREEN}✓${NC} Certificados SSL existentes"
    else
        echo -e "${YELLOW}⚠${NC}  Los certificados deberían estar incluidos en el repositorio"
    fi
fi

echo ""

echo -e "${BOLD}${BLUE}[5/5] Verificando estructura...${NC}"
echo ""

REQUIRED_FILES=("package.json" "tsconfig.json" "src/server.ts" "src/app.ts")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Estructura verificada"
else
    echo -e "${RED}❌ Archivos faltantes:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo ""

cd ..

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║            ✅  INSTALACIÓN EXITOSA                        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BOLD}Próximos pasos:${NC}"
echo ""
echo -e "${CYAN}1. Cargar datos iniciales:${NC}"
echo "   cd backend"
echo "   npm run seed"
echo ""
echo -e "${CYAN}2. Iniciar el servidor:${NC}"
echo "   npm run dev"
echo ""

echo -e "${BOLD}Servidores disponibles:${NC}"
echo -e "   ${GREEN}→${NC} HTTP:   http://localhost:3000"
echo -e "   ${GREEN}→${NC} HTTPS:  https://localhost:3001"
echo -e "   ${GREEN}→${NC} HTTP/2: https://localhost:3002"
echo ""

echo -e "${BOLD}Usuarios de prueba:${NC}"
echo "   Superadmin:  admin@sistema.com       / Admin123!@#"
echo "   Editor:      editor@sistema.com      / Editor123!@#"
echo "   Organizador: organizador@sistema.com / Organizador123!@#"
echo "   Estudiante:  estudiante@sistema.com  / Estudiante123!@#"
echo ""

echo -e "${YELLOW}Para probar endpoints: cat docs/PRUEBAS.md${NC}"
echo ""

exit 0
