---
name: trip-map-builder
description: >
  Plan domestic-city trips end to end: enforce complete trip inputs, verify
  Xiaohongshu/Dianping/OpenCLI and AMap readiness, research and confirm a text
  itinerary, build a mobile-first AMap-only travel page, deploy it through
  GitHub and Vercel, and create an AMap App personal travel map. Use for 行程规划、
  旅游攻略、餐厅景点调研、行程网页、行程地图、trip map, or plan my trip. The
  workflow is confirmation-gated and never produces PDF files.
---

# Trip Map Builder

Run this gated pipeline in order:

**Required inputs → Environment readiness → Research and planning → Text approval → AMap mobile page approval → GitHub/Vercel deployment → AMap personal map**

Do not skip a gate, claim an unverified integration is ready, or continue past
a required confirmation. The result is a flexible reference itinerary, not a
script the traveler must obey.

## Non-negotiable constraints

- Do not create or offer a PDF.
- The embedded map, map tiles, markers, routes, geolocation, and navigation
  links must use AMap only. Do not use Leaflet, CARTO, Google Maps, Apple Maps,
  Baidu Maps, or another map renderer/provider.
- Design for a phone first. Desktop compatibility is secondary.
- Never commit or print cookies, passwords, `securityJsCode`, Web Service keys,
  MCP URLs containing keys, or Vercel tokens.
- Distinguish planned, tested, confirmed, deployed, and created states. Never
  describe a future or failed action as complete.

## Stage 1 — Gate: Require complete traveler input

Before configuring tools, researching, or planning, verify that the user has
provided all five categories:

1. destination city;
2. hotel name and address;
3. arrival date, local time, and arrival airport/station;
4. departure date, local time, and departure airport/station;
5. desired or preferred attractions **and** food/cuisine.

Screenshots count only after the fields have been extracted and shown back to
the user. A value such as “please choose for me” is valid for preferences, but
the city, hotel, and arrival/departure details may not be guessed. If anything
is missing, ask once with a compact checklist and stop at this gate.

Read `references/trip-planning.md` for the input template and interaction
format.

## Stage 2 — Gate: Verify and configure the environment

After Stage 1 passes, read `references/environment-setup.md` and verify every
required capability from the host environment that owns the browser session:

- OpenCLI is installed and `opencli doctor` succeeds;
- the Browser Bridge is connected;
- Xiaohongshu is signed in and a one-result live search succeeds;
- Dianping is signed in and a one-result live search succeeds;
- an AMap **Web (JS API)** key and matching `securityJsCode` are available;
- an AMap **Web Service API** key works with a small geocoding or POI query;
- the AMap MCP server is connected and exposes the `personal_map` capability;
- the JS API loads through the configured security proxy without a console or
  authorization error.

Presence of an executable, environment variable, or config entry is not proof
of readiness; run the probes. If a dependency, login, key, permission, or
browser connection is missing, configure it when authorized, tell the user the
smallest manual action needed when not, then retest. Do not start research
until the full checklist passes.

## Stage 3: Research and arrange the trip

Read these references as needed:

- `references/trip-planning.md` — constraints, area grouping, pacing, cuts;
- `references/dianping-research.md` — restaurant hard signals;
- `references/xhs-research.md` — recent experience and atmosphere signals.

Use AMap official POI data for canonical names, POI IDs, GCJ-02 coordinates,
addresses, travel time, and routes. Use official attraction/transport sources
for opening hours, closures, tickets, and reservation rules. Use Dianping as
the main Chinese dining signal and Xiaohongshu as supplementary recent/soft
evidence.

Arrange one main area per day, keep arrival day light and departure day close
to the exit hub, and allow at most one reservation-heavy anchor per day. Cut
items that make the route fragile and explain the cuts. Restaurants should be
on the route unless the user explicitly made one a destination.

Record source links, access date, POI ID, and GCJ-02 coordinates for every
selected place. Do not invent a place, opening time, rating, route, or review
signal when a source fails.

## Stage 4 — Gate: Text itinerary approval

Present a complete written itinerary before writing the webpage. Include:

