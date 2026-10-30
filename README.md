# Lincoln Turismo — primeira versão

Site institucional responsivo, sem login ou dependência de backend. HTML, CSS e JavaScript; imagens WebP e vídeos carregados sob demanda. Contatos confirmados: **(64) 99646-5656** e **lincolnturismoalagoas@gmail.com**. Base em Maceió, atendimento por Alagoas.

Repositório: https://github.com/jfontineli/lincolnturismo — branch principal `main`. Para hospedar no Cloudflare Pages, use o diretório de saída `site`, conforme [PUBLICACAO.md](PUBLICACAO.md).

Instagram: https://www.instagram.com/lincolnturismoalagoas/. A apresentação destaca o credenciamento informado pelo responsável e o vídeo de convite para Alagoas. O atendimento inclui Alagoas e Pernambuco, conforme confirmado pelo responsável.

## Identidade visual

O site usa a reprodução aprovada do logotipo enviado por Lincoln (`site/assets/logo-lincoln.png`), com azul oceano, turquesa e amarelo. Essa imagem foi reconstruída a partir de uma captura e não constitui vetorização exata do original. O favicon é uma versão simplificada do sol e da onda. O botão flutuante de WhatsApp mantém a cor verde para identificação do canal.

## Visualizar

Abra `site/index.html` diretamente no navegador, ou execute:

```sh
npm start
```

Acesse http://localhost:4173. Node.js 20 ou posterior. A aplicação não precisa instalar pacotes para funcionar. `npm install` instala somente a ferramenta de testes de navegador.

## Arquivos e edição

- `site/index.html`: conteúdo, metadados, formulário e links de contato de fallback.
- `site/styles.css`: identidade visual e adaptação para celular.
- `site/app.js`: galeria, seleção de experiências, formulário e janelas de mídia.
- `site/config.js`: WhatsApp e e-mail usados na composição das mensagens. Ao trocar os contatos, atualizar também os links e textos estáticos em `index.html`.
- `site/assets`: fotos otimizadas, capas e os 27 vídeos do acervo.
- `tools/serve.mjs`: servidor de prévia local com suporte a streaming de vídeo.
- `tools/check.mjs` e `tools/browser-check.mjs`: verificações estáticas e de navegação.
- `PUBLICACAO.md`: orientação de hospedagem e domínio.
- `ACERVO.md`: aproveitamento do material original.

O formulário não envia mensagens automaticamente. Ele abre o WhatsApp ou aplicativo de e-mail com o pedido preenchido; o visitante revisa e envia. Não há banco de dados, analytics, cookies de publicidade, pagamento ou confirmação automática de reserva.

## Validação

```sh
npm test
node tools/browser-check.mjs
```

O teste de navegador usa o Chrome instalado e uma porta temporária 4175, encerrada após o teste. Gera capturas em `test-results/`. Cobertura: desktop, 320/390/768 px, menu mobile, seleção de destinos/serviços, galeria com 27 vídeos e 8 fotos, modal/tecla Escape, composição dos links de WhatsApp/e-mail, política de privacidade, ausência de overflow horizontal e requisições parciais de vídeo. Não envia mensagens reais.

## Observações editoriais

Não foram criados depoimentos, avaliações, preços, selos, certificações ou promessas de inclusão. Atividades, horários, acessibilidade, cancelamento e inclusões devem ser confirmados no atendimento. O vídeo de Carneiros foi identificado como Pernambuco, separado da oferta principal de Alagoas. Vídeos podem citar preços históricos; o visualizador informa que valores atuais precisam ser confirmados.

As fontes DM Sans e Manrope são carregadas pelo Google Fonts, com fontes de sistema como fallback. O site funciona sem esse carregamento. Os vídeos só são requisitados ao abrir o visualizador. Nenhum endereço residencial foi publicado.
