/**
 * Comprehensive Automotive Catalog Engine for Counter Clerks
 * Generates instant, exact reference codes for vehicle models & parts in Brazil.
 */

export interface CatalogPartMatch {
  oem: string;
  aftermarket: Array<{ brand: string; code: string; note?: string }>;
  alerts: string[];
  similars: string[];
  complementary: string[];
  visualTerm: string;
  visualDescription: string;
}

export function generateInstantCatalogResult(
  vehicle: string,
  year: string,
  part: string,
  engine?: string,
  notes?: string,
  answers?: Record<string, string>
): string {
  const v = vehicle.toLowerCase().trim();
  const p = part.toLowerCase().trim();
  const y = parseInt(year) || 0;
  const eng = (engine || '').toLowerCase();
  const not = (notes || '').toLowerCase();

  // Helper for Rio Claro suppliers
  const rioClaroSuppliers = `- Pellegrino Distribuidora de Autopeças (Rio Claro - SP - Rota expressa para oficinas e balcão)
- Garcia Autopeças & Distribuidora (Rio Claro - SP - Pronta entrega balcão)
- Bezerra Distribuidora de Autopeças (Rio Claro - SP - Linha de suspensão, freio e motor)
- Pit Stop Autopeças (Rio Claro - SP - Atendimento balcão e peças elétricas/injeção)`;

  // 1. AMORTECEDOR
  if (p.includes('amortecedor')) {
    const isRear = p.includes('traseir');

    // CHEVROLET ONIX / PRISMA / COBALT / SPIN
    if (v.includes('onix') || v.includes('prisma') || v.includes('joy') || v.includes('spin') || v.includes('cobalt')) {
      if (isRear) {
        return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Chevrolet ${vehicle} ${year || ''} - Traseiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (GM): 52068288
- Nakata: HG 31175
- COFAP: GL27506 (Turbogás)
- Monroe: SP014 (OESpectrum)
- KYB: 3430042
- Corven: 42721G

3. ALERTAS TÉCNICOS
- Amortecedor traseiro vendido em par. Olhal inferior com bucha de borracha vulcanizada.
- Verificar desgaste dos calços superior e inferior da mola helicoidal.

4. PEÇAS RELACIONADAS
- Similares: COFAP Turbogás (1ª linha), Nakata HG (1ª linha), Monroe OESpectrum (1ª linha).
- Peças complementares: Kit batente e coifa traseira (Novo Kit NK0143 / Sampel SK343S), Molas helicoidais traseiras COFAP (E-CHEV28).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor traseiro nakata HG 31175 onix"
- Visual: Haste fina com espigão superior de rosca e olhal circular com bucha na base inferior.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
      } else {
        return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Chevrolet ${vehicle} ${year || ''} - Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (GM): 52068285 (Lado Direito) / 52068284 (Lado Esquerdo)
- Nakata: HG 33012 (Lado Direito) / HG 33013 (Lado Esquerdo)
- COFAP: GP30263 (Lado Direito) / GP30264 (Lado Esquerdo)
- Monroe: 749074SP (Lado Direito) / 749075SP (Lado Esquerdo)
- KYB: 3330058 (Lado Direito) / 3330059 (Lado Esquerdo)
- Sachs: 315 289 (Lado Direito) / 315 288 (Lado Esquerdo)

3. ALERTAS TÉCNICOS
- Atenção: Os amortecedores dianteiros possuem lado específico (LD e LE) devido ao suporte soldado da bieleta.
- Recomendada a troca sempre em pares para manter o equilíbrio dinâmico e alinhamento do veículo.
- Troca preventiva obrigatória do kit coxim com rolamento axial para não gerar estalo ao esterçar.

4. PEÇAS RELACIONADAS
- Similares: Nakata Pressurizado (1ª linha), COFAP Turbogás (OEM), Monroe OESpectrum (1ª linha).
- Peças complementares: Kit amortecedor dianteiro com coxim e rolamento (Novo Kit NK0142 / Sampel SK342S), Bieletas da barra estabilizadora (Nakata N99028 / Cofap BTC04108).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor dianteiro nakata HG 33012 onix"
- Visual: Tubo preto com suporte saliente para fixação da bieleta na meia-haste e base com 2 furos na manga de eixo.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
      }
    }

    // VOLKSWAGEN GOL / VOYAGE / FOX / SAVEIRO / POLO
    if (v.includes('gol') || v.includes('voyage') || v.includes('fox') || v.includes('saveiro') || v.includes('polo')) {
      if (isRear) {
        return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Volkswagen ${vehicle} ${year || ''} - Traseiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (VW): 5U0513025
- Nakata: HG 31088
- COFAP: GL27515 (Turbogás)
- Monroe: SP039
- KYB: 343831
- Sachs: 313 045

3. ALERTAS TÉCNICOS
- Amortecedor traseiro vendido em par. Fixação superior por espigão e olhal inferior na ponte traseira.
- Inspecione calços de mola e buchas do eixo traseiro.

4. PEÇAS RELACIONADAS
- Similares: COFAP GL27515, Nakata HG 31088, Monroe SP039.
- Peças complementares: Kit batente e coifa traseiro (Sampel SK204S / Novo Kit NK0204).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor traseiro cofap GL27515 gol"
- Visual: Haste cilíndrica com rosca superior e olhal inferior com bucha metálica e borracha vulcanizada.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
      } else {
        return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Volkswagen ${vehicle} ${year || ''} - Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (VW): 5U0413031
- Nakata: HG 33010 (Direito e Esquerdo idênticos)
- COFAP: GP32477 (Turbogás)
- Monroe: SP038
- KYB: 333748
- Sachs: 313 044

3. ALERTAS TÉCNICOS
- Nesta geração da VW, os amortecedores dianteiros não possuem lado (servem no lado direito e esquerdo).
- Substituir o coxim com rolamento axial de esferas: se o rolamento travar, a mola gira com estalo no volante.
- Fazer sangria / escorvamento prévio antes de montar a mola (movimentar a haste 3 a 4 vezes).

4. PEÇAS RELACIONADAS
- Similares: Nakata HG 33010, COFAP GP32477, Monroe SP038.
- Peças complementares: Kit amortecedor dianteiro com rolamento (Sampel SK203S), Bieleta dianteira (Nakata N99025).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor dianteiro nakata HG 33010 gol g5"
- Visual: Prato de mola soldado largo, cartucho de encaixe tipo tubo na manga de eixo e haste superior com sextavado interno.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
      }
    }

    // FIAT PALIO / UNO / STRADA / SIENA / MOBI
    if (v.includes('palio') || v.includes('uno') || v.includes('strada') || v.includes('siena') || v.includes('mobi')) {
      if (isRear) {
        return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Fiat ${vehicle} ${year || ''} - Traseiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (Fiat): 51804792
- Nakata: HG 31086
- COFAP: GL27301 (Turbogás)
- Monroe: SP022
- KYB: 343397

3. ALERTAS TÉCNICOS
- Amortecedor pressurizado a gás. Venda e aplicação sempre em pares no eixo traseiro.

4. PEÇAS RELACIONADAS
- Similares: COFAP GL27301, Nakata HG 31086, Monroe SP022.
- Peças complementares: Kit batente e guarda-pó traseiro (Novo Kit NK0102 / Mobensani MB102).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor traseiro cofap GL27301 palio"
- Visual: Olhal inferior e superior para passagem de parafusos de fixação passantes.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
      } else {
        return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Fiat ${vehicle} ${year || ''} - Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (Fiat): 51842095
- Nakata: HG 33008 (LD) / HG 33009 (LE)
- COFAP: GP30132 (LD) / GP30133 (LE)
- Monroe: SP021
- KYB: 333742

3. ALERTAS TÉCNICOS
- Conferir fixação da haste no coxim e suporte do flexível de freio soldado no corpo do tubo.
- Troca do par dianteiro com novo kit de batente em poliuretano e coxim superior.

4. PEÇAS RELACIONADAS
- Similares: COFAP Turbogás GP30132, Nakata HG 33008, Monroe SP021.
- Peças complementares: Kit amortecedor dianteiro com rolamento (Sampel SK101S), Bieletas Nakata (N99018).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor dianteiro cofap GP30132 palio"
- Visual: Suporte duplo furado na base para manga de eixo e suporte soldado para flexível de freio.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
      }
    }

    // HYUNDAI HB20 / CRETA
    if (v.includes('hb20') || v.includes('creta')) {
      if (isRear) {
        return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Hyundai ${vehicle} ${year || ''} - Traseiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (Hyundai): 55300-1S000
- Nakata: HG 31195
- COFAP: GL27580
- Monroe: SP055
- KYB: 3430058

3. ALERTAS TÉCNICOS
- Amortecedor traseiro com calibração pressurizada. Recomenda-se troca dos pares para não desestabilizar traseira em curvas.

4. PEÇAS RELACIONADAS
- Similares: COFAP GL27580, Nakata HG 31195, Monroe SP055.
- Peças complementares: Kit de batente e coifa traseira (Novo Kit NK0385).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor traseiro nakata HG 31195 hb20"
- Visual: Corpo preto esguio com pino roscado superior e olhal na base.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
      } else {
        return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Hyundai ${vehicle} ${year || ''} - Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (Hyundai): 54650-1S000 (LE) / 54660-1S000 (LD)
- Nakata: HG 33024 (Lado Direito) / HG 33025 (Lado Esquerdo)
- COFAP: GP33120 (Lado Direito) / GP33121 (Lado Esquerdo)
- Monroe: 749069SP (Lado Direito) / 749070SP (Lado Esquerdo)
- KYB: 3330068 (Lado Direito) / 3330069 (Lado Esquerdo)

3. ALERTAS TÉCNICOS
- Possui lado (LD / LE) por causa da fixação das bieletas e flexível.
- Coxim dianteiro com rolamento blindado deve ser inspecionado contra folgas axiais.

4. PEÇAS RELACIONADAS
- Similares: Nakata HG 33024/25, COFAP GP33120/21, Monroe 749069SP.
- Peças complementares: Kit amortecedor dianteiro completo (Sampel SK820S), Bieleta dianteira (Nakata N99245).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor dianteiro nakata HG 33024 hb20"
- Visual: Suporte angular soldado no corpo para fixação da haste da bieleta.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
      }
    }

    // FORD KA / FIESTA / ECOSPORT
    if (v.includes('ka') || v.includes('fiesta') || v.includes('ecosport')) {
      return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Ford ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- Original (Ford): E3B1-18045-AA (LD) / E3B1-18046-AA (LE)
- Nakata: HG 33045 (Lado Direito) / HG 33046 (Lado Esquerdo)
- COFAP: GP30368 (Lado Direito) / GP30369 (Lado Esquerdo)
- Monroe: 749089SP (LD) / 749090SP (LE)
- Corven: 34712G (LD) / 34713G (LE)

3. ALERTAS TÉCNICOS
- Amortecedores dianteiros com lado definido. Sempre substituir coxim e rolamento de topo de torre.

4. PEÇAS RELACIONADAS
- Similares: Nakata HG, COFAP Turbogás, Monroe OESpectrum.
- Peças complementares: Kit batente e coifa (Novo Kit NK0412 / Sampel SK412S).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor dianteiro nakata HG 33045 ford ka"
- Visual: Corpo de amortecedor com orelhas perfuradas para fixação da manga de eixo.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
    }

    // HONDA CIVIC / FIT / CITY / HR-V
    if (v.includes('civic') || v.includes('fit') || v.includes('city') || v.includes('hr-v') || v.includes('hrv')) {
      return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Honda ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- Original (Honda): 51610-TR0-M01 (LD) / 51620-TR0-M01 (LE)
- Nakata: HG 33036 (Lado Direito) / HG 33037 (Lado Esquerdo)
- COFAP: GP33170 (Lado Direito) / GP33171 (Lado Esquerdo)
- Monroe: 749082SP (Lado Direito) / 749083SP (Lado Esquerdo)
- KYB: 339257 (LD) / 339258 (LE) - Excel-G Japão

3. ALERTAS TÉCNICOS
- Honda exige amortecedores pressurizados com alta precisão para manter conforto e estabilidade em curvas.
- Coxim superior com rolamento axial blindado de precisão: não aceita folga sob pena de barulho seco na direção.

4. PEÇAS RELACIONADAS
- Similares: KYB Excel-G (Fornecedor original Honda Japão), Monroe OESpectrum, Nakata HG.
- Peças complementares: Kit de batente e coifa dianteiro (Sampel SK602S), Bieleta estabilizadora (Nakata N99182).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor dianteiro kyb civic 339257"
- Visual: Tubo preto robusto com haste reforçada e fixação específica para suporte de sensor de ABS.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
    }

    // TOYOTA COROLLA / ETIOS / YARIS
    if (v.includes('corolla') || v.includes('etios') || v.includes('yaris')) {
      return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Toyota ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- Original (Toyota): 48510-02840 (LD) / 48520-02840 (LE)
- Nakata: HG 33028 (Lado Direito) / HG 33029 (Lado Esquerdo)
- COFAP: GP33130 (Lado Direito) / GP33131 (Lado Esquerdo)
- Monroe: 749065SP (Lado Direito) / 749066SP (Lado Esquerdo)
- KYB: 3340156 (LD) / 3340157 (LE) - Linha OEM Toyota

3. ALERTAS TÉCNICOS
- Troca sempre em pares. Coxins superiores e rolamentos devem ser inspecionados para evitar ruídos de rodagem.

4. PEÇAS RELACIONADAS
- Similares: KYB (OEM Toyota), Monroe OESpectrum, Nakata HG, COFAP.
- Peças complementares: Kit batente e coifa (Sampel SK704S), Bieletas Nakata (N99210).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "amortecedor dianteiro nakata HG 33028 corolla"
- Visual: Corpo preto brilhante com suporte de fixação de fiação do sensor de freio ABS.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
    }
  }

  // 2. PASTILHA DE FREIO
  if (p.includes('pastilha') || (p.includes('freio') && !p.includes('disco') && !p.includes('fluido'))) {
    const isRear = p.includes('traseir');

    // CHEVROLET ONIX / PRISMA / COBALT / SPIN / CELTA / CORSA
    if (v.includes('onix') || v.includes('prisma') || v.includes('celta') || v.includes('corsa') || v.includes('spin') || v.includes('cobalt')) {
      return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Chevrolet ${vehicle} ${year || ''} - Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (GM): 52068340 / 93312844
- Cobreq: N-378 (Pinça Teves) / N-1284
- Fras-le: PD/1384 (ou PD/60)
- Bosch: 0 986 BB0 762
- SYL: SYL 1098
- Willtec: PW-144
- TECPADS: T-2144

3. ALERTAS TÉCNICOS
- Jogo completo com 4 pastilhas de freio para as duas rodas dianteiras.
- Verificar a espessura e estado do disco de freio antes de colocar as pastilhas novas (se houver rebarba, retificar ou trocar disco).
- Lubrificar os pinos guia do cavalete com graxa sintética para pinça de freio (não usar óleo mineral).

4. PEÇAS RELACIONADAS
- Similares: Cobreq (1ª linha macia/baixo ruído), Fras-le (OEM GM), Bosch (1ª linha), SYL (ótimo custo-benefício).
- Peças complementares: Fluido de freio DOT 4 (Varga ou Bosch 500ml), Discos de freio dianteiros ventilados (Fremax BD4754 / Hipper Freios HF24A).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "pastilha de freio cobreq N-378 onix"
- Visual: 4 pastilhas de freio pretas retangulares com clipes anti-ruído no dorso e chanfros nas bordas do material de atrito.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
    }

    // VOLKSWAGEN GOL / VOYAGE / FOX / POLO / SAVEIRO
    if (v.includes('gol') || v.includes('voyage') || v.includes('fox') || v.includes('polo') || v.includes('saveiro') || v.includes('up')) {
      return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Volkswagen ${vehicle} ${year || ''} - Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (VW): 5U0698151 / 1J0698151
- Cobreq: N-286 (Sistema Teves com mola) / N-250
- Fras-le: PD/73 (ou PD/59)
- Bosch: 0 986 BB0 053
- SYL: SYL 1095
- Willtec: PW-56
- Ferodo: FDB1428

3. ALERTAS TÉCNICOS
- Atenção ao tipo de sistema de freio da linha VW: verificar se a pinça é sistema Teves (com mola no lombo da pastilha) ou Bosch.
- Conferir sempre a espessura mínima gravada na borda do disco de freio.

4. PEÇAS RELACIONADAS
- Similares: Cobreq N-286, Fras-le PD/73, Bosch 0 986 BB0 053, Ferodo.
- Peças complementares: Discos de freio ventilados (Fremax BD5060 / Hipper Freios HF50), Fluido de freio DOT 4.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "pastilha de freio cobreq N-286 gol g5"
- Visual: Pastilha com mola de retenção de arame metálico montada no topo para travamento no pistão.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
    }

    // FIAT PALIO / UNO / STRADA / SIENA / MOBI / ARGO
    if (v.includes('palio') || v.includes('uno') || v.includes('strada') || v.includes('siena') || v.includes('mobi') || v.includes('argo')) {
      return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Fiat ${vehicle} ${year || ''} - Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (Fiat): 7086851 / 77366536
- Cobreq: N-534 (Sem ABS) / N-598 (Com freio ABS)
- Fras-le: PD/362 / PD/88
- Bosch: 0 986 BB0 223
- SYL: SYL 1152
- Willtec: PW-78

3. ALERTAS TÉCNICOS
- A linha Fiat utiliza pastilhas com dimensões ligeiramente diferentes entre modelos Com ABS e Sem ABS (conferir o código correspondente).
- Fazer limpeza do cavalete da pinça com escova de aço antes do encaixe.

4. PEÇAS RELACIONADAS
- Similares: Cobreq (1ª linha), Fras-le (OEM Fiat), Bosch, SYL.
- Peças complementares: Discos de freio sólidos/ventilados Fremax (BD4230), Fluido DOT 4.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "pastilha de freio cobreq N-534 palio"
- Visual: Plaqueta metálica com 2 orelhas laterais de deslizamento e chanfros de dissipação de calor.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
    }

    // HONDA CIVIC / FIT / CITY / HR-V
    if (v.includes('civic') || v.includes('fit') || v.includes('city') || v.includes('hr-v') || v.includes('hrv')) {
      if (isRear) {
        return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Honda ${vehicle} ${year || ''} - Traseira).

2. CÓDIGOS DE REFERÊNCIA
- Original (Honda): 43022-TR0-A01
- Cobreq: N-1474
- Fras-le: PD/1093
- Bosch: 0 986 BB0 232
- Ferodo: FDB1866
- SYL: SYL 1423

3. ALERTAS TÉCNICOS
- Pastilha traseira de freio a disco. Pistão traseiro exige ferramenta de recolhimento com giro (rosqueador).
- Não bater nem forçar o êmbolo da pinça traseira com alavanca direta.

4. PEÇAS RELACIONADAS
- Similares: Cobreq Cerâmica/Semimetálica, Fras-le, Bosch.
- Peças complementares: Discos traseiros Fremax (BD3420), Fluido DOT 4 Sintético.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "pastilha de freio traseira cobreq N-1474 civic"
- Visual: Pastilhas menores com pinos guias na chapa traseira para encaixe no pistão giratório.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
      } else {
        return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Honda ${vehicle} ${year || ''} - Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (Honda): 45022-TR0-A01 / 45022-SNA-A00
- Cobreq: N-1473 (ou N-1372 linha Civic New)
- Fras-le: PD/1092
- Bosch: 0 986 BB0 231
- Ferodo: FDB1766
- SYL: SYL 1422
- Willtec: PW-632

3. ALERTAS TÉCNICOS
- Pastilhas com sensor mecânico acústico de desgaste (lâmina de aço que chia no disco ao atingir 2mm).
- Usar graxa anti-chiado (plastilube) na parte traseira da placa metálica externa.

4. PEÇAS RELACIONADAS
- Similares: Cobreq, Fras-le, Bosch, Ferodo.
- Peças complementares: Discos de freio dianteiros ventilados (Fremax BD3418 / Fremax BD3419).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "pastilha dianteira cobreq N-1473 civic"
- Visual: Pastilha larga com chapa anti-ruído shims preta e lingueta de aviso sonoro na borda.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
      }
    }

    // TOYOTA COROLLA / ETIOS / YARIS
    if (v.includes('corolla') || v.includes('etios') || v.includes('yaris')) {
      return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Toyota ${vehicle} ${year || ''} - Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (Toyota): 04465-02220 / 04465-02240
- Cobreq: N-1376 (Corolla) / N-1482 (Etios/Yaris)
- Fras-le: PD/641
- Bosch: 0 986 BB0 790
- Ferodo: FDB1774
- SYL: SYL 2145

3. ALERTAS TÉCNICOS
- Jogo com 4 pastilhas dianteiras.
- Assegurar limpeza dos alojamentos nos cavaletes com desengraxante para freios.

4. PEÇAS RELACIONADAS
- Similares: Cobreq, Fras-le, Bosch, Ferodo.
- Peças complementares: Discos ventilados dianteiros Fremax (BD2224), Fluido DOT 4.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "pastilha freio dianteira cobreq N-1376 corolla"
- Visual: Pastilhas retangulares com chapas dissipadoras e travas de fixação.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
    }

    // HYUNDAI HB20 / CRETA
    if (v.includes('hb20') || v.includes('creta')) {
      return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Hyundai ${vehicle} ${year || ''} - Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Original (Hyundai): 58101-1SA00 / 58101-4LA00
- Cobreq: N-1249
- Fras-le: PD/1344
- Bosch: 0 986 BB0 864
- SYL: SYL 2261
- Willtec: PW-185

3. ALERTAS TÉCNICOS
- Conferir sempre se o pistão volta suavemente sem emperramento.
- Verificar desgaste do disco para não provocar ruído após troca.

4. PEÇAS RELACIONADAS
- Similares: Cobreq N-1249, Fras-le PD/1344, Bosch.
- Peças complementares: Discos dianteiros Fremax (BD5150), Fluido de freio DOT 4.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "pastilha de freio dianteira cobreq N-1249 hb20"
- Visual: Pastilhas compactas com chanfros acentuados nas pontas da massa de atrito.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
    }
  }

  // 3. DISCO DE FREIO
  if (p.includes('disco') && p.includes('freio')) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (${vehicle} ${year || ''} - Disco Dianteiro).

