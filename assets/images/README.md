# Imagens do site

Todas as imagens ficam nesta pasta para que um mesmo arquivo possa ser reutilizado sem criar cópias em subpastas.

## Referências atuais

- `favicon.svg`: favicon, manifesto e identidade das páginas legais.
- `og-image.jpg`: prévia de compartilhamento social.
- `polpa-maracuja.png` / `polpa-maracuja.webp`: embalagem exibida na hero, nos cards e na timeline.
- `sabor-monkey.png`: logo do cabeçalho e imagem da seção da empresa.
- `frutas-frescas.jpg`: imagem da seção “Qualidade que se sente”.
- `abacaxi.jpg` e `maracuja.jpg`: fundos da seção de frutas.
- `insta-abacaxi.jpg`, `insta-caju.jpg` e `insta-morango.webp`: galeria.

Os arquivos `optimized-*.webp` são derivados WebP mantidos ao lado dos originais. `optimized-sabor-monkey-logo.webp` é a versão reduzida usada no cabeçalho; `optimized-polpa-maracuja-800.webp` é a versão reduzida usada nas embalagens exibidas. As páginas escolhem a versão WebP com `<picture>` ou `image-set()` onde configurado; os originais permanecem disponíveis como fallback ou fonte editável.

Outras imagens continuam guardadas na pasta para possível reutilização; não são necessárias para as páginas atuais. Para substituir uma imagem, mantenha o nome do arquivo ou atualize a referência correspondente no HTML, CSS ou JavaScript.
