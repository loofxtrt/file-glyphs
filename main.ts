import { Plugin } from 'obsidian';

export default class FileGlyphsMain extends Plugin {
	onload() {
		this.injectIcons();
		this.registerInterval(window.setInterval(() => this.injectIcons(), 1000));
	}

	injectIcons() {
		const folders = document.querySelectorAll('.nav-folder-title');
		
		folders.forEach(f => {
			const glyphAlreadyAdded = f.querySelector('.glyph');
			
			// let glyphContent = '📁';
			// switch (f.textContent) {
			// 	case '_archive':
			// 		glyphContent = '🗄️';
			// 		break;
			// 	case '_attachments':
			// 		glyphContent = '🔗';
			// 		break;
			// 	case '_icons':
			// 		glyphContent = '🚧';
			// 		break;
			// }

			// if (!glyphAlreadyAdded) {
			// 	const glyph = document.createElement('span');
			// 	glyph.textContent = glyphContent;
			// 	glyph.classList.add('glyph');
			// 	f.prepend(glyph);
			// }

			let glyphId: string = 'lucide-folder';
			switch (f.textContent) {
				case '_archive':
					glyphId = 'lucide-archive';
					break;
				case '_attachments':
					glyphId = 'lucide-link';
					break;
				case '_icons':
					glyphId = 'lucide-traffic-cone';
					break;
			}

			if (!glyphAlreadyAdded) {
				const glyph = document.createElement('i');
				glyph.classList.add('glyph', 'lucide', 'lucide-folder');
				f.prepend(glyph);
			}
		});
	}
}