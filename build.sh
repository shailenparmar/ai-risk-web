#!/bin/zsh
# RETIRED 2026-07-07. The shailenparmar.com "mirror" no longer exists.
# airiskweb.com is the single source of truth (deployed by ./deploy-domain.sh).
# shailenparmar.com/airiskweb/ (and /airisk, /ai-risk-web) now 301-redirect to
# airiskweb.com via public/_redirects in the shailenparmar.com repo — there is
# no copied HTML to keep in sync anymore.
#
# To ship an app change: edit app.html -> node check.mjs -> ./deploy-domain.sh
echo "build.sh is retired — the mirror is gone. Use ./deploy-domain.sh (airiskweb.com is canonical)."
echo "Legacy shailenparmar.com paths 301-redirect to airiskweb.com via public/_redirects."
exit 1
