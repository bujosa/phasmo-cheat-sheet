# Despliegue de Phasmo Cheat Sheet en el homelab

Corre la app en **ser9** (`10.0.0.12`) y la sirve como **http://ghost.home** vía la
Pi-hole (`10.0.0.17`) + un reverse proxy nginx.

```
  navegador  →  ghost.home (Pi-hole DNS → 10.0.0.12)
                      │
              ser9 :80  ghost-proxy (nginx, vhost ghost.home)
                      │  →  phasmo (app, nginx estático)
              ser9 :48123  ← acceso directo a la app (puerto poco común)
```

## Componentes

| Pieza | Dónde | Detalle |
|------|-------|---------|
| `phasmo` | ser9, contenedor | La app estática (imagen `phasmo-cheat-sheet`). Publicada en `:48123` y en la red interna. |
| `ghost-proxy` | ser9, contenedor | nginx que es **dueño del :80** y enruta `ghost.home` → `phasmo`. |
| Registro DNS | Pi-hole (10.0.0.17) | `ghost.home → 10.0.0.12` en `pihole.toml` (`dns.hosts`). |

El **puerto 48123** es deliberadamente poco común para que ningún otro servicio lo
ocupe; el acceso “bonito” es `http://ghost.home` (puerto 80 vía el proxy).

## Desplegar / actualizar

Requiere el contexto Docker `ser9` (`ssh://bujosa@10.0.0.12`) y acceso ssh a `pi`.

```bash
make deploy        # build + up -d en ser9 (proxy :80 + app :48123)
make deploy-dns    # registra ghost.home -> 10.0.0.12 en la Pi-hole
make deploy-ps     # estado de los contenedores en ser9
make deploy-logs   # logs
make deploy-down   # apagar
```

O a mano:

```bash
docker --context ser9 compose -f deploy/docker-compose.ser9.yml up -d --build
ssh pi 'sudo bash -s' < deploy/pihole/add-ghost-record.sh
```

> **Contexto remoto:** se construye contra el daemon de ser9 por SSH. Por eso las
> imágenes **hornean** su config (no usamos bind-mounts, que apuntarían al disco de
> ser9). El build context sí viaja por SSH.

## Pi-hole v6 — notas

- Los registros locales viven en `/etc/pihole/pihole.toml` → `[dns] hosts = [...]`.
- `/etc/dnsmasq.d/*.conf` se **ignora** (`etc_dnsmasq_d = false`).
- Tras editar el toml hay que **reiniciar FTL por completo**
  (`systemctl restart pihole-FTL`); `pihole reloaddns` no basta.

## Resolver `ghost.home` desde tu PC

La app y el DNS ya están listos en la red. Para que **tu Mac** resuelva `ghost.home`
debe usar la Pi-hole (10.0.0.17) como DNS. Hoy esta Mac usa el DNS de Tailscale
(`100.95.0.251`), que **no** conoce los `.home`. Opciones:

1. **Tailscale split-DNS** (recomendado): en la consola de Tailscale, *DNS →
   Nameservers → Add → Restrict to domain* `home` → `10.0.0.17`. Así todos los
   `.home` resuelven en cualquier dispositivo del tailnet.
2. **Apuntar el DNS de la Mac a la Pi-hole**: Ajustes → Red → DNS → `10.0.0.17`.
3. **Atajo local** (solo esta Mac): añadir a `/etc/hosts`:
   ```
   10.0.0.12 ghost.home
   ```

Comprobar:  `dig +short ghost.home @10.0.0.17`  → `10.0.0.12`.
