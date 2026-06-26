#!/usr/bin/env bash
# Registra ghost.home -> 10.0.0.12 en la Pi-hole (10.0.0.17). Idempotente.
#
# Pi-hole v6 guarda los registros DNS locales en /etc/pihole/pihole.toml bajo
# [dns] hosts = [ "<ip> <nombre>", ... ]  — NO en /etc/dnsmasq.d (ahí
# etc_dnsmasq_d = false, así que esos archivos se ignoran).
#
# Importante: tras editar el toml hay que reiniciar FTL POR COMPLETO
# (`pihole reloaddns`/`restartdns` NO recarga el toml de forma fiable).
#
# Uso (desde el repo):  make deploy-dns      (lo ejecuta por ssh en la Pi)
#       o directamente:  ssh pi 'sudo bash -s' < deploy/pihole/add-ghost-record.sh
set -euo pipefail

RECORD='10.0.0.12 ghost.home'
TOML='/etc/pihole/pihole.toml'

if grep -qF 'ghost.home' "$TOML"; then
  echo "ghost.home ya está registrado en $TOML"
else
  # insertar como primer elemento del array dns.hosts (la línea que abre 'hosts = [')
  sed -i "/^  hosts = \[\$/a\\    \"$RECORD\"," "$TOML"
  echo "Añadido: \"$RECORD\""
fi

# reinicio COMPLETO de FTL para que relea el toml
systemctl restart pihole-FTL 2>/dev/null || service pihole-FTL restart
sleep 2

echo -n "Comprobación  ghost.home -> "; dig +short ghost.home @127.0.0.1 || true
