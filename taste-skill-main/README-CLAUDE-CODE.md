# TNTFIT — Refatoração com paridade visual

## Objetivo
Este projeto foi reorganizado para facilitar leitura, manutenção e edição por IA **sem alterar o visual final** da landing page.

## Regras de edição
- Preserve layout, responsividade, tipografia, cores e espaçamentos visuais.
- Não altere identidade da TNTFIT.
- Priorize melhorias estruturais e de manutenção.
- Evite trocar classes existentes sem atualizar HTML e CSS juntos.

## Estrutura
- `index.html`: estrutura principal da landing page
- `assets/css/styles.css`: estilos da página
- `assets/js/main.js`: countdown, FAQ, reveal e carrosséis
- `assets/img/hero-bg.png`: imagem de fundo do hero

## Pontos sensíveis
- Carrosséis dependem dos IDs e classes atuais.
- FAQ depende da classe `.fi` e do botão `.fbtn`.
- Reveal depende da classe `.rv`.
- Qualquer refatoração deve manter o mesmo comportamento visual em desktop e mobile.
