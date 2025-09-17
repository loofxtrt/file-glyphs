import { Plugin, setIcon } from 'obsidian';

/*
	- [x] folderS
	- [ ] update real time
	- [ ] kanban
	- [ ] canvas
	- [ ] map?
*/

function injectIcon(element: Element, iconId: string, isFaint: boolean = false) {
	// criar a div do ícone e adicionar a classe glyph
	const glyph = document.createElement('div');
	glyph.classList.add('glyph');

	// definir o ícone dentro da div
	// o iconId deve ser correspondente a um id de ícone válido
	// na lib do lucide icons que o obsidian já tem por padrão
	setIcon(glyph, iconId);

	// adicionar o ícone no começo do elemento
	element.prepend(glyph);

	// adicionar a classe pra deixar o texto todo mais fraco, caso especificado
	if (isFaint) {
		const parent = glyph.parentElement;
		parent?.classList.add('faint-entry');
	}
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

		// const specialPrefixes = {
		// 	'main': 'scroll-text',
		// 	//'main': 'milestone',
		// 	//'conventions': 'scroll-text',
		// 	//'kanban': 'panels-top-left',
		// 	//'canvas': 'layout-dashboard',
		// 	//'map': 'map'
		// }

		files.forEach(f => {
			const glyphAlreadyAdded = f.querySelector('.glyph');
			const fileName = f.textContent?.trim() || '';

			const fileTag = f.querySelector('.nav-file-tag')?.textContent?.trim() || '';

			// não é todo arquivo que recebe um ícone. se for receber o id 'bug' deve ser mudado pelo if a baixo
			// se o ícone passar e não for mudado mesmo assim, algo de errado aconteceu na verificação
			let glyphId: string = 'bug';

			// definir o ícone (ou a ausência dele) pelo nome do arquivo
			// diferente de dirs, os files podem ser considerados especiais só por COMEÇAREM com uma palavra reservada
			// em vez de precisarem ter o exato nome definido como especial
			if (!glyphAlreadyAdded) {
				if (fileName.startsWith('main')) {
					glyphId = 'scroll-text';
					injectIcon(f, glyphId);
				} else if (fileTag && fileTag === 'canvas') {
					glyphId = 'layout-dashboard';
					injectIcon(f, glyphId);
				}
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

			// var que vai ser passada pra func que adiciona os ícones
			// além do ícone ser adicionado, se ela for true, tbm vai aplicar
			// uma classe que no css vai fazer o texto da pasta inteira ser mais fraco que os outros
			// por padrão, é aplicado em todas as pastas que começam com underscore
			let isFaint: boolean = folderName.startsWith('_');

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
				injectIcon(d, glyphId, isFaint);
			}
		});
	}
}