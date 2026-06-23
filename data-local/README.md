# Local data snapshot

This folder makes the fork **self-contained**. Upstream loads ghost/map/weekly/
language data live from `zero-network.net`, but that API returns **401** to any
host other than the official `tybayn.github.io`, so a self-hosted fork would show
the *"Ghosts not found"* screen.

To work around that, the app now reads these files locally (see the rewired
`fetch(...)` calls in [`scripts-v10/zn-v5.js`](../scripts-v10/zn-v5.js)):

| File | Used for |
|------|----------|
| `ghosts-<lang>.json` | Ghost cards: evidence, speeds, sanity, behaviors/wiki (12 languages) |
| `maps.json` | Map list / map explorer |
| `weekly.json` | Weekly challenge box |
| `languages.json` | Language selector |

## Refreshing

The game gets updates, so this snapshot will drift over time. Re-pull the latest
data with:

```bash
./scripts/update-data.sh
```

## Note on content

Ghost stats are factual game data, but the behavior/wiki **text** in these files is
authored by the upstream project (Zero-Network / Ty Bayn, AGPLv3). This snapshot is
intended for personal use of your own fork. If you redistribute, respect the
upstream license and its request not to reuse its hosted resources.