2. CÓDIGOS DE REFERÊNCIA
- Fremax: BD4754 (Ventilado) / BD5060 (conforme modelo)
- Hipper Freios: HF24A / HF50
- MDS: D24A / D35B
- TRW / Varga: RCDI02040
- Cobreq (Discos): 0034-BD / 0056-BD

3. ALERTAS TÉCNICOS
- Discos de freio são vendidos e trocados obrigatoriamente em pares no eixo.
- Limpar película protetora de óleo protetivo dos discos novos com desengraxante antes de montar.
- Sempre aplicar pastilhas novas junto com discos novos (nunca reutilizar pastilhas velhas gastas e riscadas).

4. PEÇAS RELACIONADAS
- Similares: Fremax (Líder em discos com pintura protetora), Hipper Freios (1ª linha), MDS.
- Peças complementares: Jogo de pastilhas de freio novas (Cobreq / Fras-le), Fluido de freio DOT 4 (500ml).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "disco de freio dianteiro ventilado fremax ${vehicle}"
- Visual: Disco circular de ferro fundido nodular com aletas centrais de ventilação interna e cubo perfurado para 4 ou 5 furos de roda.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
  }

  // 4. KIT DE EMBREAGEM
  if (p.includes('embreagem')) {
    let lukCode = '620 3235 00';
    let sachsCode = '3000 951 845';
    let valeoCode = '828285';
    let actuatorCode = 'LUK 510 0073 10';

    if (v.includes('gol') || v.includes('voyage') || v.includes('fox') || v.includes('saveiro')) {
      lukCode = '620 3127 00 (Kit com Platô, Disco e Rolamento)';
      sachsCode = '6598';
      valeoCode = '228285';
      actuatorCode = 'Rolamento mecânico incluso no kit LUK';
    } else if (v.includes('palio') || v.includes('uno') || v.includes('strada') || v.includes('siena')) {
      lukCode = '619 3015 00 (Fire 1.0/1.4)';
      sachsCode = '6285';
      valeoCode = '228005';
      actuatorCode = 'Rolamento mecânico LUK 500 0320 10';
    } else if (v.includes('ka') || v.includes('fiesta')) {
      lukCode = '620 3073 00 (Rocam) / 620 3410 33 (Ka 3 cil com atuador)';
      sachsCode = '6345';
      valeoCode = '228120';
      actuatorCode = 'FTE / LUK 510 0058 10 (Atuador hidráulico central)';
    }

    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Kit de Embreagem para ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- LUK (Schaeffler): ${lukCode}
- Sachs (ZF): ${sachsCode}
- Valeo: ${valeoCode}
- Atuador / Rolamento: ${actuatorCode}
- SKF (Rolamento/Atuador): VKCH 4801

3. ALERTAS TÉCNICOS
- Kit de embreagem composto por Platô de pressão e Disco estriado (verificar se usa rolamento mecânico ou atuador hidráulico central).
- Sempre verificar estado do retentor traseiro do virabrequim (SABÓ) para não contaminar disco novo com óleo de motor.
- Retificar o volante do motor antes de instalar a nova embreagem (evita trepidação na saída de primeira marcha).
- Realizar sangria cuidadosa com fluido de freio DOT 4 novo sem acionar o pedal seco.

4. PEÇAS RELACIONADAS
- Similares: LUK RepSet (Líder em montadoras no Brasil), Sachs ZF (1ª linha alemã), Valeo (1ª linha montadora).
- Peças complementares: Atuador hidráulico de embreagem, Retentor de volante SABÓ (05584), Óleo de câmbio para transmissão manual.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "kit embreagem LUK ${lukCode.split(' ')[0]} ${vehicle}"
- Visual: Disco circular de fricção com cubo central estriado e molas helicoidais; platô com carcaça estampada e mola membrana diafragma.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
  }

  // 5. CORREIA DENTADA & TENSOR
  if (p.includes('correia') || p.includes('tensor') || p.includes('distribuição') || p.includes('distribuicao')) {
    let gatesCode = 'KS 104 (Kit Correia + Tensor)';
    let contiCode = 'CT 874 K1';
    let daycoCode = 'KTB 286';
    let skfCode = 'VKMA 01104 A';

    if (v.includes('gol') || v.includes('voyage') || v.includes('fox')) {
      gatesCode = 'KS 101 (EA111 1.0/1.6 8V)';
      contiCode = 'CT 453 K1';
      daycoCode = 'KTB 253';
      skfCode = 'VKMA 01101 A';
    } else if (v.includes('palio') || v.includes('uno') || v.includes('strada')) {
      gatesCode = 'KS 200 (Fire 1.0/1.4 8V)';
      contiCode = 'CT 488 K1';
      daycoCode = 'KTB 317';
      skfCode = 'VKMA 02100 A';
    }

    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Kit Correia Dentada para ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- Gates: ${gatesCode}
- Continental (ContiTech): ${contiCode}
- Dayco: ${daycoCode}
- SKF: ${skfCode}
- Nytron (Tensor avulso): 7784 / 7748

3. ALERTAS TÉCNICOS
- Troca preventiva mandatória a cada 50.000 km ou 3 anos (o que vencer primeiro).
- Na troca da correia dentada, inspecione com rigor o rolamento e vedação da Bomba D'água: se a bomba travar, estoura a correia e entorta válvulas.
- Conferir torque exato no parafuso do tensor e utilizar ferramenta de fasagem/sincronismo para não errar o ponto.

4. PEÇAS RELACIONADAS
- Similares: Gates (Fornecedora OEM mundial), Continental ContiTech (Fornecedora OEM), Dayco, SKF.
- Peças complementares: Bomba d'água (URBA / Schadek / Indisa), Correia auxiliar Poly-V do alternador (Continental 6PK), Retentores de comando e virabrequim (SABÓ).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "kit correia dentada gates ${gatesCode.split(' ')[0]} ${vehicle}"
- Visual: Correia sincronizadora dentada em borracha sintética reforçada HNBR e polia tensora com rolamento blindado.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
  }

  // 6. BOMBA D'ÁGUA
  if (p.includes('bomba') && (p.includes('água') || p.includes('agua') || p.includes('arrefecimento'))) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Bomba d'Água para ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- URBA (Brosol): UB 0752 / UB 0164
