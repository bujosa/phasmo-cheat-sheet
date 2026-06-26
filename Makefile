# Phasmo Cheat Sheet — controles del servidor local
# Uso: make up | make down | make restart | make status | make logs | make open | make update
PORT    ?= 8123
PY      ?= python3
PIDFILE := .server.pid
LOGFILE := .server.log

.PHONY: help up down restart status logs open update

help:
	@echo "Phasmo Cheat Sheet — comandos:"
	@echo "  make up       Prende el servidor en http://localhost:$(PORT)"
	@echo "  make down     Apaga el servidor"
	@echo "  make restart  Reinicia el servidor"
	@echo "  make status   Muestra si esta corriendo"
	@echo "  make logs     Muestra el log en vivo"
	@echo "  make open     Abre el navegador"
	@echo "  make update   Actualiza los datos del juego (scripts/update-data.sh)"

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
