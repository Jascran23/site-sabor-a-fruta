# Guia de configuração do Google Search Console

Este guia prepara a propriedade do domínio oficial `saborafruta.com.br`. A verificação e o envio do sitemap devem ser feitos por alguém com acesso à conta Google da empresa e à configuração DNS do domínio. Nenhuma alteração externa foi realizada nesta etapa.

## 1. Adicionar a propriedade de domínio

1. Acesse [Google Search Console](https://search.google.com/search-console/) com a conta Google que deverá administrar a presença da empresa na Busca.
2. Escolha **Adicionar propriedade**.
3. Selecione **Domínio** e informe `saborafruta.com.br` sem `https://`, sem `www` e sem caminhos.
4. Continue para receber o registro de verificação DNS TXT.

## 2. Verificar pelo DNS

1. Copie o valor TXT fornecido pelo Search Console.
2. No painel do provedor onde o DNS do domínio é administrado, crie um registro **TXT** para `saborafruta.com.br` (ou para o host indicado pelo provedor) e cole o valor exatamente como foi fornecido.
3. Salve o registro sem remover ou substituir registros DNS existentes.
4. Aguarde a propagação. Volte ao Search Console e selecione **Verificar**. Se ainda não for encontrado, aguarde mais e tente novamente.

## 3. Enviar o sitemap

1. Depois da verificação, selecione a propriedade `saborafruta.com.br` no Search Console.
2. Abra **Sitemaps** no menu de indexação.
3. Informe `sitemap.xml` e envie. O endereço completo publicado é `https://saborafruta.com.br/sitemap.xml`.
4. Confira o status do envio e corrija eventuais erros de leitura ou URLs sinalizadas.

## 4. Acompanhar a indexação

- Consulte o relatório **Páginas** para acompanhar URLs indexadas e não indexadas e os motivos informados pelo Google.
- Use **Inspeção de URL** para verificar páginas específicas, como `https://saborafruta.com.br/` e `https://saborafruta.com.br/produtos.html`.
- Depois de publicar alterações relevantes, a inspeção permite solicitar nova indexação; isso é um pedido, não uma garantia de inclusão imediata.

## 5. Investigar problemas de rastreamento

- Nos relatórios **Páginas** e **Sitemaps**, abra os detalhes de cada erro para identificar a URL e a causa indicada.
- Na **Inspeção de URL**, confira se o Google consegue buscar a página, qual canonical foi reconhecido e se há bloqueio de rastreamento.
- Verifique se as URLs usam o domínio oficial `https://saborafruta.com.br`, se os arquivos públicos respondem e se `robots.txt` não bloqueia recursos necessários.
- Corrija primeiro a causa no site ou no servidor; depois valide a correção no Search Console.

O Search Console não controla Analytics. A instalação do Google Analytics 4 permanece fora desta etapa.
