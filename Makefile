# Phasmo Cheat Sheet — controles del servidor local
# Uso: make up | make down | make restart | make status | make logs | make open | make update
#      make docker-up | make docker-down | make docker-build  (con Docker)
PORT    ?= 8123
PY      ?= python3
PIDFILE := .server.pid
LOGFILE := .server.log
IMAGE   := phasmo-cheat-sheet

.PHONY: help up down restart status logs open update docker-build docker-up docker-down docker-logs

help:
	@echo "Phasmo Cheat Sheet — comandos:"
	@echo "  Local (python):"
	@echo "    make up       Prende el servidor en http://localhost:$(PORT)"
	@echo "    make down     Apaga el servidor"
	@echo "    make restart  Reinicia el servidor"
	@echo "    make status   Muestra si esta corriendo"
	@echo "    make logs     Muestra el log en vivo"
	@echo "    make open     Abre el navegador"
	@echo "    make update   Actualiza los datos del juego (scripts/update-data.sh)"
	@echo "  Docker (para usar en otra PC):"
	@echo "    make docker-up     Construye y levanta el contenedor en :$(PORT)"
	@echo "    make docker-down   Apaga el contenedor"
	@echo "    make docker-build  Solo construye la imagen"
	@echo "    make docker-logs   Muestra los logs del contenedor"

up:
	@if lsof -ti tcp:$(PORT) >/dev/null 2>&1; then \
		echo "Ya hay algo en el puerto $(PORT). Corre 'make down' primero (o 'make restart')."; \
	else \
		nohup $(PY) -m http.server $(PORT) --bind 127.0.0.1 > $(LOGFILE) 2>&1 & echo $$! > $(PIDFILE); \
		sleep 1; \
		echo "Phasmo corriendo en  http://localhost:$(PORT)  (PID $$(cat $(PIDFILE)))"; \
	fi

down:
	@if [ -f $(PIDFILE) ] && kill $$(cat $(PIDFILE)) 2>/dev/null; then \
		echo "Detenido (PID $$(cat $(PIDFILE)))."; rm -f $(PIDFILE); \
	elif lsof -ti tcp:$(PORT) >/dev/null 2>&1; then \
		lsof -ti tcp:$(PORT) | xargs kill -9 2>/dev/null; echo "Detenido (puerto $(PORT))."; rm -f $(PIDFILE); \
	else \
		echo "No estaba corriendo."; rm -f $(PIDFILE); \
	fi

restart: down up

status:
	@if lsof -ti tcp:$(PORT) >/dev/null 2>&1; then \
		echo "Corriendo en http://localhost:$(PORT)  (PID $$(lsof -ti tcp:$(PORT)))"; \
	else echo "Apagado."; fi

logs:
	@touch $(LOGFILE); tail -n 40 -f $(LOGFILE)

open:
	@open "http://localhost:$(PORT)" 2>/dev/null || xdg-open "http://localhost:$(PORT)" 2>/dev/null || echo "Abre http://localhost:$(PORT)"

update:
	@bash scripts/update-data.sh

# --- Docker (usar la app en cualquier PC con Docker, sin python) ---
docker-build:
	@docker build -t $(IMAGE) .

docker-up:
	@PORT=$(PORT) docker compose up -d --build
	@echo "Phasmo (Docker) corriendo en  http://localhost:$(PORT)"

docker-down:
	@docker compose down

docker-logs:
	@docker compose logs -f

# --- Deploy en ser9 (Docker context "ser9" = ssh://bujosa@10.0.0.12) ---
SER9_CTX ?= ser9
PI_HOST  ?= pi
PI_CTX   ?= pi
NPM_NAME ?= nginx-proxy-manager
DEPLOY   := deploy/docker-compose.ser9.yml

deploy: ## construye y levanta la app en ser9 (proxy :80 + app :48123)
	@docker --context $(SER9_CTX) compose -f $(DEPLOY) up -d --build
	@echo "Desplegado en ser9:"
	@echo "  http://ghost.home        (vía pihole + proxy nginx :80)"
	@echo "  http://10.0.0.12         (proxy directo)"
	@echo "  http://10.0.0.12:48123   (app directa, puerto poco comun)"

deploy-down: ## apaga la app en ser9
	@docker --context $(SER9_CTX) compose -f $(DEPLOY) down

deploy-logs: ## logs de la app en ser9
	@docker --context $(SER9_CTX) compose -f $(DEPLOY) logs -f

deploy-ps: ## estado de los contenedores en ser9
	@docker --context $(SER9_CTX) compose -f $(DEPLOY) ps

deploy-dns: ## registra ghost.home -> 10.0.0.17 en la Pi-hole (pihole.toml v6) y reinicia FTL
	@ssh $(PI_HOST) 'sudo bash -s' < deploy/pihole/add-ghost-record.sh

deploy-npm: ## instala el vhost ghost.home en el nginx-proxy-manager de la Pi
	@docker --context $(PI_CTX) exec $(NPM_NAME) mkdir -p /data/nginx/custom
	@docker --context $(PI_CTX) cp deploy/npm/http.conf $(NPM_NAME):/data/nginx/custom/http.conf
	@docker --context $(PI_CTX) exec $(NPM_NAME) nginx -t
	@docker --context $(PI_CTX) exec $(NPM_NAME) nginx -s reload
	@echo "vhost ghost.home -> 10.0.0.12:48123 instalado en NPM ($(NPM_NAME))"