- assumptions and hard constraints;
- daily areas, ordered stops, suggested time windows, and transit estimates;
- meals with one primary and one nearby fallback;
- booking needs, closures, weather/crowd sensitivity, and practical warnings;
- removed items and reasons;
- a concise source/evidence note for each recommendation.

Ask the user to revise or explicitly approve the whole text plan. Incorporate
changes and repeat this gate until the user confirms it is final. Do not start
the webpage from an unconfirmed draft.

## Stage 5 — Gate: Build and approve the mobile AMap page

Read `references/amap-build-deploy.md`. Copy the files under `assets/site/`
into a new trip project, then populate the confirmed itinerary.

Each location must include `name`, `lat`, `lng`, `amapPoiId`, `type`, `time`,
`desc`, and `notice`; optional fields include `budget`, `detail`, `pay`, `xhs`,
`dianping`, and `reserve`. Coordinates must be GCJ-02 and stored as
`lng`/`lat`; never silently mix WGS84 with GCJ-02.

The page must provide day tabs, ordered markers, route overlays, hotel,
arrival/departure hubs, warnings, booking links, and one-tap AMap navigation.
Use the AMap JS API 2.0 renderer in `assets/site/index.html`; do not substitute
another base map or navigation provider.

Preview through the local Vercel runtime so the AMap security proxy is active.
Test at phone widths, tap targets, scrolling, safe areas, marker/card sync,
geolocation denial, slow network, AMap deep links, and browser console errors.
Give the user a preview or screenshots and request explicit approval. Apply
changes and repeat until approved. Do not deploy before approval.

## Stage 6: Publish through GitHub and Vercel

After webpage approval:

1. verify `git`, GitHub CLI authentication, Vercel CLI authentication, and the
   intended repository visibility;
2. confirm `.gitignore` excludes `.env*` and secret-bearing files;
3. create or update the GitHub repository and push the reviewed source;
4. configure `AMAP_JS_SECURITY_CODE` in Vercel project environment variables;
5. deploy production through Vercel;
6. open the production URL on a phone-sized viewport and rerun the critical
   map, route, navigation, and console checks.

Do not paste secrets into command output, source code, commits, or chat. Treat
deployment as incomplete until the production URL works.

## Stage 7: Create the AMap App personal travel map

Using the final confirmed itinerary, call the connected AMap MCP
`personal_map` tool. Include the trip name, daily grouping, ordered AMap POIs,
brief descriptions, reservations, warnings, and route notes. Use verified AMap
POI IDs and coordinates; omit an uncertain point instead of mapping the wrong
place.

Require the tool to return an AMap personal-map deep/share link. Open or probe
the link, verify that the trip days and points are present, and then give the
user:

- the production Vercel URL;
- the GitHub repository URL;
- the AMap personal travel-map link;
- any remaining reservation or data-freshness warnings.

If `personal_map` is unavailable or fails, stop and repair/reconnect the AMap
MCP integration. A URI multi-marker link or the website itself is a useful
fallback preview, but it must not be labeled as an AMap personal map.

## Shared memory

Read `~/.trip-map-builder/MEMORY.md` when available, but never let memory fill a
required Stage 1 field without showing it to the user for confirmation. Store
only durable preferences and final output URLs. Do not store screenshots,
credentials, cookies, booking codes, or complete chat logs.

## User interaction

For every required decision, use: **Re-ground → Simplify → Recommend →
Options**. Combine independent questions, skip questions already answered, and
make the recommended option explicit. At the two approval gates, always offer
at least: approve and continue, revise, or rebuild the direction.

## Resources

- `references/trip-planning.md` — required inputs, itinerary methodology, text approval
- `references/environment-setup.md` — OpenCLI, site login, AMap keys/MCP, readiness probes
- `references/dianping-research.md` — Dianping research workflow
- `references/xhs-research.md` — Xiaohongshu research workflow
- `references/amap-build-deploy.md` — AMap-only page, mobile QA, deployment, personal map
- `assets/site/` — AMap-only Vercel-ready mobile page template
