const markdown = `
PERGUNTAS DE CONFIRMAÇÃO
* Qual o sistema de freio: Teves ou Mando?
* O veículo possui ABS?

CÓDIGOS DE REFERÊNCIA
* Aguardando confirmação dos dados.
`;

const sections = markdown.split(/(?=(?:#+\s*)?(?:[1-6]\.\s*)?(?:PERGUNTAS DE CONFIRMAÇÃO|CÓDIGOS DE REFERÊNCIA|CÓDIGOS DE REFERENCIA|ALERTAS TÉCNICOS|ALERTAS TECNICOS|PEÇAS RELACIONADAS|PECAS RELACIONADAS|IMAGEM DE REFERÊNCIA|IMAGEM DE REFERENCIA|ONDE ENCONTRAR(?:.*)?))/i);

console.log(sections);
