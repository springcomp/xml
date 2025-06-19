#!/bin/env bash
pnpm --filter ./core install
pnpm --filter ./core run build
pnpm install

pnpm --filter ./apim run build