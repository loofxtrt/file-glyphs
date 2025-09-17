#!/usr/bin/bash

target="/mnt/seagate/obsidian-vaults/plugin-development/.obsidian/plugins/file-glyphs"

# compila o js e copia os arquivos necessários pro plugin funcionar
npm run build

rm -rf $target
mkdir -p $target

cp manifest.json main.js styles.css $target

# não precisa copiar o repo inteiro
#cp -r ./ $target