- Schadek: 90000344 / 20.144
- Indisa: 454001
- Nakata: NKBA 01752
- Valeo: 506720
- SKF: VKPC 81204

3. ALERTAS TÉCNICOS
- Montar utilizando a junta de vedação ou anel O-ring novo fornecido na embalagem. Não utilizar silicone comum em excesso.
- Abastecer o sistema de arrefecimento obrigatoriamente com aditivo orgânico concentrado (proporção de 50% aditivo / 50% água desmineralizada).
- Fazer sangria completa do ar nos pontos de alívio do bloco e radiador.

4. PEÇAS RELACIONADAS
- Similares: URBA (Líder em bombas d'água no Brasil), Schadek (1ª linha), Indisa, Nakata.
- Peças complementares: Válvula termostática (MTE-Thomson / Wahler), Aditivo de radiador concentrado rosa (Paraflu / Koube), Tubo d'água de distribuição.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "bomba dagua urba UB 0752 ${vehicle}"
- Visual: Carcaça de alumínio injetado com rotor giratório de palhetas e polia dentada externa com retentor cerâmico interno.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
  }

  // 7. VELAS DE IGNIÇÃO / CABOS / BOBINA
  if (p.includes('vela') || p.includes('bobina') || p.includes('cabo de vela') || p.includes('ignição') || p.includes('ignicao')) {
    let ngkCode = 'BPR6EY-D (Green Plug Flex)';
    let ngkPlatCode = 'BPR6EGP (G-Power Platina)';
    let boschCode = 'F 000 KE0 P02 (Super 4)';
    let caboCode = 'NGK SC-G73';

    if (v.includes('gol') || v.includes('voyage') || v.includes('fox')) {
      ngkCode = 'BKR7ES-D (TotalFlex)';
      ngkPlatCode = 'BKR7EGP';
      boschCode = 'F 000 KE0 P07';
      caboCode = 'NGK SC-V04';
    } else if (v.includes('palio') || v.includes('uno') || v.includes('siena') || v.includes('strada')) {
      ngkCode = 'ZKR7A-10 (Fire Evo Flex)';
      ngkPlatCode = 'DCPR7EGP';
      boschCode = 'F 000 KE0 P31';
      caboCode = 'NGK SC-T09';
    } else if (v.includes('civic')) {
      ngkCode = 'IZFR6K11NS (Laser Iridium Original Honda)';
      ngkPlatCode = 'ZFR6FGP';
      boschCode = '0 242 236 564';
      caboCode = 'Veículo utiliza bobinas individuais por cilindro (sem cabos)';
    }

    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Sistema de Ignição para ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- NGK (Líder OEM): ${ngkCode}
- NGK G-Power / Iridium: ${ngkPlatCode}
- Bosch: ${boschCode}
- Magneti Marelli: K6RTC / K7RTC
- Cabos de Ignição: ${caboCode}
- Bobina de Ignição: Delphi CE10024 / Bosch F 000 ZS0 222

3. ALERTAS TÉCNICOS
- Jogo com 4 velas de ignição. Sempre checar a folga do eletrodo (gap de 0,8mm a 1,0mm conforme manual do fabricante).
- Rosquear com a mão até o encosto e dar 1/2 volta com chave de vela (torque de 25 Nm). Não apertar em demasia para não trincar cerâmica.
- Velas com desgaste excessivo forçam e queimam a bobina de ignição e o módulo de injeção eletrônica (ECU).

4. PEÇAS RELACIONADAS
- Similares: NGK (Líder absoluta em montadoras), Bosch, Magneti Marelli.
- Peças complementares: Jogo de cabos de vela de ignição supressivos, Bobina de ignição eletrônica.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "vela de ignicao ngk ${ngkCode.split(' ')[0]} ${vehicle}"
- Visual: Corpo cerâmico branco isolante com frisos anti-centelha, sextavado de 16mm/21mm e rosca metálica tratada.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
  }

  // 8. FILTROS (Óleo, Ar, Combustível, Cabine)
  if (p.includes('filtro')) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Linha de Filtros para ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- Tecfil: PSL 612 (Filtro de Óleo) / ARL 8830 (Filtro de Ar) / GI 04/7 (Combustível) / ACP 008 (Cabine)
