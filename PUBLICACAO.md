# Publicação e domínio

## Recomendação: GitHub para o código + Cloudflare Pages para hospedar

Este projeto é estático e não precisa de servidor de aplicação. A documentação do GitHub Pages restringe sites voltados a operar negócios ou facilitar transações comerciais; por isso, para a captação de clientes da Lincoln Turismo, a recomendação é Cloudflare Pages.

Fontes consultadas:
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/configuration/custom-domains/

## Configuração do projeto

1. Usar o repositório `jfontineli/lincolnturismo`. O `.gitignore` exclui os arquivos originais da raiz, pois um deles contém endereço residencial. Publicar apenas o conteúdo preparado em `site/`.
2. Criar um projeto Cloudflare Pages conectado a `https://github.com/jfontineli/lincolnturismo` e autorizar o acesso a esse repositório.
3. Para integração Git: branch de produção `main`, framework `None`, comando de build `exit 0`, diretório de saída `site`, diretório raiz padrão (raiz do repositório). Novos pushes na `main` passam a atualizar o site automaticamente após a conexão.
4. Abrir a URL temporária fornecida e verificar os links de WhatsApp, e-mail e reprodução de vídeos.
5. Adicionar `www.lincolnturismo.com.br` em **Custom domains** no painel do projeto **antes** de configurar o DNS.
6. No provedor DNS atual, apontar o CNAME de `www` para o hostname real fornecido pelo Pages. Não usar um hostname presumido.
7. Para o domínio raiz `lincolnturismo.com.br`, seguir a configuração de zona exigida pelo provedor e definir um redirecionamento permanente para `www`. Antes de qualquer troca de nameservers, preservar todos os registros existentes, em especial MX e TXT de e-mail.
8. Aguardar a validação DNS/TLS e verificar HTTPS e a versão canônica com `www`.

A propriedade do domínio, o provedor DNS e a conta de hospedagem não foram acessados nesta primeira versão. Não houve alteração de DNS nem publicação no domínio de produção. O arquivo `site/sitemap.xml` e a URL canônica já usam o domínio informado.

## Checklist de lançamento

- Confirmar a revisão visual e editorial com Lincoln, incluindo fotos e vídeos de terceiros presentes no acervo.
- Confirmar que os passeios anunciados estão disponíveis e alinhar as condições de atendimento.
- Enviar um orçamento de teste real pelo WhatsApp e um por e-mail, a partir de um celular.
- Validar domínio/HTTPS, compartilhamento social e carregamento dos vídeos na hospedagem escolhida.
- Manter os originais e documentos privados fora da pasta publicada.

## Compatibilidade com GitHub Pages

A pasta `site/` também é tecnicamente compatível com hospedagem estática do GitHub Pages e contém `.nojekyll`. A recomendação acima considera os termos de uso comercial. Não foi configurado workflow ou domínio de GitHub Pages.
