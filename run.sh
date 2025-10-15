#!/usr/bin/bash

target0="/mnt/seagate/obsidian-vaults/plugin-development/.obsidian/plugins/file-glyphs"
target="/mnt/seagate/obsidian-vaults/projects/.obsidian/plugins/file-glyphs"
target2="/mnt/seagate/obsidian-vaults/central/.obsidian/plugins/file-glyphs"
target3="/mnt/seagate/obsidian-vaults/restricted/.obsidian/plugins/file-glyphs"
target4="/mnt/seagate/obsidian-vaults/dream-recall/.obsidian/plugins/file-glyphs"
target5="/mnt/seagate/obsidian-vaults/fuse-testing/.obsidian/plugins/file-glyphs"

# compila o js e copia os arquivos necessários pro plugin funcionar
npm run build

rm -rf $target0
mkdir -p $target0

rm -rf $target
mkdir -p $target

rm -rf $target2
mkdir -p $target2

rm -rf $target3
mkdir -p $target3

rm -rf $target4
mkdir -p $target4

rm -rf $target5
mkdir -p $target5

cp manifest.json main.js styles.css $target0
cp manifest.json main.js styles.css $target
cp manifest.json main.js styles.css $target2
cp manifest.json main.js styles.css $target3
cp manifest.json main.js styles.css $target4
cp manifest.json main.js styles.css $target5

# comentado pq não precisa copiar o repo inteiro
#cp -r ./ $target