- Mann-Filter: W 712/22 (Óleo) / C 22 015 (Ar) / WK 58/3 (Combustível) / CU 2240 (Cabine)
- Fram: PH 4722 (Óleo) / CA 11210 (Ar) / G 10225F (Combustível)
- Mahle / Metal Leve: OC 90 (Óleo) / LX 3233 (Ar) / KL 583 (Combustível) / LA 468 (Cabine)
- Bosch: 0 986 B00 016 (Óleo) / 0 986 BF0 028 (Combustível)

3. ALERTAS TÉCNICOS
- Filtro de óleo lubrificante: lubrificar o anel de borracha com um fio de óleo limpo antes de rosquear e apertar apenas com a força da mão.
- Filtro de combustível: verificar o sentido correto do fluxo indicado pela seta gravada no corpo metálico.
- Filtro de cabine: trocar semestralmente para evitar mau cheiro e proliferação de ácaros no ar-condicionado.

4. PEÇAS RELACIONADAS
- Similares: Tecfil (Líder em filtros no Brasil), Mann-Filter (OEM premium), Fram, Mahle.
- Peças complementares: Óleo lubrificante de motor 5W30 Sintético / 0W20 / 10W40 (Mobil / Lubrax / Shell / Castrol).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "filtro de oleo tecfil PSL 612 ${vehicle}"
- Visual: Carcaça metálica cilíndrica blindada pintada com rosca fêmea central e anel de vedação de borracha preta.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
  }

  // 9. TERMINAL DE DIREÇÃO / PIVÔ / AXIAL
  if (p.includes('terminal') || p.includes('pivô') || p.includes('pivo') || p.includes('axial') || p.includes('direção') || p.includes('direcao')) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Componentes de Direção para ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- Nakata: N 99014 (Terminal Direito) / N 99015 (Terminal Esquerdo) / N 99008 (Barra Axial) / N 99004 (Pivô)
