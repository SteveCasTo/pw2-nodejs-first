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

if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ ERROR: Node.js versión $NODE_VERSION detectada${NC}"
    echo "   Se requiere Node.js >= 20.x"
    echo "   Actualiza desde: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js $(node --version) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ ERROR: npm no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm $(npm --version) detectado"

# Verificar git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ ERROR: git no está instalado${NC}"
    echo "   Instala git desde: https://git-scm.com/"
    exit 1
fi

echo -e "${GREEN}✓${NC} git $(git --version | cut -d' ' -f3) detectado"

# Verificar OpenSSL (para certificados SSL)
if ! command -v openssl &> /dev/null; then
    echo -e "${YELLOW}⚠${NC}  OpenSSL no está instalado (necesario para HTTPS/HTTP2)"
    echo "   Los certificados SSL no se generarán automáticamente"
    OPENSSL_AVAILABLE=false
else
    echo -e "${GREEN}✓${NC} OpenSSL detectado"
    OPENSSL_AVAILABLE=true
fi

echo ""
echo -e "${GREEN}✓ Todos los prerrequisitos principales están instalados${NC}"
echo ""

##############################################################################
# PASO 2: Instalar Dependencias del Backend
##############################################################################

echo -e "${BOLD}${BLUE}[2/6] Instalando dependencias del backend...${NC}"
echo ""

cd backend

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERROR: package.json no encontrado en backend/${NC}"
    exit 1
fi

echo "📦 Instalando paquetes npm (esto puede tomar unos minutos)..."
npm install --silent

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}❌ ERROR: Falló la instalación de dependencias${NC}"
    exit 1
fi

echo ""

##############################################################################
# PASO 3: Configurar Variables de Entorno
##############################################################################

echo -e "${BOLD}${BLUE}[3/6] Configurando variables de entorno...${NC}"
echo ""

if [ ! -f ".env.example" ]; then
    echo -e "${RED}❌ ERROR: .env.example no encontrado${NC}"
    exit 1
fi

if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC}  El archivo .env ya existe"
    read -p "   ¿Deseas sobrescribirlo? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "   Manteniendo .env existente"
    else
        cp .env.example .env
        echo -e "${GREEN}✓${NC} .env sobrescrito desde .env.example"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✓${NC} Archivo .env creado desde .env.example"
fi

echo ""

##############################################################################
# PASO 4: Generar Certificados SSL
##############################################################################

echo -e "${BOLD}${BLUE}[4/6] Verificando certificados SSL...${NC}"
echo ""

if [ "$OPENSSL_AVAILABLE" = true ]; then
    # Crear directorio certs si no existe
    mkdir -p certs
    
    if [ -f "certs/key.pem" ] && [ -f "certs/cert.pem" ]; then
        echo -e "${YELLOW}⚠${NC}  Los certificados SSL ya existen en certs/"
        read -p "   ¿Deseas regenerarlos? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🔐 Generando nuevos certificados SSL autofirmados..."
            cd certs
            openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes \
                -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost" 2>/dev/null
            cd ..
            echo -e "${GREEN}✓${NC} Certificados SSL regenerados (válidos por 365 días)"
        else
            echo "   Manteniendo certificados existentes"
        fi
    else
        echo "🔐 Generando certificados SSL autofirmados..."
        cd certs
        openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes \
            -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost" 2>/dev/null
        cd ..
        echo -e "${GREEN}✓${NC} Certificados SSL generados correctamente"
        echo "   📄 certs/key.pem (clave privada RSA 4096-bit)"
        echo "   📄 certs/cert.pem (certificado X.509, válido 365 días)"
    fi
else
    if [ -f "certs/key.pem" ] && [ -f "certs/cert.pem" ]; then
        echo -e "${GREEN}✓${NC} Certificados SSL existentes encontrados"
    else
        echo -e "${YELLOW}⚠${NC}  OpenSSL no disponible - No se pueden generar certificados"
        echo "   Los certificados deberían estar incluidos en el repositorio"
        echo "   Si no están, instala OpenSSL y vuelve a ejecutar el instalador"
    fi
