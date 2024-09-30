import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@admin.com',
        password:
          '$2b$10$lHABerpP336x80qVz.ikiOLqI0JPkQpbCP9sUB5u45CZtyZ5Xe5WC',
        name: 'Admin',
        role: Role.ADMIN,
      },
    ],
  });
  await prisma.bank.createMany({
    data: [
      {
        ispb: 0,
        code: 1,
        name: 'BCO DO BRASIL S.A.',
        fullName: 'Banco do Brasil S.A.',
      },
      {
        ispb: 208,
        code: 70,
        name: 'BRB - BCO DE BRASILIA S.A.',
        fullName: 'BRB - BANCO DE BRASILIA S.A.',
      },
      //   {
      //     ispb: 38121,
      //     code: NaN,
      //     name: 'Selic',
      //     fullName: 'Banco Central do Brasil - Selic',
      //   },
      //   {
      //     ispb: 38166,
      //     code: NaN,
      //     name: 'Bacen',
      //     fullName: 'Banco Central do Brasil',
      //   },
      {
        ispb: 122327,
        code: 539,
        name: 'SANTINVEST S.A. - CFI',
        fullName: 'SANTINVEST S.A. - CREDITO, FINANCIAMENTO E INVESTIMENTOS',
      },
      {
        ispb: 204963,
        code: 430,
        name: 'CCR SEARA',
        fullName: 'COOPERATIVA DE CREDITO RURAL SEARA - CREDISEARA',
      },
      {
        ispb: 250699,
        code: 272,
        name: 'AGK CC S.A.',
        fullName: 'AGK CORRETORA DE CAMBIO S.A.',
      },
      {
        ispb: 315557,
        code: 136,
        name: 'CONF NAC COOP CENTRAIS UNICRED',
        fullName:
          'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS UNICRED LTDA. - UNICRED DO BRASI',
      },
      {
        ispb: 329598,
        code: 407,
        name: 'ÍNDIGO INVESTIMENTOS DTVM LTDA.',
        fullName:
          'ÍNDIGO INVESTIMENTOS DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.',
      },
      {
        ispb: 360305,
        code: 104,
        name: 'CAIXA ECONOMICA FEDERAL',
        fullName: 'CAIXA ECONOMICA FEDERAL',
      },
      //   {
      //     ispb: 394460,
      //     code: NaN,
      //     name: 'STN',
      //     fullName: 'Secretaria do Tesouro Nacional - STN',
      //   },
      {
        ispb: 416968,
        code: 77,
        name: 'BANCO INTER',
        fullName: 'Banco Inter S.A.',
      },
      {
        ispb: 460065,
        code: 423,
        name: 'COLUNA S.A. DTVM',
        fullName: 'COLUNA S/A DISTRIBUIDORA DE TITULOS E VALORES MOBILIÁRIOS',
      },
      {
        ispb: 517645,
        code: 741,
        name: 'BCO RIBEIRAO PRETO S.A.',
        fullName: 'BANCO RIBEIRAO PRETO S.A.',
      },
      {
        ispb: 556603,
        code: 330,
        name: 'BANCO BARI S.A.',
        fullName: 'BANCO BARI DE INVESTIMENTOS E FINANCIAMENTOS S.A.',
      },
      {
        ispb: 558456,
        code: 739,
        name: 'BCO CETELEM S.A.',
        fullName: 'Banco Cetelem S.A.',
      },
      {
        ispb: 714671,
        code: 534,
        name: 'EWALLY IP S.A.',
        fullName: 'EWALLY INSTITUIÇÃO DE PAGAMENTO S.A.',
      },
      {
        ispb: 795423,
        code: 743,
        name: 'BANCO SEMEAR',
        fullName: 'Banco Semear S.A.',
      },
      {
        ispb: 806535,
        code: 100,
        name: 'PLANNER CV S.A.',
        fullName: 'Planner Corretora de Valores S.A.',
      },
      {
        ispb: 954288,
        code: 541,
        name: 'FDO GARANTIDOR CRÉDITOS',
        fullName: 'FUNDO GARANTIDOR DE CREDITOS - FGC',
      },
      {
        ispb: 997185,
        code: 96,
        name: 'BCO B3 S.A.',
        fullName: 'Banco B3 S.A.',
      },
      {
        ispb: 1023570,
        code: 747,
        name: 'BCO RABOBANK INTL BRASIL S.A.',
        fullName: 'Banco Rabobank International Brasil S.A.',
      },
      {
        ispb: 1027058,
        code: 362,
        name: 'CIELO IP S.A.',
        fullName: 'CIELO S.A. - INSTITUIÇÃO DE PAGAMENTO',
      },
      {
        ispb: 1073966,
        code: 322,
        name: 'CCR DE ABELARDO LUZ',
        fullName:
          'Cooperativa de Crédito Rural de Abelardo Luz - Sulcredi/Crediluz',
      },
      {
        ispb: 1181521,
        code: 748,
        name: 'BCO COOPERATIVO SICREDI S.A.',
        fullName: 'BANCO COOPERATIVO SICREDI S.A.',
      },
      {
        ispb: 1330387,
        code: 350,
        name: 'CREHNOR LARANJEIRAS',
        fullName:
          'COOPERATIVA DE CRÉDITO RURAL DE PEQUENOS AGRICULTORES E DA REFORMA AGRÁRIA DO CE',
      },
      {
        ispb: 1522368,
        code: 752,
        name: 'BCO BNP PARIBAS BRASIL S A',
        fullName: 'Banco BNP Paribas Brasil S.A.',
      },
      {
        ispb: 1658426,
        code: 379,
        name: 'CECM COOPERFORTE',
        fullName:
          'COOPERFORTE - COOPERATIVA DE ECONOMIA E CRÉDITO MÚTUO DE FUNCIONÁRIOS DE INSTITU',
      },
      {
        ispb: 1701201,
        code: 399,
        name: 'KIRTON BANK',
        fullName: 'Kirton Bank S.A. - Banco Múltiplo',
      },
      {
        ispb: 1852137,
        code: 378,
        name: 'BCO BRASILEIRO DE CRÉDITO S.A.',
        fullName: 'BANCO BRASILEIRO DE CRÉDITO SOCIEDADE ANÔNIMA',
      },
      {
        ispb: 1858774,
        code: 413,
        name: 'BCO BV S.A.',
        fullName: 'BANCO BV S.A.',
      },
      {
        ispb: 2038232,
        code: 756,
        name: 'BANCO SICOOB S.A.',
        fullName: 'BANCO COOPERATIVO SICOOB S.A. - BANCO SICOOB',
      },
      {
        ispb: 2276653,
        code: 360,
        name: 'TRINUS CAPITAL DTVM',
        fullName:
          'TRINUS CAPITAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 2318507,
        code: 757,
        name: 'BCO KEB HANA DO BRASIL S.A.',
        fullName: 'BANCO KEB HANA DO BRASIL S.A.',
      },
      {
        ispb: 2332886,
        code: 102,
        name: 'XP INVESTIMENTOS CCTVM S/A',
        fullName:
          'XP INVESTIMENTOS CORRETORA DE CÂMBIO,TÍTULOS E VALORES MOBILIÁRIOS S/A',
      },
      {
        ispb: 2398976,
        code: 84,
        name: 'SISPRIME DO BRASIL - COOP',
        fullName: 'SISPRIME DO BRASIL - COOPERATIVA DE CRÉDITO',
      },
      {
        ispb: 2685483,
        code: 180,
        name: 'CM CAPITAL MARKETS CCTVM LTDA',
        fullName:
          'CM CAPITAL MARKETS CORRETORA DE CÂMBIO, TÍTULOS E VALORES MOBILIÁRIOS LTDA',
      },
      {
        ispb: 2801938,
        code: 66,
        name: 'BCO MORGAN STANLEY S.A.',
        fullName: 'BANCO MORGAN STANLEY S.A.',
      },
      {
        ispb: 2819125,
        code: 15,
        name: 'UBS BRASIL CCTVM S.A.',
        fullName:
          'UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A.',
      },
      {
        ispb: 2992317,
        code: 143,
        name: 'TREVISO CC S.A.',
        fullName: 'Treviso Corretora de Câmbio S.A.',
      },
      //   { ispb: 2992335, code: NaN, name: 'CIP SA Siloc', fullName: 'CIP S.A' },
      {
        ispb: 3012230,
        code: 62,
        name: 'HIPERCARD BM S.A.',
        fullName: 'Hipercard Banco Múltiplo S.A.',
      },
      {
        ispb: 3017677,
        code: 74,
        name: 'BCO. J.SAFRA S.A.',
        fullName: 'Banco J. Safra S.A.',
      },
      {
        ispb: 3046391,
        code: 99,
        name: 'UNIPRIME COOPCENTRAL LTDA.',
        fullName:
          'UNIPRIME CENTRAL NACIONAL - CENTRAL NACIONAL DE COOPERATIVA DE CREDITO',
      },
      {
        ispb: 3215790,
        code: 387,
        name: 'BCO TOYOTA DO BRASIL S.A.',
        fullName: 'Banco Toyota do Brasil S.A.',
      },
      {
        ispb: 3311443,
        code: 326,
        name: 'PARATI - CFI S.A.',
        fullName: 'PARATI - CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.',
      },
      {
        ispb: 3323840,
        code: 25,
        name: 'BCO ALFA S.A.',
        fullName: 'Banco Alfa S.A.',
      },
      {
        ispb: 3532415,
        code: 75,
        name: 'BCO ABN AMRO S.A.',
        fullName: 'Banco ABN Amro S.A.',
      },
      {
        ispb: 3609817,
        code: 40,
        name: 'BCO CARGILL S.A.',
        fullName: 'Banco Cargill S.A.',
      },
      {
        ispb: 3751794,
        code: 307,
        name: 'TERRA INVESTIMENTOS DTVM',
        fullName:
          'Terra Investimentos Distribuidora de Títulos e Valores Mobiliários Ltda.',
      },
      {
        ispb: 3844699,
        code: 385,
        name: 'CECM DOS TRAB.PORT. DA G.VITOR',
        fullName:
          'COOPERATIVA DE ECONOMIA E CREDITO MUTUO DOS TRABALHADORES PORTUARIOS DA GRANDE V',
      },
      {
        ispb: 3881423,
        code: 425,
        name: 'SOCINAL S.A. CFI',
        fullName: 'SOCINAL S.A. - CRÉDITO, FINANCIAMENTO E INVESTIMENTO',
      },
      {
        ispb: 3973814,
        code: 190,
        name: 'SERVICOOP',
        fullName:
          'SERVICOOP - COOPERATIVA DE CRÉDITO DOS SERVIDORES PÚBLICOS ESTADUAIS E MUNICIPAI',
      },
      {
        ispb: 4062902,
        code: 296,
        name: 'OZ CORRETORA DE CÂMBIO S.A.',
        fullName: 'OZ CORRETORA DE CÂMBIO S.A.',
      },
      {
        ispb: 4184779,
        code: 63,
        name: 'BANCO BRADESCARD',
        fullName: 'Banco Bradescard S.A.',
      },
      {
        ispb: 4257795,
        code: 191,
        name: 'NOVA FUTURA CTVM LTDA.',
        fullName:
          'Nova Futura Corretora de Títulos e Valores Mobiliários Ltda.',
      },
      {
        ispb: 4307598,
        code: 382,
        name: 'FIDUCIA SCMEPP LTDA',
        fullName:
          'FIDÚCIA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE L',
      },
      {
        ispb: 4332281,
        code: 64,
        name: 'GOLDMAN SACHS DO BRASIL BM S.A',
        fullName: 'GOLDMAN SACHS DO BRASIL BANCO MULTIPLO S.A.',
      },
      //   {
      //     ispb: 4391007,
      //     code: NaN,
      //     name: 'CAMARA INTERBANCARIA DE PAGAMENTOS - CIP',
      //     fullName: 'CIP S.A',
      //   },
      {
        ispb: 4546162,
        code: 459,
        name: 'CCM SERV. PÚBLICOS SP',
        fullName:
          'COOPERATIVA DE CRÉDITO MÚTUO DE SERVIDORES PÚBLICOS DO ESTADO DE SÃO PAULO - CRE',
      },
      {
        ispb: 4632856,
        code: 97,
        name: 'CREDISIS CENTRAL DE COOPERATIVAS DE CRÉDITO LTDA.',
        fullName: 'Credisis - Central de Cooperativas de Crédito Ltda.',
      },
      {
        ispb: 4715685,
        code: 16,
        name: 'CCM DESP TRÂNS SC E RS',
        fullName:
          'COOPERATIVA DE CRÉDITO MÚTUO DOS DESPACHANTES DE TRÂNSITO DE SANTA CATARINA E RI',
      },
      {
        ispb: 4814563,
        code: 299,
        name: 'BCO AFINZ S.A. - BM',
        fullName: 'BANCO AFINZ S.A. - BANCO MÚLTIPLO',
      },
      {
        ispb: 4831810,
        code: 471,
        name: 'CECM SERV PUBL PINHÃO',
        fullName:
          'COOPERATIVA DE ECONOMIA E CREDITO MUTUO DOS SERVIDORES PUBLICOS DE PINHÃO - CRES',
      },
      {
        ispb: 4862600,
        code: 468,
        name: 'PORTOSEG S.A. CFI',
        fullName: 'PORTOSEG S.A. - CREDITO, FINANCIAMENTO E INVESTIMENTO',
      },
      {
        ispb: 4866275,
        code: 12,
        name: 'BANCO INBURSA',
        fullName: 'Banco Inbursa S.A.',
      },
      {
        ispb: 4902979,
        code: 3,
        name: 'BCO DA AMAZONIA S.A.',
        fullName: 'BANCO DA AMAZONIA S.A.',
      },
      {
        ispb: 4913129,
        code: 60,
        name: 'CONFIDENCE CC S.A.',
        fullName: 'Confidence Corretora de Câmbio S.A.',
      },
      {
        ispb: 4913711,
        code: 37,
        name: 'BCO DO EST. DO PA S.A.',
        fullName: 'Banco do Estado do Pará S.A.',
      },
      {
        ispb: 5192316,
        code: 411,
        name: 'VIA CERTA FINANCIADORA S.A. - CFI',
        fullName:
          'Via Certa Financiadora S.A. - Crédito, Financiamento e Investimentos',
      },
      {
        ispb: 5351887,
        code: 359,
        name: 'ZEMA CFI S/A',
        fullName: 'ZEMA CRÉDITO, FINANCIAMENTO E INVESTIMENTO S/A',
      },
      {
        ispb: 5442029,
        code: 159,
        name: 'CASA CREDITO S.A. SCM',
        fullName:
          'Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor',
      },
      {
        ispb: 5463212,
        code: 85,
        name: 'COOPCENTRAL AILOS',
        fullName: 'Cooperativa Central de Crédito - Ailos',
      },
      {
        ispb: 5491616,
        code: 400,
        name: 'COOP CREDITAG',
        fullName:
          'COOPERATIVA DE CRÉDITO, POUPANÇA E SERVIÇOS FINANCEIROS DO CENTRO OESTE - CREDIT',
      },
      {
        ispb: 5676026,
        code: 429,
        name: 'CREDIARE CFI S.A.',
        fullName: 'Crediare S.A. - Crédito, financiamento e investimento',
      },
      {
        ispb: 5684234,
        code: 410,
        name: 'PLANNER SOCIEDADE DE CRÉDITO DIRETO',
        fullName: 'PLANNER SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 5790149,
        code: 114,
        name: 'CENTRAL COOPERATIVA DE CRÉDITO NO ESTADO DO ESPÍRITO SANTO',
        fullName:
          'Central Cooperativa de Crédito no Estado do Espírito Santo - CECOOP',
      },
      {
        ispb: 5841967,
        code: 328,
        name: 'CECM FABRIC CALÇADOS SAPIRANGA',
        fullName:
          'COOPERATIVA DE ECONOMIA E CRÉDITO MÚTUO DOS FABRICANTES DE CALÇADOS DE SAPIRANGA',
      },
      {
        ispb: 6271464,
        code: 36,
        name: 'BCO BBI S.A.',
        fullName: 'Banco Bradesco BBI S.A.',
      },
      {
        ispb: 7138049,
        code: 469,
        name: 'LIGA INVEST DTVM LTDA.',
        fullName:
          'LIGA INVEST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
      },
      {
        ispb: 7207996,
        code: 394,
        name: 'BCO BRADESCO FINANC. S.A.',
        fullName: 'Banco Bradesco Financiamentos S.A.',
      },
      {
        ispb: 7237373,
        code: 4,
        name: 'BCO DO NORDESTE DO BRASIL S.A.',
        fullName: 'Banco do Nordeste do Brasil S.A.',
      },
      {
        ispb: 7253654,
        code: 458,
        name: 'HEDGE INVESTMENTS DTVM LTDA.',
        fullName:
          'HEDGE INVESTMENTS DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.',
      },
      {
        ispb: 7450604,
        code: 320,
        name: 'BCO CCB BRASIL S.A.',
        fullName: 'China Construction Bank (Brasil) Banco Múltiplo S/A',
      },
      {
        ispb: 7512441,
        code: 189,
        name: 'HS FINANCEIRA',
        fullName: 'HS FINANCEIRA S/A CREDITO, FINANCIAMENTO E INVESTIMENTOS',
      },
      {
        ispb: 7652226,
        code: 105,
        name: 'LECCA CFI S.A.',
        fullName: 'Lecca Crédito, Financiamento e Investimento S/A',
      },
      {
        ispb: 7656500,
        code: 76,
        name: 'BCO KDB BRASIL S.A.',
        fullName: 'Banco KDB do Brasil S.A.',
      },
      {
        ispb: 7679404,
        code: 82,
        name: 'BANCO TOPÁZIO S.A.',
        fullName: 'BANCO TOPÁZIO S.A.',
      },
      {
        ispb: 7693858,
        code: 312,
        name: 'HSCM SCMEPP LTDA.',
        fullName:
          'HSCM - SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LT',
      },
      {
        ispb: 7799277,
        code: 195,
        name: 'VALOR SCD S.A.',
        fullName: 'VALOR SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 7945233,
        code: 93,
        name: 'POLOCRED SCMEPP LTDA.',
        fullName:
          'PÓLOCRED   SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORT',
      },
      {
        ispb: 8240446,
        code: 391,
        name: 'CCR DE IBIAM',
        fullName: 'COOPERATIVA DE CREDITO RURAL DE IBIAM - SULCREDI/IBIAM',
      },
      {
        ispb: 8253539,
        code: 273,
        name: 'CCR DE SÃO MIGUEL DO OESTE',
        fullName:
          'Cooperativa de Crédito Rural de São Miguel do Oeste - Sulcredi/São Miguel',
      },
      {
        ispb: 8357240,
        code: 368,
        name: 'BCO CSF S.A.',
        fullName: 'Banco CSF S.A.',
      },
      {
        ispb: 8561701,
        code: 290,
        name: 'PAGSEGURO INTERNET IP S.A.',
        fullName: 'PAGSEGURO INTERNET INSTITUIÇÃO DE PAGAMENTO S.A.',
      },
      {
        ispb: 8609934,
        code: 259,
        name: 'MONEYCORP BCO DE CÂMBIO S.A.',
        fullName: 'MONEYCORP BANCO DE CÂMBIO S.A.',
      },
      {
        ispb: 8673569,
        code: 395,
        name: 'F D GOLD DTVM LTDA',
        fullName:
          "F.D'GOLD - DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.",
      },
      {
        ispb: 9089356,
        code: 364,
        name: 'EFÍ S.A. - IP',
        fullName: 'EFÍ S.A. - INSTITUIÇÃO DE PAGAMENTO',
      },
      {
        ispb: 9105360,
        code: 157,
        name: 'ICAP DO BRASIL CTVM LTDA.',
        fullName:
          'ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda.',
      },
      {
        ispb: 9210106,
        code: 183,
        name: 'SOCRED SA - SCMEPP',
        fullName:
          'SOCRED S.A. - SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO P',
      },
      {
        ispb: 9274232,
        code: 14,
        name: 'STATE STREET BR S.A. BCO COMERCIAL',
        fullName: 'STATE STREET BRASIL S.A. - BANCO COMERCIAL',
      },
      {
        ispb: 9313766,
        code: 130,
        name: 'CARUANA SCFI',
        fullName:
          'CARUANA S.A. - SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO',
      },
      {
        ispb: 9464032,
        code: 358,
        name: 'MIDWAY S.A. - SCFI',
        fullName: 'MIDWAY S.A. - CRÉDITO, FINANCIAMENTO E INVESTIMENTO',
      },
      {
        ispb: 9512542,
        code: 127,
        name: 'CODEPE CVC S.A.',
        fullName: 'Codepe Corretora de Valores e Câmbio S.A.',
      },
      {
        ispb: 9516419,
        code: 79,
        name: 'PICPAY BANK - BANCO MÚLTIPLO S.A',
        fullName: 'PICPAY BANK - BANCO MÚLTIPLO S.A',
      },
      {
        ispb: 9526594,
        code: 141,
        name: 'MASTER BI S.A.',
        fullName: 'BANCO MASTER DE INVESTIMENTO S.A.',
      },
      {
        ispb: 9554480,
        code: 340,
        name: 'SUPERDIGITAL I.P. S.A.',
        fullName: 'SUPERDIGITAL INSTITUIÇÃO DE PAGAMENTO S.A.',
      },
      {
        ispb: 10264663,
        code: 81,
        name: 'BANCOSEGURO S.A.',
        fullName: 'BancoSeguro S.A.',
      },
      {
        ispb: 10371492,
        code: 475,
        name: 'BCO YAMAHA MOTOR S.A.',
        fullName: 'Banco Yamaha Motor do Brasil S.A.',
      },
      {
        ispb: 10398952,
        code: 133,
        name: 'CRESOL CONFEDERAÇÃO',
        fullName:
          'CONFEDERAÇÃO NACIONAL DAS COOPERATIVAS CENTRAIS DE CRÉDITO E ECONOMIA FAMILIAR E',
      },
      {
        ispb: 10573521,
        code: 323,
        name: 'MERCADO PAGO IP LTDA.',
        fullName: 'MERCADO PAGO INSTITUIÇÃO DE PAGAMENTO LTDA.',
      },
      {
        ispb: 10664513,
        code: 121,
        name: 'BCO AGIBANK S.A.',
        fullName: 'Banco Agibank S.A.',
      },
      {
        ispb: 10690848,
        code: 83,
        name: 'BCO DA CHINA BRASIL S.A.',
        fullName: 'Banco da China Brasil S.A.',
      },
      {
        ispb: 10853017,
        code: 138,
        name: 'GET MONEY CC LTDA',
        fullName: 'Get Money Corretora de Câmbio S.A.',
      },
      {
        ispb: 10866788,
        code: 24,
        name: 'BCO BANDEPE S.A.',
        fullName: 'Banco Bandepe S.A.',
      },
      {
        ispb: 11165756,
        code: 384,
        name: 'GLOBAL SCM LTDA',
        fullName:
          'GLOBAL FINANÇAS SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO',
      },
      {
        ispb: 11285104,
        code: 426,
        name: 'NEON FINANCEIRA - CFI S.A.',
        fullName:
          'NEON FINANCEIRA - CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.',
      },
      {
        ispb: 11476673,
        code: 88,
        name: 'BANCO RANDON S.A.',
        fullName: 'BANCO RANDON S.A.',
      },
      {
        ispb: 11495073,
        code: 319,
        name: 'OM DTVM LTDA',
        fullName: 'OM DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
      },
      {
        ispb: 11581339,
        code: 274,
        name: 'BMP SCMEPP LTDA',
        fullName:
          'BMP SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LTDA.',
      },
      {
        ispb: 11703662,
        code: 95,
        name: 'TRAVELEX BANCO DE CÂMBIO S.A.',
        fullName: 'Travelex Banco de Câmbio S.A.',
      },
      {
        ispb: 11758741,
        code: 94,
        name: 'BANCO FINAXIS',
        fullName: 'Banco Finaxis S.A.',
      },
      {
        ispb: 11760553,
        code: 478,
        name: 'GAZINCRED S.A. SCFI',
        fullName:
          'GAZINCRED S.A. SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO',
      },
      {
        ispb: 11970623,
        code: 276,
        name: 'BCO SENFF S.A.',
        fullName: 'BANCO SENFF S.A.',
      },
      {
        ispb: 12392983,
        code: 447,
        name: 'MIRAE ASSET CCTVM LTDA',
        fullName:
          'MIRAE ASSET WEALTH MANAGEMENT (BRAZIL) CORRETORA DE CÂMBIO, TÍTULOS E VALORES MO',
      },
      {
        ispb: 13009717,
        code: 47,
        name: 'BCO DO EST. DE SE S.A.',
        fullName: 'Banco do Estado de Sergipe S.A.',
      },
      {
        ispb: 13059145,
        code: 144,
        name: 'BEXS BCO DE CAMBIO S.A.',
        fullName: 'BEXS BANCO DE CÂMBIO S/A',
      },
      {
        ispb: 13140088,
        code: 332,
        name: 'ACESSO SOLUÇÕES DE PAGAMENTO S.A. - INSTITUIÇÃO DE PAGAMENTO',
        fullName:
          'ACESSO SOLUÇÕES DE PAGAMENTO S.A. - INSTITUIÇÃO DE PAGAMENTO',
      },
      {
        ispb: 13203354,
        code: 450,
        name: 'FITBANK IP',
        fullName: 'FITBANK INSTITUIÇÃO DE PAGAMENTOS ELETRÔNICOS S.A.',
      },
      {
        ispb: 13220493,
        code: 126,
        name: 'BR PARTNERS BI',
        fullName: 'BR Partners Banco de Investimento S.A.',
      },
      {
        ispb: 13293225,
        code: 325,
        name: 'ÓRAMA DTVM S.A.',
        fullName: 'Órama Distribuidora de Títulos e Valores Mobiliários S.A.',
      },
      {
        ispb: 13370835,
        code: 301,
        name: 'DOCK IP S.A.',
        fullName: 'DOCK INSTITUIÇÃO DE PAGAMENTO S.A.',
      },
      {
        ispb: 13486793,
        code: 173,
        name: 'BRL TRUST DTVM SA',
        fullName:
          'BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A.',
      },
      {
        ispb: 13673855,
        code: 331,
        name: 'FRAM CAPITAL DTVM S.A.',
        fullName:
          'Fram Capital Distribuidora de Títulos e Valores Mobiliários S.A.',
      },
      {
        ispb: 13720915,
        code: 119,
        name: 'BCO WESTERN UNION',
        fullName: 'Banco Western Union do Brasil S.A.',
      },
      {
        ispb: 13884775,
        code: 396,
        name: 'HUB IP S.A.',
        fullName: 'HUB INSTITUIÇÃO DE PAGAMENTO S.A.',
      },
      {
        ispb: 13935893,
        code: 509,
        name: 'CELCOIN IP S.A.',
        fullName: 'CELCOIN INSTITUICAO DE PAGAMENTO S.A.',
      },
      {
        ispb: 14190547,
        code: 309,
        name: 'CAMBIONET CC LTDA',
        fullName: 'CAMBIONET CORRETORA DE CÂMBIO LTDA.',
      },
      {
        ispb: 14388334,
        code: 254,
        name: 'PARANA BCO S.A.',
        fullName: 'PARANÁ BANCO S.A.',
      },
      {
        ispb: 14511781,
        code: 268,
        name: 'BARI CIA HIPOTECÁRIA',
        fullName: 'BARI COMPANHIA HIPOTECÁRIA',
      },
      {
        ispb: 15111975,
        code: 401,
        name: 'IUGU IP S.A.',
        fullName: 'IUGU INSTITUIÇÃO DE PAGAMENTO S.A.',
      },
      {
        ispb: 15114366,
        code: 107,
        name: 'BCO BOCOM BBM S.A.',
        fullName: 'Banco Bocom BBM S.A.',
      },
      {
        ispb: 15124464,
        code: 334,
        name: 'BANCO BESA S.A.',
        fullName: 'BANCO BESA S.A.',
      },
      {
        ispb: 15173776,
        code: 412,
        name: 'SOCIAL BANK S/A',
        fullName: 'SOCIAL BANK BANCO MÚLTIPLO S/A',
      },
      {
        ispb: 15357060,
        code: 124,
        name: 'BCO WOORI BANK DO BRASIL S.A.',
        fullName: 'Banco Woori Bank do Brasil S.A.',
      },
      {
        ispb: 15581638,
        code: 149,
        name: 'FACTA S.A. CFI',
        fullName:
          'Facta Financeira S.A. - Crédito Financiamento e Investimento',
      },
      {
        ispb: 16501555,
        code: 197,
        name: 'STONE IP S.A.',
        fullName: 'STONE INSTITUIÇÃO DE PAGAMENTO S.A.',
      },
      {
        ispb: 16695922,
        code: 439,
        name: 'ID CTVM',
        fullName: 'ID CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 16927221,
        code: 313,
        name: 'AMAZÔNIA CC LTDA.',
        fullName: 'AMAZÔNIA CORRETORA DE CÂMBIO LTDA.',
      },
      {
        ispb: 16944141,
        code: 142,
        name: 'BROKER BRASIL CC LTDA.',
        fullName: 'Broker Brasil Corretora de Câmbio Ltda.',
      },
      {
        ispb: 17079937,
        code: 529,
        name: 'PINBANK IP',
        fullName: 'PINBANK BRASIL INSTITUIÇÃO DE PAGAMENTO S.A.',
      },
      {
        ispb: 17184037,
        code: 389,
        name: 'BCO MERCANTIL DO BRASIL S.A.',
        fullName: 'Banco Mercantil do Brasil S.A.',
      },
      {
        ispb: 17298092,
        code: 184,
        name: 'BCO ITAÚ BBA S.A.',
        fullName: 'Banco Itaú BBA S.A.',
      },
      {
        ispb: 17351180,
        code: 634,
        name: 'BCO TRIANGULO S.A.',
        fullName: 'BANCO TRIANGULO S.A.',
      },
      {
        ispb: 17352220,
        code: 545,
        name: 'SENSO CCVM S.A.',
        fullName: 'SENSO CORRETORA DE CAMBIO E VALORES MOBILIARIOS S.A',
      },
      {
        ispb: 17453575,
        code: 132,
        name: 'ICBC DO BRASIL BM S.A.',
        fullName: 'ICBC do Brasil Banco Múltiplo S.A.',
      },
      {
        ispb: 17772370,
        code: 298,
        name: 'VIPS CC LTDA.',
        fullName: "Vip's Corretora de Câmbio Ltda.",
      },
      {
        ispb: 17826860,
        code: 377,
        name: 'BMS SCD S.A.',
        fullName: 'BMS SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 18188384,
        code: 321,
        name: 'CREFAZ SCMEPP LTDA',
        fullName:
          'CREFAZ SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E A EMPRESA DE PEQUENO PORTE LT',
      },
      {
        ispb: 18236120,
        code: 260,
        name: 'NU PAGAMENTOS - IP',
        fullName: 'NU PAGAMENTOS S.A. - INSTITUIÇÃO DE PAGAMENTO',
      },
      {
        ispb: 18394228,
        code: 470,
        name: 'CDC SCD S.A.',
        fullName: 'CDC SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 18520834,
        code: 129,
        name: 'UBS BRASIL BI S.A.',
        fullName: 'UBS Brasil Banco de Investimento S.A.',
      },
      {
        ispb: 19307785,
        code: 128,
        name: 'BRAZA BANK S.A. BCO DE CÂMBIO',
        fullName: 'BRAZA BANK S.A. BANCO DE CÂMBIO',
      },
      {
        ispb: 19324634,
        code: 416,
        name: 'LAMARA SCD S.A.',
        fullName: 'LAMARA SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 19540550,
        code: 461,
        name: 'ASAAS IP S.A.',
        fullName: 'ASAAS GESTÃO FINANCEIRA INSTITUIÇÃO DE PAGAMENTO S.A.',
      },
      {
        ispb: 20155248,
        code: 194,
        name: 'PARMETAL DTVM LTDA',
        fullName:
          'PARMETAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
      },
      {
        ispb: 20855875,
        code: 536,
        name: 'NEON PAGAMENTOS S.A. IP',
        fullName: 'NEON PAGAMENTOS S.A. - INSTITUIÇÃO DE PAGAMENTO',
      },
      {
        ispb: 21018182,
        code: 383,
        name: 'EBANX IP LTDA.',
        fullName: 'EBANX INSTITUICAO DE PAGAMENTOS LTDA.',
      },
      {
        ispb: 21332862,
        code: 324,
        name: 'CARTOS SCD S.A.',
        fullName: 'CARTOS SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 22610500,
        code: 310,
        name: 'VORTX DTVM LTDA.',
        fullName: 'VORTX DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.',
      },
      {
        ispb: 22896431,
        code: 380,
        name: 'PICPAY',
        fullName: 'PICPAY INSTITUIçãO DE PAGAMENTO S.A.',
      },
      {
        ispb: 23862762,
        code: 280,
        name: 'WILL FINANCEIRA S.A.CFI',
        fullName: 'WILL FINANCEIRA S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO',
      },
      {
        ispb: 24074692,
        code: 146,
        name: 'GUITTA CC LTDA',
        fullName: 'GUITTA CORRETORA DE CAMBIO LTDA.',
      },
      {
        ispb: 24537861,
        code: 343,
        name: 'FFA SCMEPP LTDA.',
        fullName:
          'FFA SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE LTDA.',
      },
      {
        ispb: 26563270,
        code: 279,
        name: 'COOP DE PRIMAVERA DO LESTE',
        fullName: 'PRIMACREDI COOPERATIVA DE CRÉDITO DE PRIMAVERA DO LESTE',
      },
      {
        ispb: 27098060,
        code: 335,
        name: 'BANCO DIGIO',
        fullName: 'Banco Digio S.A.',
      },
      {
        ispb: 27214112,
        code: 349,
        name: 'AL5 S.A. CFI',
        fullName: 'AL5 S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO',
      },
      {
        ispb: 27302181,
        code: 427,
        name: 'CRED-UFES',
        fullName:
          'COOPERATIVA DE CREDITO DOS SERVIDORES DA UNIVERSIDADE FEDERAL DO ESPIRITO SANTO',
      },
      {
        ispb: 27351731,
        code: 374,
        name: 'REALIZE CFI S.A.',
        fullName: 'REALIZE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.',
      },
      {
        ispb: 27652684,
        code: 278,
        name: 'GENIAL INVESTIMENTOS CVM S.A.',
        fullName: 'Genial Investimentos Corretora de Valores Mobiliários S.A.',
      },
      {
        ispb: 27842177,
        code: 271,
        name: 'IB CCTVM S.A.',
        fullName: 'IB Corretora de Câmbio, Títulos e Valores Mobiliários S.A.',
      },
      {
        ispb: 28127603,
        code: 21,
        name: 'BCO BANESTES S.A.',
        fullName: 'BANESTES S.A. BANCO DO ESTADO DO ESPIRITO SANTO',
      },
      {
        ispb: 28195667,
        code: 246,
        name: 'BCO ABC BRASIL S.A.',
        fullName: 'Banco ABC Brasil S.A.',
      },
      {
        ispb: 28650236,
        code: 292,
        name: 'BS2 DTVM S.A.',
        fullName: 'BS2 Distribuidora de Títulos e Valores Mobiliários S.A.',
      },
      //   {
      //     ispb: 28719664,
      //     code: NaN,
      //     name: 'Balcão B3',
      //     fullName: 'Sistema do Balcão B3',
      //   },
      //   { ispb: 29011780, code: NaN, name: 'CIP SA C3', fullName: 'CIP S.A' },
      {
        ispb: 29030467,
        code: 751,
        name: 'SCOTIABANK BRASIL',
        fullName: 'Scotiabank Brasil S.A. Banco Múltiplo',
      },
      {
        ispb: 29162769,
        code: 352,
        name: 'TORO CTVM S.A.',
        fullName: 'TORO CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 30306294,
        code: 208,
        name: 'BANCO BTG PACTUAL S.A.',
        fullName: 'Banco BTG Pactual S.A.',
      },
      {
        ispb: 30680829,
        code: 386,
        name: 'NU FINANCEIRA S.A. CFI',
        fullName:
          'NU FINANCEIRA S.A. - Sociedade de Crédito, Financiamento e Investimento',
      },
      {
        ispb: 30723886,
        code: 746,
        name: 'BCO MODAL S.A.',
        fullName: 'Banco Modal S.A.',
      },
      {
        ispb: 30980539,
        code: 546,
        name: 'U4C INSTITUIÇÃO DE PAGAMENTO S.A.',
        fullName: 'U4C INSTITUIÇÃO DE PAGAMENTO S.A.',
      },
      {
        ispb: 31597552,
        code: 241,
        name: 'BCO CLASSICO S.A.',
        fullName: 'BANCO CLASSICO S.A.',
      },
      {
        ispb: 31749596,
        code: 398,
        name: 'IDEAL CTVM S.A.',
        fullName: 'IDEAL CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 31872495,
        code: 336,
        name: 'BCO C6 S.A.',
        fullName: 'Banco C6 S.A.',
      },
      {
        ispb: 31880826,
        code: 612,
        name: 'BCO GUANABARA S.A.',
        fullName: 'Banco Guanabara S.A.',
      },
      {
        ispb: 31895683,
        code: 604,
        name: 'BCO INDUSTRIAL DO BRASIL S.A.',
        fullName: 'Banco Industrial do Brasil S.A.',
      },
      {
        ispb: 32062580,
        code: 505,
        name: 'BCO CREDIT SUISSE S.A.',
        fullName: 'Banco Credit Suisse (Brasil) S.A.',
      },
      {
        ispb: 32402502,
        code: 329,
        name: 'QI SCD S.A.',
        fullName: 'QI Sociedade de Crédito Direto S.A.',
      },
      {
        ispb: 32648370,
        code: 196,
        name: 'FAIR CC S.A.',
        fullName: 'FAIR CORRETORA DE CAMBIO S.A.',
      },
      {
        ispb: 32997490,
        code: 342,
        name: 'CREDITAS SCD',
        fullName: 'Creditas Sociedade de Crédito Direto S.A.',
      },
      {
        ispb: 33042151,
        code: 300,
        name: 'BCO LA NACION ARGENTINA',
        fullName: 'Banco de la Nacion Argentina',
      },
      {
        ispb: 33042953,
        code: 477,
        name: 'CITIBANK N.A.',
        fullName: 'Citibank N.A.',
      },
      {
        ispb: 33132044,
        code: 266,
        name: 'BCO CEDULA S.A.',
        fullName: 'BANCO CEDULA S.A.',
      },
      {
        ispb: 33147315,
        code: 122,
        name: 'BCO BRADESCO BERJ S.A.',
        fullName: 'Banco Bradesco BERJ S.A.',
      },
      {
        ispb: 33172537,
        code: 376,
        name: 'BCO J.P. MORGAN S.A.',
        fullName: 'BANCO J.P. MORGAN S.A.',
      },
      {
        ispb: 33264668,
        code: 348,
        name: 'BCO XP S.A.',
        fullName: 'Banco XP S.A.',
      },
      {
        ispb: 33466988,
        code: 473,
        name: 'BCO CAIXA GERAL BRASIL S.A.',
        fullName: 'Banco Caixa Geral - Brasil S.A.',
      },
      {
        ispb: 33479023,
        code: 745,
        name: 'BCO CITIBANK S.A.',
        fullName: 'Banco Citibank S.A.',
      },
      {
        ispb: 33603457,
        code: 120,
        name: 'BCO RODOBENS S.A.',
        fullName: 'BANCO RODOBENS S.A.',
      },
      {
        ispb: 33644196,
        code: 265,
        name: 'BCO FATOR S.A.',
        fullName: 'Banco Fator S.A.',
      },
      {
        ispb: 33657248,
        code: 7,
        name: 'BNDES',
        fullName: 'BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL',
      },
      {
        ispb: 33775974,
        code: 188,
        name: 'ATIVA S.A. INVESTIMENTOS CCTVM',
        fullName:
          'ATIVA INVESTIMENTOS S.A. CORRETORA DE TÍTULOS, CÂMBIO E VALORES',
      },
      {
        ispb: 33862244,
        code: 134,
        name: 'BGC LIQUIDEZ DTVM LTDA',
        fullName:
          'BGC LIQUIDEZ DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
      },
      {
        ispb: 33885724,
        code: 29,
        name: 'BANCO ITAÚ CONSIGNADO S.A.',
        fullName: 'Banco Itaú Consignado S.A.',
      },
      {
        ispb: 33886862,
        code: 467,
        name: 'MASTER S/A CCTVM',
        fullName:
          'MASTER S/A CORRETORA DE CâMBIO, TíTULOS E VALORES MOBILIáRIOS',
      },
      {
        ispb: 33923798,
        code: 243,
        name: 'BANCO MASTER',
        fullName: 'BANCO MASTER S/A',
      },
      {
        ispb: 34088029,
        code: 397,
        name: 'LISTO SCD S.A.',
        fullName: 'LISTO SOCIEDADE DE CREDITO DIRETO S.A.',
      },
      {
        ispb: 34111187,
        code: 78,
        name: 'HAITONG BI DO BRASIL S.A.',
        fullName: 'Haitong Banco de Investimento do Brasil S.A.',
      },
      {
        ispb: 34265629,
        code: 525,
        name: 'INTERCAM CC LTDA',
        fullName: 'INTERCAM CORRETORA DE CÂMBIO LTDA.',
      },
      {
        ispb: 34335592,
        code: 355,
        name: 'ÓTIMO SCD S.A.',
        fullName: 'ÓTIMO SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 34711571,
        code: 367,
        name: 'VITREO DTVM S.A.',
        fullName: 'VITREO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 34829992,
        code: 528,
        name: 'REAG DTVM S.A.',
        fullName: 'REAG DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 35551187,
        code: 445,
        name: 'PLANTAE CFI',
        fullName: 'PLANTAE S.A. - CRÉDITO, FINANCIAMENTO E INVESTIMENTO',
      },
      {
        ispb: 35977097,
        code: 373,
        name: 'UP.P SEP S.A.',
        fullName: 'UP.P SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.',
      },
      {
        ispb: 36113876,
        code: 111,
        name: 'OLIVEIRA TRUST DTVM S.A.',
        fullName:
          'OLIVEIRA TRUST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIARIOS S.A.',
      },
      {
        ispb: 36266751,
        code: 512,
        name: 'FINVEST DTVM',
        fullName:
          'FINVEST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.',
      },
      {
        ispb: 36583700,
        code: 516,
        name: 'QISTA S.A. CFI',
        fullName: 'QISTA S.A. - CRÉDITO, FINANCIAMENTO E INVESTIMENTO',
      },
      {
        ispb: 36586946,
        code: 408,
        name: 'BONUSPAGO SCD S.A.',
        fullName: 'BONUSPAGO SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 36864992,
        code: 484,
        name: 'MAF DTVM SA',
        fullName: 'MAF DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 36947229,
        code: 402,
        name: 'COBUCCIO S.A. SCFI',
        fullName:
          'COBUCCIO S/A - SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTOS',
      },
      {
        ispb: 37229413,
        code: 507,
        name: 'SCFI EFÍ S.A.',
        fullName: 'SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO EFÍ S.A.',
      },
      {
        ispb: 37241230,
        code: 404,
        name: 'SUMUP SCD S.A.',
        fullName: 'SUMUP SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 37414009,
        code: 418,
        name: 'ZIPDIN SCD S.A.',
        fullName: 'ZIPDIN SOLUÇÕES DIGITAIS SOCIEDADE DE CRÉDITO DIRETO S/A',
      },
      {
        ispb: 37526080,
        code: 414,
        name: 'LEND SCD S.A.',
        fullName: 'LEND SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 37555231,
        code: 449,
        name: 'DM',
        fullName: 'DM SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 37679449,
        code: 518,
        name: 'MERCADO CRÉDITO SCFI S.A.',
        fullName:
          'MERCADO CRÉDITO SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.',
      },
      {
        ispb: 37715993,
        code: 406,
        name: 'ACCREDITO SCD S.A.',
        fullName: 'ACCREDITO - SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 37880206,
        code: 403,
        name: 'CORA SCD S.A.',
        fullName: 'CORA SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 38129006,
        code: 419,
        name: 'NUMBRS SCD S.A.',
        fullName: 'NUMBRS SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 38224857,
        code: 435,
        name: 'DELCRED SCD S.A.',
        fullName: 'DELCRED SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 38429045,
        code: 455,
        name: 'FÊNIX DTVM LTDA.',
        fullName: 'FÊNIX DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.',
      },
      {
        ispb: 39343350,
        code: 421,
        name: 'CC LAR CREDI',
        fullName: 'LAR COOPERATIVA DE CRÉDITO - LAR CREDI',
      },
      {
        ispb: 39416705,
        code: 443,
        name: 'CREDIHOME SCD',
        fullName: 'CREDIHOME SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 39519944,
        code: 535,
        name: 'MARU SCD S.A.',
        fullName: 'MARÚ SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 39587424,
        code: 457,
        name: 'UY3 SCD S/A',
        fullName: 'UY3 SOCIEDADE DE CRÉDITO DIRETO S/A',
      },
      {
        ispb: 39664698,
        code: 428,
        name: 'CREDSYSTEM SCD S.A.',
        fullName: 'CREDSYSTEM SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 39669186,
        code: 448,
        name: 'HEMERA DTVM LTDA.',
        fullName: 'HEMERA DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.',
      },
      {
        ispb: 39676772,
        code: 452,
        name: 'CREDIFIT SCD S.A.',
        fullName: 'CREDIFIT SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 39738065,
        code: 510,
        name: 'FFCRED SCD S.A.',
        fullName: 'FFCRED SOCIEDADE DE CRÉDITO DIRETO S.A..',
      },
      {
        ispb: 39908427,
        code: 462,
        name: 'STARK SCD S.A.',
        fullName: 'STARK SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 40083667,
        code: 465,
        name: 'CAPITAL CONSIG SCD S.A.',
        fullName: 'CAPITAL CONSIG SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 40303299,
        code: 306,
        name: 'PORTOPAR DTVM LTDA',
        fullName:
          'PORTOPAR DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.',
      },
      {
        ispb: 40434681,
        code: 463,
        name: 'AZUMI DTVM',
        fullName: 'AZUMI DISTRIBUIDORA DE TíTULOS E VALORES MOBILIáRIOS LTDA.',
      },
      {
        ispb: 40475846,
        code: 451,
        name: 'J17 - SCD S/A',
        fullName: 'J17 - SOCIEDADE DE CRÉDITO DIRETO S/A',
      },
      {
        ispb: 40654622,
        code: 444,
        name: 'TRINUS SCD S.A.',
        fullName: 'TRINUS SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 40768766,
        code: 519,
        name: 'LIONS TRUST DTVM',
        fullName:
          'LIONS TRUST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.',
      },
      {
        ispb: 41592532,
        code: 454,
        name: 'MÉRITO DTVM LTDA.',
        fullName: 'MÉRITO DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.',
      },
      {
        ispb: 42047025,
        code: 460,
        name: 'UNAVANTI SCD S/A',
        fullName: 'UNAVANTI SOCIEDADE DE CRÉDITO DIRETO S/A',
      },
      {
        ispb: 42066258,
        code: 506,
        name: 'RJI',
        fullName: 'RJI CORRETORA DE TITULOS E VALORES MOBILIARIOS LTDA',
      },
      {
        ispb: 42259084,
        code: 482,
        name: 'SBCASH SCD',
        fullName: 'SBCASH SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 42272526,
        code: 17,
        name: 'BNY MELLON BCO S.A.',
        fullName: 'BNY Mellon Banco S.A.',
      },
      {
        ispb: 43180355,
        code: 174,
        name: 'PEFISA S.A. - C.F.I.',
        fullName: 'PEFISA S.A. - CRÉDITO, FINANCIAMENTO E INVESTIMENTO',
      },
      {
        ispb: 43599047,
        code: 481,
        name: 'SUPERLÓGICA SCD S.A.',
        fullName: 'SUPERLÓGICA SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 44019481,
        code: 521,
        name: 'PEAK SEP S.A.',
        fullName: 'PEAK SOCIEDADE DE EMPRÉSTIMO ENTRE PESSOAS S.A.',
      },
      {
        ispb: 44077014,
        code: 433,
        name: 'BR-CAPITAL DTVM S.A.',
        fullName:
          'BR-CAPITAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 44189447,
        code: 495,
        name: 'BCO LA PROVINCIA B AIRES BCE',
        fullName: 'Banco de La Provincia de Buenos Aires',
      },
      {
        ispb: 44292580,
        code: 523,
        name: 'HR DIGITAL SCD',
        fullName: 'HR DIGITAL - SOCIEDADE DE CRÉDITO DIRETO S/A',
      },
      {
        ispb: 44478623,
        code: 527,
        name: 'ATICCA SCD S.A.',
        fullName: 'ATICCA - SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 44683140,
        code: 511,
        name: 'MAGNUM SCD',
        fullName: 'MAGNUM SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 44728700,
        code: 513,
        name: 'ATF CREDIT SCD S.A.',
        fullName: 'ATF CREDIT SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 45246410,
        code: 125,
        name: 'BANCO GENIAL',
        fullName: 'BANCO GENIAL S.A.',
      },
      {
        ispb: 45745537,
        code: 532,
        name: 'EAGLE SCD S.A.',
        fullName: 'EAGLE SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 45756448,
        code: 537,
        name: 'MICROCASH SCMEPP LTDA.',
        fullName:
          'MICROCASH SOCIEDADE DE CRÉDITO AO MICROEMPREENDEDOR E À EMPRESA DE PEQUENO PORTE',
      },
      {
        ispb: 45854066,
        code: 524,
        name: 'WNT CAPITAL DTVM',
        fullName:
          'WNT CAPITAL DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 46026562,
        code: 526,
        name: 'MONETARIE SCD',
        fullName: 'MONETARIE SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 46518205,
        code: 488,
        name: 'JPMORGAN CHASE BANK',
        fullName: 'JPMorgan Chase Bank, National Association',
      },
      {
        ispb: 47593544,
        code: 522,
        name: 'RED SCD S.A.',
        fullName: 'RED SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 47873449,
        code: 530,
        name: 'SER FINANCE SCD S.A.',
        fullName: 'SER FINANCE SOCIEDADE DE CRÉDITO DIRETO S.A.',
      },
      {
        ispb: 48795256,
        code: 65,
        name: 'BCO ANDBANK S.A.',
        fullName: 'Banco AndBank (Brasil) S.A.',
      },
      {
        ispb: 50579044,
        code: 145,
        name: 'LEVYCAM CCV LTDA',
        fullName: 'LEVYCAM - CORRETORA DE CAMBIO E VALORES LTDA.',
      },
      {
        ispb: 50585090,
        code: 250,
        name: 'BCV - BCO, CRÉDITO E VAREJO S.A.',
        fullName: 'BCV - BANCO DE CRÉDITO E VAREJO S.A.',
      },
      {
        ispb: 52937216,
        code: 253,
        name: 'BEXS CC S.A.',
        fullName: 'Bexs Corretora de Câmbio S/A',
      },
      {
        ispb: 53518684,
        code: 269,
        name: 'BCO HSBC S.A.',
        fullName: 'BANCO HSBC S.A.',
      },
      {
        ispb: 54403563,
        code: 213,
        name: 'BCO ARBI S.A.',
        fullName: 'Banco Arbi S.A.',
      },
      //   { ispb: 54641030, code: NaN, name: 'Câmara B3', fullName: 'Câmara B3' },
      {
        ispb: 55230916,
        code: 139,
        name: 'INTESA SANPAOLO BRASIL S.A. BM',
        fullName: 'Intesa Sanpaolo Brasil S.A. - Banco Múltiplo',
      },
      {
        ispb: 57839805,
        code: 18,
        name: 'BCO TRICURY S.A.',
        fullName: 'Banco Tricury S.A.',
      },
      {
        ispb: 58160789,
        code: 422,
        name: 'BCO SAFRA S.A.',
        fullName: 'Banco Safra S.A.',
      },
      {
        ispb: 58497702,
        code: 630,
        name: 'BCO LETSBANK S.A.',
        fullName: 'BANCO LETSBANK S.A.',
      },
      {
        ispb: 58616418,
        code: 224,
        name: 'BCO FIBRA S.A.',
        fullName: 'Banco Fibra S.A.',
      },
      {
        ispb: 59109165,
        code: 393,
        name: 'BCO VOLKSWAGEN S.A',
        fullName: 'Banco Volkswagen S.A.',
      },
      {
        ispb: 59118133,
        code: 600,
        name: 'BCO LUSO BRASILEIRO S.A.',
        fullName: 'Banco Luso Brasileiro S.A.',
      },
      {
        ispb: 59274605,
        code: 390,
        name: 'BCO GM S.A.',
        fullName: 'BANCO GM S.A.',
      },
      {
        ispb: 59285411,
        code: 623,
        name: 'BANCO PAN',
        fullName: 'Banco Pan S.A.',
      },
      {
        ispb: 59588111,
        code: 655,
        name: 'BCO VOTORANTIM S.A.',
        fullName: 'Banco Votorantim S.A.',
      },
      {
        ispb: 60394079,
        code: 479,
        name: 'BCO ITAUBANK S.A.',
        fullName: 'Banco ItauBank S.A.',
      },
      {
        ispb: 60498557,
        code: 456,
        name: 'BCO MUFG BRASIL S.A.',
        fullName: 'Banco MUFG Brasil S.A.',
      },
      {
        ispb: 60518222,
        code: 464,
        name: 'BCO SUMITOMO MITSUI BRASIL S.A.',
        fullName: 'Banco Sumitomo Mitsui Brasileiro S.A.',
      },
      {
        ispb: 60701190,
        code: 341,
        name: 'ITAÚ UNIBANCO S.A.',
        fullName: 'ITAÚ UNIBANCO S.A.',
      },
      {
        ispb: 60746948,
        code: 237,
        name: 'BCO BRADESCO S.A.',
        fullName: 'Banco Bradesco S.A.',
      },
      {
        ispb: 60814191,
        code: 381,
        name: 'BCO MERCEDES-BENZ S.A.',
        fullName: 'BANCO MERCEDES-BENZ DO BRASIL S.A.',
      },
      {
        ispb: 60850229,
        code: 613,
        name: 'OMNI BANCO S.A.',
        fullName: 'Omni Banco S.A.',
      },
      {
        ispb: 60889128,
        code: 637,
        name: 'BCO SOFISA S.A.',
        fullName: 'BANCO SOFISA S.A.',
      },
      //   {
      //     ispb: 60934221,
      //     code: NaN,
      //     name: 'Câmbio B3',
      //     fullName: 'Câmara de Câmbio B3',
      //   },
      {
        ispb: 61024352,
        code: 653,
        name: 'BANCO VOITER',
        fullName: 'BANCO VOITER S.A.',
      },
      {
        ispb: 61033106,
        code: 69,
        name: 'BCO CREFISA S.A.',
        fullName: 'Banco Crefisa S.A.',
      },
      {
        ispb: 61088183,
        code: 370,
        name: 'BCO MIZUHO S.A.',
        fullName: 'Banco Mizuho do Brasil S.A.',
      },
      {
        ispb: 61182408,
        code: 249,
        name: 'BANCO INVESTCRED UNIBANCO S.A.',
        fullName: 'Banco Investcred Unibanco S.A.',
      },
      {
        ispb: 61186680,
        code: 318,
        name: 'BCO BMG S.A.',
        fullName: 'Banco BMG S.A.',
      },
      {
        ispb: 61348538,
        code: 626,
        name: 'BCO C6 CONSIG',
        fullName: 'BANCO C6 CONSIGNADO S.A.',
      },
      {
        ispb: 61384004,
        code: 508,
        name: 'AVENUE SECURITIES DTVM LTDA.',
        fullName:
          'AVENUE SECURITIES DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.',
      },
      {
        ispb: 61444949,
        code: 270,
        name: 'SAGITUR CC',
        fullName: 'SAGITUR CORRETORA DE CÂMBIO S.A.',
      },
      {
        ispb: 61533584,
        code: 366,
        name: 'BCO SOCIETE GENERALE BRASIL',
        fullName: 'BANCO SOCIETE GENERALE BRASIL S.A.',
      },
      {
        ispb: 61723847,
        code: 113,
        name: 'NEON CTVM S.A.',
        fullName: 'NEON CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 61747085,
        code: 131,
        name: 'TULLETT PREBON BRASIL CVC LTDA',
        fullName: 'TULLETT PREBON BRASIL CORRETORA DE VALORES E CÂMBIO LTDA',
      },
      {
        ispb: 61809182,
        code: 11,
        name: 'C.SUISSE HEDGING-GRIFFO CV S/A',
        fullName: 'CREDIT SUISSE HEDGING-GRIFFO CORRETORA DE VALORES S.A',
      },
      {
        ispb: 61820817,
        code: 611,
        name: 'BCO PAULISTA S.A.',
        fullName: 'Banco Paulista S.A.',
      },
      {
        ispb: 62073200,
        code: 755,
        name: 'BOFA MERRILL LYNCH BM S.A.',
        fullName: 'Bank of America Merrill Lynch Banco Múltiplo S.A.',
      },
      {
        ispb: 62109566,
        code: 89,
        name: 'CREDISAN CC',
        fullName: 'CREDISAN COOPERATIVA DE CRÉDITO',
      },
      {
        ispb: 62144175,
        code: 643,
        name: 'BCO PINE S.A.',
        fullName: 'Banco Pine S.A.',
      },
      {
        ispb: 62169875,
        code: 140,
        name: 'NU INVEST CORRETORA DE VALORES S.A.',
        fullName: 'NU INVEST CORRETORA DE VALORES S.A.',
      },
      {
        ispb: 62232889,
        code: 707,
        name: 'BCO DAYCOVAL S.A',
        fullName: 'Banco Daycoval S.A.',
      },
      {
        ispb: 62237649,
        code: 288,
        name: 'CAROL DTVM LTDA.',
        fullName: 'CAROL DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LTDA.',
      },
      {
        ispb: 62285390,
        code: 363,
        name: 'SINGULARE CTVM S.A.',
        fullName: 'SINGULARE CORRETORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A.',
      },
      {
        ispb: 62287735,
        code: 101,
        name: 'RENASCENCA DTVM LTDA',
        fullName:
          'RENASCENCA DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
      },
      {
        ispb: 62331228,
        code: 487,
        name: 'DEUTSCHE BANK S.A.BCO ALEMAO',
        fullName: 'DEUTSCHE BANK S.A. - BANCO ALEMAO',
      },
      {
        ispb: 62421979,
        code: 233,
        name: 'BANCO CIFRA',
        fullName: 'Banco Cifra S.A.',
      },
      {
        ispb: 65913436,
        code: 177,
        name: 'GUIDE',
        fullName: 'Guide Investimentos S.A. Corretora de Valores',
      },
      {
        ispb: 67030395,
        code: 438,
        name: 'TRUSTEE DTVM LTDA.',
        fullName:
          'TRUSTEE DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA.',
      },
      {
        ispb: 68757681,
        code: 365,
        name: 'SIMPAUL',
        fullName: 'SIMPAUL CORRETORA DE CAMBIO E VALORES MOBILIARIOS  S.A.',
      },
      {
        ispb: 68900810,
        code: 633,
        name: 'BCO RENDIMENTO S.A.',
        fullName: 'Banco Rendimento S.A.',
      },
      {
        ispb: 71027866,
        code: 218,
        name: 'BCO BS2 S.A.',
        fullName: 'Banco BS2 S.A.',
      },
      {
        ispb: 71590442,
        code: 293,
        name: 'LASTRO RDV DTVM LTDA',
        fullName:
          'Lastro RDV Distribuidora de Títulos e Valores Mobiliários Ltda.',
      },
      {
        ispb: 71677850,
        code: 285,
        name: 'FRENTE CC S.A.',
        fullName: 'FRENTE CORRETORA DE CÂMBIO S.A.',
      },
      {
        ispb: 73622748,
        code: 80,
        name: 'B&T CC LTDA.',
        fullName: 'B&T CORRETORA DE CAMBIO LTDA.',
      },
      {
        ispb: 74828799,
        code: 753,
        name: 'NOVO BCO CONTINENTAL S.A. - BM',
        fullName: 'Novo Banco Continental S.A. - Banco Múltiplo',
      },
      {
        ispb: 75647891,
        code: 222,
        name: 'BCO CRÉDIT AGRICOLE BR S.A.',
        fullName: 'BANCO CRÉDIT AGRICOLE BRASIL S.A.',
      },
      {
        ispb: 76461557,
        code: 281,
        name: 'CCR COOPAVEL',
        fullName: 'Cooperativa de Crédito Rural Coopavel',
      },
      {
        ispb: 76543115,
        code: 754,
        name: 'BANCO SISTEMA',
        fullName: 'Banco Sistema S.A.',
      },
      {
        ispb: 76641497,
        code: 311,
        name: 'DOURADA CORRETORA',
        fullName: 'DOURADA CORRETORA DE CÂMBIO LTDA.',
      },
      {
        ispb: 78157146,
        code: 98,
        name: 'CREDIALIANÇA CCR',
        fullName: 'Credialiança Cooperativa de Crédito Rural',
      },
      {
        ispb: 78626983,
        code: 610,
        name: 'BCO VR S.A.',
        fullName: 'Banco VR S.A.',
      },
      {
        ispb: 78632767,
        code: 712,
        name: 'BCO OURINVEST S.A.',
        fullName: 'Banco Ourinvest S.A.',
      },
      {
        ispb: 80271455,
        code: 720,
        name: 'BCO RNX S.A.',
        fullName: 'BANCO RNX S.A.',
      },
      {
        ispb: 81723108,
        code: 10,
        name: 'CREDICOAMO',
        fullName: 'CREDICOAMO CREDITO RURAL COOPERATIVA',
      },
      {
        ispb: 82096447,
        code: 440,
        name: 'CREDIBRF COOP',
        fullName: 'CREDIBRF - COOPERATIVA DE CRÉDITO',
      },
      {
        ispb: 87963450,
        code: 442,
        name: 'MAGNETIS - DTVM',
        fullName:
          'MAGNETIS - DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS LTDA',
      },
      {
        ispb: 89960090,
        code: 283,
        name: 'RB INVESTIMENTOS DTVM LTDA.',
        fullName:
          'RB INVESTIMENTOS DISTRIBUIDORA DE TITULOS E VALORES MOBILIARIOS LIMITADA',
      },
      {
        ispb: 90400888,
        code: 33,
        name: 'BCO SANTANDER (BRASIL) S.A.',
        fullName: 'BANCO SANTANDER (BRASIL) S.A.',
      },
      {
        ispb: 91884981,
        code: 217,
        name: 'BANCO JOHN DEERE S.A.',
        fullName: 'Banco John Deere S.A.',
      },
      {
        ispb: 92702067,
        code: 41,
        name: 'BCO DO ESTADO DO RS S.A.',
        fullName: 'Banco do Estado do Rio Grande do Sul S.A.',
      },
      {
        ispb: 92856905,
        code: 117,
        name: 'ADVANCED CC LTDA',
        fullName: 'ADVANCED CORRETORA DE CÂMBIO LTDA',
      },
      {
        ispb: 92874270,
        code: 654,
        name: 'BCO DIGIMAIS S.A.',
        fullName: 'BANCO DIGIMAIS S.A.',
      },
      {
        ispb: 92875780,
        code: 371,
        name: 'WARREN CVMC LTDA',
        fullName: 'WARREN CORRETORA DE VALORES MOBILIÁRIOS E CÂMBIO LTDA.',
      },
      {
        ispb: 92894922,
        code: 212,
        name: 'BANCO ORIGINAL',
        fullName: 'Banco Original S.A.',
      },
      {
        ispb: 94968518,
        code: 289,
        name: 'EFX CC LTDA.',
        fullName: 'EFX CORRETORA DE CÂMBIO LTDA.',
      },
    ],
  });

  await prisma.flag.createMany({
    data: [
      { name: 'Visa' },
      { name: 'Mastercard' },
      { name: 'American Express' },
      { name: 'Elo' },
      { name: 'Discover' },
      { name: 'Diners Club' },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