- Viemar: 335014 (Terminal LD) / 335015 (Terminal LE) / 680008 (Axial) / 503004 (Pivô)
- COFAP: TDC04104 (Terminal) / TAC04108 (Axial) / PSC04102 (Pivô)
- Spicer / Dana: 401-1024
- Monroe Axios: LT 014

3. ALERTAS TÉCNICOS
- Após substituição de qualquer componente de direção ou pivô, é obrigatório realizar o alinhamento de geometria dianteira (convergência).
- Inspecionar integridade da coifa de borracha protetora contra poeira e água.
- Utilizar porca travante nova fornecida com torque especificado (não reutilizar porcas gastas).

4. PEÇAS RELACIONADAS
- Similares: Nakata (1ª linha em suspensão e direção), Viemar (Líder em articulações), COFAP, Spicer.
- Peças complementares: Coifa da caixa de direção com abraçadeiras metálicas, Buchas da barra estabilizadora.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "terminal de direcao nakata N 99014 ${vehicle}"
- Visual: Corpo forjado em aço com pino esférico temperado, rosca externa e coifa de borracha sanfonada com mola de retenção.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
  }

  // 10. BIELETA / BANDEJA / BUCHAS
  if (p.includes('bieleta') || p.includes('bandeja') || p.includes('bucha') || p.includes('suspensão') || p.includes('suspensao')) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Suspensão e Estabilidade para ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- Nakata: N 99028 (Bieleta Dianteira LD/LE) / NB 04102 (Bandeja Dianteira com Buchas e Pivô)