fi

echo ""

##############################################################################
# PASO 5: Verificar Estructura del Proyecto
##############################################################################

echo -e "${BOLD}${BLUE}[5/6] Verificando estructura del proyecto...${NC}"
echo ""

REQUIRED_DIRS=("src" "src/config" "src/controllers" "src/models" "src/routes" "src/services" "src/middlewares")
MISSING_DIRS=()

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        MISSING_DIRS+=("$dir")
    fi
done

if [ ${#MISSING_DIRS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Estructura del proyecto verificada"
else
    echo -e "${YELLOW}⚠${NC}  Directorios faltantes:"
    for dir in "${MISSING_DIRS[@]}"; do
        echo "   - $dir"
    done
fi

# Verificar archivos críticos
REQUIRED_FILES=("package.json" "tsconfig.json" "src/server.ts" "src/app.ts")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Archivos críticos verificados"
else
    echo -e "${RED}❌ Archivos críticos faltantes:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo ""

##############################################################################
# PASO 6: Resumen y Próximos Pasos
##############################################################################

echo -e "${BOLD}${BLUE}[6/6] Instalación completada${NC}"
echo ""

cd ..  # Volver a la raíz del proyecto

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}║            ✅  INSTALACIÓN EXITOSA                        ║${NC}"
echo -e "${GREEN}║                                                           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BOLD}${YELLOW}⚠️  PASOS RESTANTES (CONFIGURACIÓN MANUAL REQUERIDA):${NC}"
echo ""
echo -e "${CYAN}1. Configurar MongoDB Atlas:${NC}"
echo "   - Crea una cuenta gratuita en: https://www.mongodb.com/cloud/atlas/register"
echo "   - Crea un nuevo cluster (M0 Free tier)"
echo "   - Crea un usuario de base de datos"
echo "   - Añade tu IP a la whitelist (0.0.0.0/0 para desarrollo)"
echo "   - Obtén tu connection string"
echo ""
echo -e "${CYAN}2. Editar archivo .env:${NC}"
echo "   nano backend/.env"
echo ""
echo "   Actualiza la línea MONGO_URI con tu connection string:"
echo -e "${YELLOW}   MONGO_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/TU_DATABASE${NC}"
echo ""
echo -e "${CYAN}3. (Opcional) Configurar JWT_SECRET seguro:${NC}"
echo "   node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo "   Copia el resultado y úsalo en JWT_SECRET dentro de .env"
echo ""
echo -e "${CYAN}4. Cargar datos iniciales:${NC}"
echo "   cd backend"
echo "   npm run seed"
echo ""
echo -e "${CYAN}5. Iniciar el servidor:${NC}"
echo "   cd backend"
echo "   npm run dev"
echo ""

echo -e "${BOLD}Los servidores estarán disponibles en:${NC}"
echo -e "   ${GREEN}→${NC} HTTP:   http://localhost:3000"
echo -e "   ${GREEN}→${NC} HTTPS:  https://localhost:3001"
echo -e "   ${GREEN}→${NC} HTTP/2: https://localhost:3002"
echo ""

echo -e "${BOLD}Para probar los endpoints:${NC}"
echo "   cat docs/PRUEBAS.md"
echo "   O revisa la guía completa en: INSTALLATION.md"
echo ""

echo -e "${BOLD}Usuarios de prueba (después de ejecutar npm run seed):${NC}"
echo "   Superadmin:  admin@sistema.com       / Admin123!@#"
echo "   Editor:      editor@sistema.com      / Editor123!@#"
echo "   Organizador: organizador@sistema.com / Organizador123!@#"
echo "   Estudiante:  estudiante@sistema.com  / Estudiante123!@#"
echo ""

echo -e "${BOLD}${GREEN}¡Instalación automática completada!${NC}"
echo -e "${YELLOW}Completa los pasos manuales arriba para comenzar a desarrollar.${NC}"
echo ""

exit 0
