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
    echo -e "${YELLOW}   Instala Node.js 20 LTS con nvm:${NC}"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "   source ~/.bashrc && nvm install 20 && nvm use 20"
    exit 1
fi

if [ "$NODE_VERSION" -gt 22 ]; then
    echo -e "${YELLOW}⚠  ADVERTENCIA: Node.js v${NODE_VERSION} detectado${NC}"
    echo -e "${YELLOW}   Este proyecto requiere Node.js 20-22 debido a dependencias nativas${NC}"
    echo -e "${YELLOW}   Algunas dependencias (como spdy) pueden no ser compatibles con Node.js 23+${NC}"
    echo ""
    echo -e "${CYAN}   Usa Node.js 20 o 22 LTS (recomendado):${NC}"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "   source ~/.bashrc && nvm install 20 && nvm use 20"
    echo ""
    read -p "   ¿Continuar de todas formas? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Instalación cancelada. Por favor usa Node.js 20-22 LTS${NC}"
        exit 1
    fi
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
        echo -e "${GREEN}✓${NC} .env actualizado desde .env.example"
        echo -e "${CYAN}→${NC} Configura tus credenciales en backend/.env"
        echo "   Ver guía completa: CONFIGURATION.md"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✓${NC} Archivo .env creado desde .env.example"
    echo ""
    echo -e "${CYAN}${BOLD}⚠️  IMPORTANTE: Debes configurar las variables de entorno${NC}"
    echo ""
    echo -e "${YELLOW}Variables que DEBES modificar:${NC}"
    echo "   📊 MONGO_URI    - Tu connection string de MongoDB Atlas"
    echo "   🔐 JWT_SECRET   - Clave secreta para tokens (genera una aleatoria)"
    echo "   📧 EMAIL_USER   - Tu correo de Gmail"
    echo "   📧 EMAIL_PASSWORD - Contraseña de aplicación de Gmail"
    echo ""
    echo -e "${CYAN}Guía completa paso a paso:${NC}"
    echo "   cat ../CONFIGURATION.md"
    echo ""
    echo -e "${CYAN}Enlaces rápidos:${NC}"
    echo "   MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register"
    echo "   Gmail App Passwords: https://myaccount.google.com/apppasswords"
    echo ""
fi

echo ""

echo -e "${BOLD}${BLUE}[4/5] Generando certificados SSL...${NC}"
echo ""

mkdir -p certs

if [ -f "certs/key.pem" ] && [ -f "certs/cert.pem" ]; then
    echo -e "${YELLOW}⚠${NC}  Los certificados SSL ya existen"
    read -p "   ¿Regenerar certificados? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$OPENSSL_AVAILABLE" = true ]; then
            echo "🔐 Generando nuevos certificados SSL..."
            cd certs
            openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes \
                -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost" 2>/dev/null
            cd ..
            echo -e "${GREEN}✓${NC} Certificados SSL regenerados (válidos por 365 días)"
        else
            echo -e "${RED}❌ ERROR: OpenSSL no está disponible${NC}"
            echo "   Instala OpenSSL para generar certificados"
            exit 1
        fi
    else
        echo "   Manteniendo certificados existentes"
    fi
else
    if [ "$OPENSSL_AVAILABLE" = false ]; then
        echo -e "${RED}❌ ERROR: OpenSSL no está instalado${NC}"
        echo ""
        echo "Los certificados SSL son obligatorios para HTTPS y HTTP/2"
        echo ""
        echo "Instala OpenSSL:"
        echo "   Ubuntu/Debian: sudo apt-get install openssl"
        echo "   Fedora/RHEL:   sudo dnf install openssl"
        echo "   MacOS:         brew install openssl"
        echo ""
        exit 1
    fi
    
    echo "🔐 Generando certificados SSL autofirmados..."
    cd certs
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes \
        -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        cd ..
        echo -e "${GREEN}✓${NC} Certificados SSL generados correctamente"
        echo "   📄 backend/certs/key.pem  (clave privada)"
        echo "   📄 backend/certs/cert.pem (certificado público)"
        echo "   ⏰ Válidos por 365 días"
        echo ""
        echo -e "${YELLOW}Nota:${NC} Los certificados autofirmados mostrarán advertencia en el navegador."
        echo "      Esto es normal en desarrollo. Acepta la advertencia para continuar."
    else
        cd ..
        echo -e "${RED}❌ ERROR: Falló la generación de certificados${NC}"
        exit 1
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

echo -e "${BOLD}${CYAN}⚠️  IMPORTANTE: Configura tus credenciales antes de continuar${NC}"
echo ""
echo -e "${YELLOW}Edita el archivo backend/.env con tus datos reales:${NC}"
echo ""
echo "   📊 MONGO_URI    → Connection string de MongoDB Atlas"
echo "   🔐 JWT_SECRET   → Clave secreta aleatoria (64+ caracteres)"
echo "   📧 EMAIL_USER   → Tu correo de Gmail"
echo "   📧 EMAIL_PASSWORD → Contraseña de aplicación de Gmail"
echo ""
echo -e "${BOLD}${CYAN}📖 Guía completa de configuración:${NC}"
echo "   cat CONFIGURATION.md"
echo ""
echo -e "${BOLD}${CYAN}🔗 Enlaces rápidos:${NC}"
echo "   • MongoDB Atlas: ${BLUE}https://www.mongodb.com/cloud/atlas/register${NC}"
echo "   • Gmail App Passwords: ${BLUE}https://myaccount.google.com/apppasswords${NC}"
echo "   • Generador JWT Secret: ${BLUE}https://randomkeygen.com/${NC}"
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${BOLD}Después de configurar .env:${NC}"
echo ""
echo -e "${CYAN}1. Cargar datos de prueba:${NC}"
echo "   cd backend"
echo "   npm run seed"
echo ""
echo -e "${CYAN}2. Iniciar el servidor:${NC}"
echo "   npm run dev"
echo ""

echo -e "${BOLD}Servidores disponibles:${NC}"
echo -e "   ${GREEN}→${NC} HTTP:   http://localhost:3000"
echo -e "   ${GREEN}→${NC} HTTPS:  https://localhost:3001  ${YELLOW}(certificado autofirmado)${NC}"
echo -e "   ${GREEN}→${NC} HTTP/2: https://localhost:3002  ${YELLOW}(certificado autofirmado)${NC}"
echo ""

echo -e "${BOLD}Usuarios de prueba (después de npm run seed):${NC}"
echo "   Superadmin:  admin@sistema.com       / Admin123!@#"
echo "   Editor:      editor@sistema.com      / Editor123!@#"
echo "   Organizador: organizador@sistema.com / Organizador123!@#"
echo "   Estudiante:  estudiante@sistema.com  / Estudiante123!@#"
echo ""

echo -e "${BOLD}📚 Documentación:${NC}"
echo "   • Instalación:    INSTALLATION.md"
echo "   • Configuración:  CONFIGURATION.md"
echo "   • Testing:        docs/PRUEBAS.md"
echo ""

exit 0