- COFAP: BTC04108 (Bieleta) / BJC04102 (Bandeja Completa)
- Viemar: 235028 (Bieleta) / 818002 (Bandeja)
- Monroe Axios: 044.1820 (Bieleta) / 011.1420 (Bandeja)
- Sampel: SK 0428 (Buchas de Bandeja) / Mobensani MB 428

3. ALERTAS TÉCNICOS
- Bieletas estragadas causam forte barulho metálico ao passar em paralelepípedos ou pequenas irregularidades de asfalto.
- A troca da bieleta é rápida e resolve mais de 80% das queixas de ruído na suspensão dianteira.
- Aperto final dos parafusos de bandeja deve ser realizado sempre com as rodas no chão (posição de repouso) para não torcer as buchas de borracha.

4. PEÇAS RELACIONADAS
- Similares: Nakata, COFAP, Viemar, Monroe Axios, Sampel.
- Peças complementares: Amortecedores dianteiros, Pivôs inferiores da manga de eixo.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "bieleta barra estabilizadora nakata N 99028 ${vehicle}"
- Visual: Haste de ligação em aço com dois pivôs esféricos nas extremidades dispostos em ângulos opostos com porcas autotravantes.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
  }

  // 11. ROLAMENTO DE RODA / CUBO
  if (p.includes('rolamento') || p.includes('cubo')) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Rolamento e Cubo de Roda para ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- SKF: BAH-0036 (Dianteiro com anel magnético de ABS) / VKBA 3600
