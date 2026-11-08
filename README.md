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

### Domínio oficial

O domínio confirmado para publicação é `https://saborafruta.com.br`. Canonicals, metadados sociais, Schema.org, `robots.txt`, `sitemap.xml` e `llms.txt` usam a versão sem `www`. O `.htaccess` não configura redirecionamento para `www` nem força HTTPS; configure o redirecionamento na hospedagem depois de validar o SSL.

### Imagem para compartilhamento

A imagem Open Graph `assets/images/og-image.jpg` continua pendente. As tags Open Graph e Twitter apontam para esse caminho no domínio oficial; crie o arquivo em 1200 × 630 px antes de publicar.

### Arquivos na raiz pública

Envie `.htaccess`, `404.html`, `index.html`, `produtos.html`, `politica-de-privacidade.html`, `robots.txt`, `sitemap.xml`, `llms.txt` e `site.webmanifest` diretamente para a raiz pública. O sitemap lista a página inicial, produtos e política de privacidade.

## SEO e conteúdo

- `robots.txt` permite o rastreamento e aponta para o sitemap.
- `sitemap.xml` inclui a página inicial, a página de produtos e a política de privacidade.
- `llms.txt` resume informações institucionais e os canais de contato apresentados no site.
- Os metadados canonical, Open Graph e Schema.org usam `https://saborafruta.com.br`; a imagem Open Graph ainda está pendente.
- O site já possui favicon SVG em `assets/images/favicon.svg`.

## Observações técnicas

O site usa arquivos CSS separados para estilos base, variações visuais, animações e responsividade. Os arquivos foram mantidos e não há imports duplicados de CSS no HTML. As páginas carregam folhas de estilo diferentes conforme seu layout.
