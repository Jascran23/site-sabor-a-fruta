# Sabor a Fruta

Site institucional estático feito com HTML, CSS e JavaScript. A página apresenta a empresa, seus produtos, informações de qualidade e canais de contato.

## Publicação

O projeto não precisa de backend. Envie o conteúdo do projeto para a pasta pública da hospedagem, normalmente chamada `public_html`. O `index.html` deve ficar diretamente na raiz pública; não crie uma pasta `public_html` dentro deste projeto local, a menos que o provedor exija isso.

```text
public_html/
├── index.html
├── produtos.html
├── robots.txt
├── sitemap.xml
├── llms.txt
├── site.webmanifest
├── favicon.ico (opcional, ainda não fornecido)
├── assets/
│   └── images/
├── css/
└── js/
```

O favicon atualmente disponível é `assets/images/favicon.svg`. Os arquivos `favicon.ico` e `apple-touch-icon.png` não estão no projeto; adicione-os à raiz pública somente se forem criados/fornecidos. O HTML usa o SVG que já existe. O `site.webmanifest` apenas prepara os metadados; não transforma o site em um PWA completo.

### Domínio antes de publicar

O domínio definitivo ainda não está configurado. Antes de publicar, substitua `https://SEU-DOMINIO.com.br` pelo domínio real nos seguintes locais:

- `index.html`: canonical, Open Graph, imagem social e URL do Schema.org;
- `produtos.html`: canonical, Open Graph e imagem social;
- `robots.txt`: endereço do sitemap;
- `sitemap.xml`: URLs da página inicial e de produtos.

### Imagem para compartilhamento

Ainda não existe imagem Open Graph no projeto. Crie `assets/images/og-image.jpg` com aproximadamente 1200 × 630 px antes de publicar. As tags Open Graph e Twitter já apontam para esse caminho usando o domínio placeholder.

### Arquivos na raiz pública

`robots.txt`, `sitemap.xml`, `llms.txt` e `site.webmanifest` devem ficar junto de `index.html` e `produtos.html` na raiz pública da hospedagem. O sitemap lista somente essas duas páginas atuais.

## SEO e conteúdo

- `robots.txt` permite o rastreamento e aponta para o sitemap.
- `sitemap.xml` inclui a página inicial e a página de produtos.
- `llms.txt` resume informações institucionais e os canais de contato apresentados no site.
- Os metadados canonical, Open Graph e Schema.org usam placeholders até que o domínio seja definido.
- O site já possui favicon SVG em `assets/images/favicon.svg`.

## Observações técnicas

O site usa arquivos CSS separados para estilos base, variações visuais, animações e responsividade. Os arquivos foram mantidos e não há imports duplicados de CSS no HTML. As páginas carregam folhas de estilo diferentes conforme seu layout.
