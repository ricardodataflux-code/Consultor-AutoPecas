export function generateInstantCatalogResult(
  vehicle: string,
  year: string,
  part: string,
  engine: string,
  notes: string,
  answers: Record<string, string>
): string {
  return `1. PERGUNTAS DE CONFIRMAÇÃO
- Houve uma falha de conexão severa com a Inteligência Artificial (Timeout).
- Por favor, verifique no sistema da loja ou tente pesquisar novamente.

2. CÓDIGOS DE REFERÊNCIA
- (Falha na conexão - A Busca Online não pôde ser concluída)
- Tente recarregar a pesquisa em alguns segundos.

3. ALERTAS TÉCNICOS
- O sistema entrou em modo de emergência por falta de resposta da Busca Google.

4. PEÇAS RELACIONADAS
- N/A

5. IMAGEM DE REFERÊNCIA
- Tente recarregar a busca.

6. ONDE ENCONTRAR (se não tiver em loja)
- Distribuidoras locais de Rio Claro - SP (Pellegrino, Garcia, Bezerra, Disauto).`;
}
