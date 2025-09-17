import { Plugin, setIcon } from 'obsidian';

/*
	- [x] folderS
	- [ ] update real time
	- [ ] kanban
	- [ ] canvas
*/

function injectIcon(element: Element, iconId: string) {
	// criar a div do ícone e adicionar a classe glyph
	const glyph = document.createElement('div');
	glyph.classList.add('glyph');

	// definir o ícone dentro da div
	// o iconId deve ser correspondente a um id de ícone válido
	// na lib do lucide icons que o obsidian já tem por padrão
	setIcon(glyph, iconId);

	// adicionar o ícone no começo do elemento
	element.prepend(glyph);
}

function removeIcon(element: Element) {
	// o elemento passado deve ser a entrada da file tree (.nav-folder-title),
	// e não o glyph diretamente. ele é obtido manualmente aqui
	const glyph = element.querySelector('.glyph');
	
	if (glyph) {
		glyph.remove();
	}
}

export default class FileGlyphs extends Plugin {
	onload() {
		// injetar os ícones no carregamento inicial
		this.runIconVerification();

		// também verificar novas pastas e arquivos a cada x segundos
		this.registerInterval(window.setInterval(() => this.runIconVerification(), 500));
	}

	runIconVerification() {
		const directories = document.querySelectorAll('.nav-folder-title');
		const files = document.querySelectorAll('.nav-file-title');

		files.forEach(f => {
			const fileName = f.textContent?.trim() || '';
			let glyphId: string | null = null; // pode ser null pq não é todo arquivo que vai receber um ícone

			// definir o ícone (ou a ausência dele) pelo nome do arquivo
			// verificação feita com true pra que se possa usar o startswith
			switch (true) {
				case fileName === 'main':
					glyphId = 'scroll-text';
					break;
				case fileName.startsWith('kanban'):
					glyphId = 'panels-top-left';
					break;
				case fileName.startsWith('canvas'):
					glyphId = ''
					break;
				default:
					break;
			}
		});
		
		directories.forEach(d => {
			// variável que se não for nula, significa
			// que já existe um ícone pra esse elemento, então deve ser ignorado
			// FIXME:
			// 	COM ISSO OS ÍCONES NÃO SÃO CORRIGIDOS EM TEMPO DE EXECUÇÃO
			// 	SE UMA PASTA MUDA DE NOME, OS ÍCONES ESPECIAIS NÃO SÃO ATUALIZADOS AUTOMATICAMENTE
			// 	É NECESSÁRIO USAR O CTRL + P > RELOAD APP
			const glyphAlreadyAdded = d.querySelector('.glyph');

			// obter o nome da pasta sem espaços ou uma string vazia
			const folderName = d.textContent?.trim() || '';
			
			// se a pasta em questão tem um nome reservado pra ícones especiais
			// é tido como true até o switch dizer o contrário
			let isSpecial: boolean = true;

			// se o elemento pai da pasta atual tiver o elemento .nav-folder-children
			// e SE o .nav-folder-children tiver MAIS DE 0 ELEMENTOS, significa que a pasta tem subdiretórios
			// tem que checar a quantidade de filhos dele pq em alguns casos ele existe, mas sem nenhum subdir
			const fParent = d.closest('.nav-folder'); // obter o parent da pasta atual
			const navFolderChildren = fParent?.querySelector('.nav-folder-children');
			const hasSubdirs = !!(navFolderChildren && navFolderChildren.children.length > 0);

			// ícone de pastas padrão
			// caso seja só uma pasta sem subdiretórios, recebe o ícone de pasta única
			// caso contrário, recebe um ícone que indica que a pasta tem subdirs
			let glyphId: string = hasSubdirs ? 'lucide-folders' : 'lucide-folder';

			// decidir o ícone que vai ser atribuído a pasta baseado no nome
			// e caso nenhum dos casos especiais aconteça, é uma pasta comum
			switch (folderName) {
				case '_archive':
					glyphId = 'lucide-archive';
					break;
				case '_attachments':
					glyphId = 'lucide-link-2';
					break;
				case '_icons':
					glyphId = 'lucide-traffic-cone';
					break;
				default:
					isSpecial = false;
					break;
			}

			if (!glyphAlreadyAdded) {
				// inserir o ícone caso ele já não esteja presente
				injectIcon(d, glyphId);
			}
		});
	}
}