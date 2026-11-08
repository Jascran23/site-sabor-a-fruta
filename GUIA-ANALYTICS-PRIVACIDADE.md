# Guia de Analytics e privacidade — Sabor a Fruta

## Estado atual

- Não foi encontrado GA4, Google Tag Manager, Meta Pixel, ferramenta de sessão ou analytics ativo no projeto.
- O ID de medição está vazio em `js/analytics-config.js`; portanto, o GA4 e o aviso de consentimento não são carregados na configuração atual.
- O projeto inclui a preparação para um evento automático de visualização de página do GA4. Não foram criados eventos personalizados.
- Quando houver ID, o script do Google só será solicitado depois de uma autorização explícita para medição. Rejeitar ou não escolher bloqueia a solicitação.
- Uma escolha explícita será guardada no `localStorage` deste navegador por até 180 dias. Sem um ID válido, o link de preferências apenas informa que Analytics ainda não foi configurado e nenhuma escolha é guardada.
- Fontes do Google Fonts, GSAP/ScrollTrigger pelo cdnjs e Three.js pelo jsDelivr são recursos externos já usados para apresentação e animação; não são ferramentas de Analytics adicionadas nesta etapa.

## 1. Criar a propriedade GA4

1. Acesse [Google Analytics](https://analytics.google.com/) usando a conta da empresa que ficará responsável pela propriedade.
2. Crie uma propriedade para **Sabor a Fruta**, com fuso horário e moeda confirmados pelo responsável.
3. Adicione um fluxo de dados do tipo **Web** para `https://saborafruta.com.br`.
4. Revise as configurações da propriedade, retenção de dados, compartilhamento de dados e recursos de medição. Registre as escolhas para atualizar a política de privacidade antes de ativar a coleta.

## 2. Localizar o ID de medição

No fluxo de dados da Web, copie o **ID de medição** no formato `G-...`. Não use o ID da propriedade numérica nem um ID de contêiner GTM. O responsável deve fornecer esse valor ao mantenedor do site.

## 3. Inserir o ID no projeto

Edite `js/analytics-config.js` e preencha somente a propriedade existente:

```js
measurementId: 'G-ID_FORNECIDO_PELO_CLIENTE'
```

Substitua o texto de exemplo pelo ID real fornecido. Não crie um ID. Deixe a string vazia enquanto a propriedade ou a autorização de ativação não estiverem prontas. O script `js/privacy-consent.js` valida o formato `G-...` e só injeta `gtag.js` após a escolha afirmativa do visitante.

O GA4 envia a visualização de página padrão quando autorizado. Não há rastreamento de cliques, formulários, compras ou outros eventos personalizados preparado no projeto.

## 4. Testar eventos e consentimento

Depois de inserir um ID real e publicar em ambiente controlado:

1. Abra o site em uma janela privada sem preferências salvas. Antes de escolher, confirme nas ferramentas de rede do navegador que não há solicitação a `googletagmanager.com` nem `google-analytics.com`.
2. Selecione **Rejeitar**. Confirme que a escolha é lembrada ao recarregar e que o script do GA4 não é solicitado.
3. Apague a escolha de teste pelo link **Preferências de privacidade**, selecione **Configurar**, deixe a opção de Analytics desmarcada e salve. Confirme novamente que não há solicitação de Analytics.
4. Aceite a medição em outra sessão de teste. Confirme que o script é solicitado somente depois do aceite.
5. No GA4, confira **Relatórios em tempo real** e **DebugView**, se o modo de depuração estiver ativado na sessão. A visualização de página deve corresponder a uma navegação real.
6. Abra novamente as preferências e rejeite a medição. Confirme que a escolha passa a ser recusada e que os cookies `_ga` existentes são removidos quando o navegador permite a remoção pelo domínio atual.
7. Repita os fluxos em uma largura móvel e confirme que os botões continuam legíveis e operáveis, sem sobrepor a navegação ou impedir o uso do site.
8. Teste a página inicial, produtos, política e 404. A navegação e animações devem continuar funcionais com Analytics vazio, rejeitado ou sem conexão com o Google.

O `localStorage` guarda a preferência no dispositivo, não comprova que uma visita chegou ao GA4. O Realtime/DebugView só pode ser validado com uma propriedade real acessível e o site servido por HTTPS.

## 5. Dados a fornecer para concluir a política

O responsável pelo site precisa confirmar:

- Razão social ou nome do controlador e, se aplicável, nome/contato do encarregado.
- Canal de contato para solicitações de titulares e endereço eletrônico oficial, se houver.
- Finalidades e bases legais efetivamente adotadas para cada tratamento.
- Provedor de hospedagem, registros técnicos coletados e respectivos prazos de retenção.
- Provedores externos mantidos no site e revisão de seus termos e transferências internacionais aplicáveis.
- Se ativar GA4: ID de medição, finalidade, eventos realmente necessários, base legal, retenção escolhida, compartilhamentos e configurações da propriedade.
- Aprovação do texto final da política pelo controlador e, se desejado por ele, revisão jurídica especializada.

Não substitua os campos entre colchetes da política com estimativas. Use os dados confirmados pelo controlador.

## 6. Acessos que dependem do cliente

Criar a propriedade, copiar o ID, revisar configurações e consultar Realtime/DebugView dependem de acesso autorizado à conta Google Analytics da empresa. Publicar o ID e validar a coleta em produção dependem também de autorização para publicar o site. Nenhuma conta externa foi acessada ou alterada nesta etapa.

## 7. Verificações na hospedagem

- Confirmar que o HTTPS e o caminho de `js/analytics-config.js`, `js/privacy-consent.js` e `css/privacy-consent.css` respondem no domínio oficial.
- Após uma alteração autorizada do ID, limpar o cache da hospedagem/CDN se o navegador ainda receber uma versão antiga do arquivo.
- Se a hospedagem aplicar uma Content Security Policy, permitir os domínios do Google Analytics somente quando a integração for ativada; hoje o projeto não define CSP.
- Repetir os testes de aceitar, rejeitar e revogar no domínio publicado, observando a aba Network e os cookies do domínio.
- Confirmar que o armazenamento local está disponível no navegador usado. Se estiver bloqueado, a escolha vale para a página atual e pode ser solicitada novamente em uma visita futura.

Não há configuração de DNS ou `.htaccess` necessária para manter o Analytics desativado.