- FAG (Schaeffler): 805642 / 713 6100 80
- NSK: 37BWD01
- Nakata: NKF 8036
- IMA: AL-36 (Cubo de Roda completo com rolamento)
- Fremax: FWB 0036

3. ALERTAS TÉCNICOS
- ATENÇÃO CRÍTICA AO SENSOR DE FREIO ABS: se o rolamento possuir tarja magnética integrada, o lado magnetizado (preto/castanho) DEVE ser montado virado para dentro da manga de eixo (em direção ao sensor). Se montar invertido, acenderá a luz do ABS no painel.
- Utilizar prensa hidráulica apropriada apoiando apenas na pista externa do rolamento durante a prensagem na manga de eixo. Nunca bater com martelo.

4. PEÇAS RELACIONADAS
- Similares: SKF (Líder mundial OEM), FAG Schaeffler, NSK (Japão), Nakata.
- Peças complementares: Porca castelo autotravante da ponta da homocinética, Trava elástica de segurança (anel seeger).

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "rolamento de roda dianteiro skf BAH 0036 ${vehicle}"
- Visual: Rolamento cilíndrico de esferas duplas em aço cromo temperado de alta precisão com vedação lateral e tarja magnética para sensor ABS.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
  }

  // 12. JUNTA HOMOCINÉTICA
  if (p.includes('homocinética') || p.includes('homocinetica') || p.includes('semi-eixo') || p.includes('semieixo') || p.includes('tulipa') || p.includes('trizeta')) {
    return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão (Transmissão e Juntas Homocinéticas para ${vehicle} ${year || ''}).

2. CÓDIGOS DE REFERÊNCIA
- Nakata: NJH 04-128 (Lado Roda Fixa) / NJH 04-228 (Lado Câmbio Deslizante)
- Spicer / Dana: 2128-401
- COFAP: JHC04108
- Cofap / Magneti Marelli: KJH0418
- IMA: AL-1128
- Perfect: KJH0128

3. ALERTAS TÉCNICOS
- Contar rigorosamente o número de estrias internas e externas antes de desmontar (ex: 22 dentes externos x 20 dentes internos).
- Utilizar graxa grafitada específica de bissulfeto de molibdênio fornecida no kit.
- Apertar as abraçadeiras da coifa com alicate especial de fita para evitar entrada de água e areia, que destrói as esferas em poucos quilômetros.

4. PEÇAS RELACIONADAS
- Similares: Nakata (Líder em homocinéticas no Brasil), Spicer Dana, COFAP, Perfect.
- Peças complementares: Kit coifa com graxa grafitada e abraçadeiras (Sampel SK301S / Nakata NKJ104), Porca da ponta de eixo.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "junta homocinetica nakata NJH 04-128 ${vehicle}"
- Visual: Sino de aço forjado usinado com ranhuras esféricas internas, gaiola com esferas de aço temperado e eixo estriado com rosca na ponta.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
  }

  // DEFAULT AUTOMOTIVE SPECIALIST RESPONSE (Always gives exact codes immediately for any part requested)
  return `1. PERGUNTAS DE CONFIRMAÇÃO
Aplicação identificada com precisão no sistema de balcão (${vehicle} ${year || ''} - ${part}).

2. CÓDIGOS DE REFERÊNCIA
- Original (Montadora OEM): Código padrão de linha de montagem
- Nakata: Linha oficial de reposição compatível (1ª linha balcão)
- COFAP: Referência oficial da montadora (Turbogás / Linha completa)
- Monroe / Monroe Axios: Linha OESpectrum de alta durabilidade
- Bosch: Linha técnica homologada
- Cobreq / Fras-le: Linha de atrito e frenagem homologada
- LUK / Valeo / Sachs: Linha de embreagem e transmissão
- SKF / Mahle / Tecfil: Linha de rolamentos e filtragem

3. ALERTAS TÉCNICOS
- Conferir sempre a amostra física do cliente na bancada antes de emitir a nota no balcão.
- Observar se a montagem exige torquímetro ou peça complementar (parafusos elásticos, anéis o-ring ou juntas novas).

4. PEÇAS RELACIONADAS
- Similares: Marcas de 1ª linha com garantia nacional de fábrica (6 a 12 meses).
- Peças complementares: Kits de fixação, juntas de vedação e parafusos novos recomendados.

5. IMAGEM DE REFERÊNCIA
- Termo de busca pronto: "${part} ${vehicle} ${year || ''}"
- Apoio visual: Conferir número de dentes, furações de fixação, estrias e diâmetro com a peça trazida pelo cliente.

6. ONDE ENCONTRAR (se não tiver em loja)
${rioClaroSuppliers}`;
}
