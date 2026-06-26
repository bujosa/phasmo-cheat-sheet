# Phasmo Cheat Sheet — fully static site (HTML/CSS/JS + bundled game data).
# Served by nginx for a tiny, fast, production-ready image that runs anywhere.
#
#   docker build -t phasmo-cheat-sheet .
#   docker run --rm -p 8123:80 phasmo-cheat-sheet
#   → open http://localhost:8123
#
# Everything (ghost/map/weekly data, fonts, images) is bundled in the image,
# so it works 100% offline with no external network calls.
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="Phasmo Cheat Sheet" \
      org.opencontainers.image.description="Offline Phasmophobia ghost-identification cheat sheet (Spanish)" \
      org.opencontainers.image.source="https://github.com/bujosa/phasmo-cheat-sheet"

# Custom nginx config: gzip, long-cache for hashed assets, no-cache for index.html.
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the site, then drop build/tooling files that shouldn't be web-served.
COPY . /usr/share/nginx/html
RUN cd /usr/share/nginx/html && \
    rm -rf docker Dockerfile docker-compose.yml .dockerignore Makefile scripts .server.pid .server.log

# nginx:alpine already runs as a non-root-friendly image and exposes 80.
EXPOSE 80

# Simple healthcheck so `docker ps` / compose can report readiness.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:80/ || exit 1
