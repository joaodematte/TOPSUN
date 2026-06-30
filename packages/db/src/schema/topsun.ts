import { sql } from "drizzle-orm";
import {
  mysqlTable,
  index,
  primaryKey,
  int,
  varchar,
  decimal,
  date,
  time,
  datetime,
  smallint,
  json,
  unique,
  text,
  tinyint,
  longtext,
  timestamp,
  bigint,
} from "drizzle-orm/mysql-core";

export const adicionaisProposta = mysqlTable(
  "adicionais_proposta",
  {
    coletaAdd: int("coleta_add").notNull(),
    custoUnitAdd: decimal("custoUnit_add", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    idAdd: int("id_add").autoincrement().notNull(),
    materialAdd: int("material_add").notNull(),
    precoUnitAdd: decimal("precoUnit_add", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    propostaAdd: int("proposta_add").notNull(),
    qtdAdd: int("qtd_add").notNull(),
    unidadeAdd: varchar("unidade_add", { length: 100 }).notNull(),
    valorFinalAdd: decimal("valorFinal_add", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
  },
  (table) => [
    index("coleta_add").on(table.coletaAdd),
    primaryKey({ columns: [table.idAdd], name: "adicionais_proposta_id_add" }),
  ]
);

export const agendamentos = mysqlTable(
  "agendamentos",
  {
    codCliente: int("cod_cliente").notNull(),
    codUsuario: int("cod_usuario").notNull(),
    coletaAgendamento: int("coleta_agendamento"),
    descricaoAgendamento: varchar("descricao_agendamento", {
      length: 2000,
    }).notNull(),
    dtFimAgendamento: date("dt_fim_agendamento", { mode: "string" }),
    dtInicioAgendamento: date("dt_inicio_agendamento", { mode: "string" }),
    horaFimAgendamento: time("hora_fim_agendamento"),
    horaInicioAgendamento: time("hora_inicio_agendamento"),
    idAgendamento: int("id_agendamento").autoincrement().notNull(),
    obsFimAgendamento: varchar("obs_fim_agendamento", { length: 500 }),
    statusAgendamento: int("status_agendamento").notNull(),
    statusFollowupAgendamento: int("statusFollowup_agendamento").notNull(),
    tipoAgendamento: int("tipo_agendamento"),
    urgenciaAgendamento: int("urgencia_agendamento").notNull(),
    userColetaAgendamento: int("user_coleta_agendamento"),
  },
  (table) => [
    index("coleta_agendamento").on(table.coletaAgendamento),
    primaryKey({
      columns: [table.idAgendamento],
      name: "agendamentos_id_agendamento",
    }),
  ]
);

export const aliquotas = mysqlTable(
  "aliquotas",
  {
    concessionariaAliquota: varchar("concessionaria_aliquota", {
      length: 50,
    }).notNull(),
    estadoAliquota: varchar("estado_aliquota", { length: 30 }).notNull(),
    icmsBaseAliquota: decimal("icmsBase_aliquota", {
      precision: 10,
      scale: 2,
    }).notNull(),
    icmsSubsidiadoAliquota: decimal("icmsSubsidiado_aliquota", {
      precision: 10,
      scale: 2,
    }).notNull(),
    idAliquota: int("id_aliquota").autoincrement().notNull(),
    mesAnoAliquota: varchar("mesAno_aliquota", { length: 20 }).notNull(),
    pisCofinsAliquota: decimal("pisCofins_aliquota", {
      precision: 10,
      scale: 2,
    }).notNull(),
    statusAliquota: int("status_aliquota").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idAliquota], name: "aliquotas_id_aliquota" }),
  ]
);

export const analisesSombreamentos = mysqlTable(
  "analises_sombreamentos",
  {
    coletaAnalise: int("coleta_analise").notNull(),
    idAnalise: int("id_analise").autoincrement().notNull(),
    mesAnalise: varchar("mes_analise", { length: 20 }).notNull(),
    valorAnalise: int("valor_analise").notNull(),
  },
  (table) => [
    index("coleta_analise").on(table.coletaAnalise),
    primaryKey({
      columns: [table.idAnalise],
      name: "analises_sombreamentos_id_analise",
    }),
  ]
);

export const anexosConclusao = mysqlTable(
  "anexos_conclusao",
  {
    caminhoAnexoConclusao: varchar("caminho_anexo_conclusao", {
      length: 500,
    }).notNull(),
    categoriaAnexoConclusao: int("categoria_anexo_conclusao").notNull(),
    codColetaAnexoConclusao: int("codColeta_anexo_conclusao").notNull(),
    idAnexoConclusao: int("id_anexo_conclusao").autoincrement().notNull(),
    nomeArquivoAnexoConclusao: varchar("nomeArquivo_anexo_conclusao", {
      length: 100,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idAnexoConclusao],
      name: "anexos_conclusao_id_anexo_conclusao",
    }),
  ]
);

export const anotacoesProjeto = mysqlTable(
  "anotacoes_projeto",
  {
    dataExclusaoAnotacao: datetime("data_exclusao_anotacao", {
      mode: "string",
    }),
    datetimeAnotacao: datetime("datetime_anotacao", {
      mode: "string",
    }).notNull(),
    descricaoAnotacao: varchar("descricao_anotacao", {
      length: 3000,
    }).notNull(),
    idAnotacao: int("id_anotacao").autoincrement().notNull(),
    projetoAnotacao: int("projeto_anotacao").notNull(),
    statusAnotacao: int("status_anotacao").notNull(),
    tipoAnotacao: int("tipo_anotacao").notNull(),
    userAnotacao: int("user_anotacao").notNull(),
    userExclusaoAnotacao: int("user_exclusao_anotacao"),
  },
  (table) => [
    index("projeto_anotacao").on(table.projetoAnotacao),
    primaryKey({
      columns: [table.idAnotacao],
      name: "anotacoes_projeto_id_anotacao",
    }),
  ]
);

export const apiLogs = mysqlTable(
  "api_logs",
  {
    criadoEm: datetime("criado_em", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    curlErro: varchar("curl_erro", { length: 500 }),
    endpoint: varchar({ length: 255 }).default("topsun-vendido").notNull(),
    httpCode: smallint("http_code"),
    id: int().autoincrement().notNull(),
    idCliente: int("id_cliente", { unsigned: true }),
    idColeta: int("id_coleta").notNull(),
    idProposta: varchar("id_proposta", { length: 50 }),
    leadId: varchar("lead_id", { length: 100 }),
    mensagem: varchar({ length: 500 }),
    payload: json(),
    resposta: json(),
    sucesso: tinyint().default(0).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "api_logs_id" })]
);

export const arquivosInformativo = mysqlTable(
  "arquivos_informativo",
  {
    caminhoArquivoInformativo: varchar("caminho_arquivo_informativo", {
      length: 255,
    }).notNull(),
    codArquivoInformativo: int("cod_arquivo_informativo").notNull(),
    idArquivoInformativo: int("id_arquivo_informativo")
      .autoincrement()
      .notNull(),
    statusArquivoInformativo: int("status_arquivo_informativo").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idArquivoInformativo],
      name: "arquivos_informativo_id_arquivo_informativo",
    }),
  ]
);

export const arquivosSerasa = mysqlTable(
  "arquivos_serasa",
  {
    caminhoArqSerasa: varchar("caminho_arq_serasa", { length: 200 }).notNull(),
    coletaArqSerasa: int("coleta_arq_serasa").notNull(),
    idArqSerasa: int("id_arq_serasa").autoincrement().notNull(),
    nomeArqSerasa: varchar("nome_arq_serasa", { length: 200 }).notNull(),
  },
  (table) => [
    index("coleta_arq_serasa").on(table.coletaArqSerasa),
    primaryKey({
      columns: [table.idArqSerasa],
      name: "arquivos_serasa_id_arq_serasa",
    }),
  ]
);

export const arquivosSketchup = mysqlTable(
  "arquivos_sketchup",
  {
    caminhoSketchup: varchar("caminho_sketchup", { length: 300 }).notNull(),
    coletaSketchup: int("coleta_sketchup").notNull(),
    idSketchup: int("id_sketchup").autoincrement().notNull(),
    nomeSketchup: varchar("nome_sketchup", { length: 300 }).notNull(),
  },
  (table) => [
    index("coleta_sketchup").on(table.coletaSketchup),
    primaryKey({
      columns: [table.idSketchup],
      name: "arquivos_sketchup_id_sketchup",
    }),
  ]
);

export const assinantesDocumentos = mysqlTable(
  "assinantes_documentos",
  {
    codUsuarioAssinante: int("cod_usuario_assinante").notNull(),
    idAssinante: int("id_assinante").autoincrement().notNull(),
    statusAssinante: int("status_assinante").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idAssinante],
      name: "assinantes_documentos_id_assinante",
    }),
  ]
);

export const bancosDados = mysqlTable(
  "bancos_dados",
  {
    categoriaBanco: varchar("categoria_banco", { length: 255 }).notNull(),
    hostBanco: varchar("host_banco", { length: 255 }).notNull(),
    idBanco: int("id_banco").autoincrement().notNull(),
    nomeBanco: varchar("nome_banco", { length: 255 }).notNull(),
    senhaBanco: varchar("senha_banco", { length: 255 }).notNull(),
    statusBanco: int("status_banco").notNull(),
    usuarioBanco: varchar("usuario_banco", { length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idBanco], name: "bancos_dados_id_banco" }),
  ]
);

export const bancosRecebedores = mysqlTable(
  "bancos_recebedores",
  {
    agenciaBanco: varchar("agencia_banco", { length: 20 }).notNull(),
    codigoBanco: varchar("codigo_banco", { length: 11 }).notNull(),
    contaBanco: varchar("conta_banco", { length: 20 }).notNull(),
    idBanco: int("id_banco").autoincrement().notNull(),
    nomeBanco: varchar("nome_banco", { length: 100 }).notNull(),
    pixBanco: varchar("pix_banco", { length: 200 }).default("").notNull(),
    statusBanco: int("status_banco").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idBanco],
      name: "bancos_recebedores_id_banco",
    }),
  ]
);

export const calendarioAlteracoesInstaladores = mysqlTable(
  "calendario_alteracoes_instaladores",
  {
    datetimeAlteracaoInstalador: datetime("datetime_alteracao_instalador", {
      mode: "string",
    }).notNull(),
    idAlteracaoInstalador: int("id_alteracao_instalador")
      .autoincrement()
      .notNull(),
    instaladorAntigoAlteracaoInstalador: int(
      "instaladorAntigo_alteracao_instalador"
    ).notNull(),
    novoinstaladorAlteracaoInstalador: int(
      "novoinstalador_alteracao_instalador"
    ).notNull(),
    usuarioAlteracaoInstalador: int("usuario_alteracao_instalador").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idAlteracaoInstalador],
      name: "calendario_alteracoes_instaladores_id_alteracao_instalador",
    }),
  ]
);

export const calendarioDatasBloqueadas = mysqlTable(
  "calendario_datas_bloqueadas",
  {
    dataDataBloqueada: date("data_data_bloqueada", {
      mode: "string",
    }).notNull(),
    idDataBloqueada: int("id_data_bloqueada").autoincrement().notNull(),
    instaladorDataBloqueada: int("instalador_data_bloqueada").notNull(),
    obsDataBloqueada: varchar("obs_data_bloqueada", { length: 500 }),
    statusDataBloqueada: int("status_data_bloqueada").default(1).notNull(),
  },
  (table) => [
    index("data_data_bloqueada").on(table.dataDataBloqueada),
    index("instalador_data_bloqueada").on(table.instaladorDataBloqueada),
    primaryKey({
      columns: [table.idDataBloqueada],
      name: "calendario_datas_bloqueadas_id_data_bloqueada",
    }),
  ]
);

export const calendarioJustificativasAtraso = mysqlTable(
  "calendario_justificativas_atraso",
  {
    chamadoJustificativaAtraso: int("chamado_justificativa_atraso"),
    clienteJustificativaAtraso: int("cliente_justificativa_atraso").notNull(),
    createdJustificativaAtraso: datetime("created_justificativa_atraso", {
      mode: "string",
    }).default(sql`(CURRENT_TIMESTAMP)`),
    datetimeJustificativaAtraso: datetime("datetime_justificativa_atraso", {
      mode: "string",
    }).notNull(),
    descricaoJustificativaAtraso: varchar("descricao_justificativa_atraso", {
      length: 500,
    }).notNull(),
    idJustificativaAtraso: int("id_justificativa_atraso")
      .autoincrement()
      .notNull(),
    osJustificativaAtraso: int("os_justificativa_atraso"),
    projetoJustificativaAtraso: int("projeto_justificativa_atraso"),
    tipoJustificativaAtraso: int("tipo_justificativa_atraso").notNull(),
    updatedJustificativaAtraso: datetime("updated_justificativa_atraso", {
      mode: "string",
    }).default(sql`(CURRENT_TIMESTAMP)`),
    usuarioJustificativaAtraso: int("usuario_justificativa_atraso").notNull(),
  },
  (table) => [
    index("idx_chamado").on(table.chamadoJustificativaAtraso),
    index("idx_usuario").on(table.usuarioJustificativaAtraso),
    primaryKey({
      columns: [table.idJustificativaAtraso],
      name: "calendario_justificativas_atraso_id_justificativa_atraso",
    }),
    unique("uk_os").on(
      table.tipoJustificativaAtraso,
      table.osJustificativaAtraso
    ),
    unique("uk_projeto").on(
      table.tipoJustificativaAtraso,
      table.projetoJustificativaAtraso
    ),
  ]
);

export const calendarioObrasIniciadas = mysqlTable(
  "calendario_obras_iniciadas",
  {
    codChamadoObraIniciada: int("codChamado_obra_iniciada"),
    codOsObraIniciada: int("codOS_obra_iniciada"),
    codProjetoObraIniciada: int("codProjeto_obra_iniciada"),
    dataHoraFimObraIniciada: datetime("dataHoraFim_obra_iniciada", {
      mode: "string",
    }),
    dataHoraInicioObraIniciada: datetime("dataHoraInicio_obra_iniciada", {
      mode: "string",
    }).notNull(),
    idObraIniciada: int("id_obra_iniciada").autoincrement().notNull(),
    statusObraIniciada: int("status_obra_iniciada").notNull(),
    tipoObraIniciada: int("tipo_obra_iniciada").notNull(),
    userFimObraIniciada: int("userFim_obra_iniciada"),
    userInicioObraIniciada: int("userInicio_obra_iniciada").notNull(),
  },
  (table) => [
    index("codOS_obra_iniciada").on(table.codOsObraIniciada),
    index("codProjeto_obra_iniciada").on(table.codProjetoObraIniciada),
    index("tipo_obra_iniciada").on(table.tipoObraIniciada),
    primaryKey({
      columns: [table.idObraIniciada],
      name: "calendario_obras_iniciadas_id_obra_iniciada",
    }),
  ]
);

export const calendarioReagendamentos = mysqlTable(
  "calendario_reagendamentos",
  {
    codChamadoCalendarioReagendamento: int(
      "codChamado_calendario_reagendamento"
    ),
    codOsCalendarioReagendamento: int("codOS_calendario_reagendamento"),
    codProjetoCalendarioReagendamento: int(
      "codProjeto_calendario_reagendamento"
    ).notNull(),
    dataFimPrevistaCalendarioReagendamento: date(
      "dataFimPrevista_calendario_reagendamento",
      { mode: "string" }
    ).notNull(),
    dataFimReagendadaCalendarioReagendamento: date(
      "dataFimReagendada_calendario_reagendamento",
      { mode: "string" }
    ).notNull(),
    dataInicioPrevistaCalendarioReagendamento: date(
      "dataInicioPrevista_calendario_reagendamento",
      { mode: "string" }
    ).notNull(),
    dataInicioReagendadaCalendarioReagendamento: date(
      "dataInicioReagendada_calendario_reagendamento",
      { mode: "string" }
    ).notNull(),
    datetimeCalendarioReagendamento: datetime(
      "datetime_calendario_reagendamento",
      { mode: "string" }
    ).notNull(),
    idCalendarioReagendamento: int("id_calendario_reagendamento")
      .autoincrement()
      .notNull(),
    justificativaCalendarioReagendamento: varchar(
      "justificativa_calendario_reagendamento",
      { length: 1000 }
    ).notNull(),
    motivoCalendarioReagendamento: int(
      "motivo_calendario_reagendamento"
    ).notNull(),
    statusCalendarioReagendamento: int(
      "status_calendario_reagendamento"
    ).notNull(),
    tipoServicoCalendarioReagendamento: int(
      "tipoServico_calendario_reagendamento"
    ).notNull(),
    userCalendarioReagendamento: int("user_calendario_reagendamento").notNull(),
  },
  (table) => [
    index("codProjeto_calendario_reagendamento").on(
      table.codProjetoCalendarioReagendamento
    ),
    index("dataInicioReagendada_calendario_reagendamento").on(
      table.dataInicioReagendadaCalendarioReagendamento
    ),
    index("dataInicioReagendada_calendario_reagendamento_2").on(
      table.dataInicioReagendadaCalendarioReagendamento
    ),
    index("motivo_calendario_reagendamento").on(
      table.motivoCalendarioReagendamento
    ),
    index("status_calendario_reagendamento").on(
      table.statusCalendarioReagendamento
    ),
    index("tipoServico_calendario_reagendamento").on(
      table.tipoServicoCalendarioReagendamento
    ),
    primaryKey({
      columns: [table.idCalendarioReagendamento],
      name: "calendario_reagendamentos_id_calendario_reagendamento",
    }),
  ]
);

export const calendarioStatusRegistros = mysqlTable(
  "calendario_status_registros",
  {
    corStatusRegistro: varchar("cor_status_registro", { length: 100 }),
    idStatusRegistro: int("id_status_registro").autoincrement().notNull(),
    nomeStatusRegistro: varchar("nome_status_registro", {
      length: 200,
    }).notNull(),
    statusStatusRegistro: int("status_status_registro").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idStatusRegistro],
      name: "calendario_status_registros_id_status_registro",
    }),
  ]
);

export const carencias = mysqlTable(
  "carencias",
  {
    idCarencia: int("id_carencia").autoincrement().notNull(),
    nomeCarencia: int("nome_carencia").notNull(),
    statusCarencia: int("status_carencia").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idCarencia], name: "carencias_id_carencia" }),
  ]
);

export const categoriaAnexosConclusao = mysqlTable(
  "categoria_anexos_conclusao",
  {
    idCategoriaAnexoConclusao: int("id_categoria_anexo_conclusao")
      .autoincrement()
      .notNull(),
    nomeCategoriaAnexoConclusao: varchar("nome_categoria_anexo_conclusao", {
      length: 50,
    }).notNull(),
    siglaCategoriaAnexoConclusao: varchar("sigla_categoria_anexo_conclusao", {
      length: 50,
    }).notNull(),
    statusCategoriaAnexoConclusao: int(
      "status_categoria_anexo_conclusao"
    ).notNull(),
    subCategoriaAnexoConclusao: int("sub_categoria_anexo_conclusao"),
  },
  (table) => [
    primaryKey({
      columns: [table.idCategoriaAnexoConclusao],
      name: "categoria_anexos_conclusao_id_categoria_anexo_conclusao",
    }),
  ]
);

export const categoriaInformativo = mysqlTable(
  "categoria_informativo",
  {
    idCategoriaInformativo: int("id_categoria_informativo").notNull(),
    nomeCategoriaInformativo: varchar("nome_categoria_informativo", {
      length: 255,
    }).notNull(),
    statusCategoriaInformativo: int("status_categoria_informativo").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCategoriaInformativo],
      name: "categoria_informativo_id_categoria_informativo",
    }),
  ]
);

export const categoriaMateriaisRequisicao = mysqlTable(
  "categoria_materiais_requisicao",
  {
    idCategoriaMaterialRequisicao: int("id_categoria_material_requisicao")
      .autoincrement()
      .notNull(),
    nomeCategoriaMaterialRequisicao: varchar(
      "nome_categoria_material_requisicao",
      { length: 100 }
    ).notNull(),
    statusCategoriaMaterialRequisicao: int(
      "status_categoria_material_requisicao"
    ).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCategoriaMaterialRequisicao],
      name: "categoria_materiais_requisicao_id_categoria_material_requisicao",
    }),
  ]
);

export const categoriasTelhado = mysqlTable(
  "categorias_telhado",
  {
    idCategoriaTelhado: int("id_categoria_telhado").autoincrement().notNull(),
    nomeCategoriaTelhado: varchar("nome_categoria_telhado", {
      length: 200,
    }).notNull(),
    siglaCategoriaTelhado: varchar("sigla_categoria_telhado", {
      length: 50,
    }).notNull(),
    statusCategoriaTelhado: int("status_categoria_telhado").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCategoriaTelhado],
      name: "categorias_telhado_id_categoria_telhado",
    }),
  ]
);

export const cfgAnexosEtapas = mysqlTable(
  "cfg_anexos_etapas",
  {
    codEtapaCfgAnexo: int("cod_etapa_cfg_anexo").notNull(),
    idCfgAnexo: int("id_cfg_anexo").autoincrement().notNull(),
    identificacaoCfgAnexo: varchar("identificacao_cfg_anexo", {
      length: 100,
    }).notNull(),
    obrigatorioCfgAnexo: tinyint("obrigatorio_cfg_anexo").notNull(),
    statusCfgAnexo: int("status_cfg_anexo").notNull(),
    tiposCfgAnexo: varchar("tipos_cfg_anexo", { length: 100 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCfgAnexo],
      name: "cfg_anexos_etapas_id_cfg_anexo",
    }),
  ]
);

export const cfgEmailsEtapas = mysqlTable(
  "cfg_emails_etapas",
  {
    codEtapaCfgEmail: int("cod_etapa_cfg_email").notNull(),
    idCfgEmail: int("id_cfg_email").autoincrement().notNull(),
    identificacaoCfgEmail: varchar("identificacao_cfg_email", {
      length: 100,
    }).notNull(),
    ignorajsCfgEmail: tinyint("ignorajs_cfg_email").default(0).notNull(),
    rotinaCfgEmail: varchar("rotina_cfg_email", { length: 100 }).notNull(),
    statusCfgEmail: int("status_cfg_email").notNull(),
    sugerirCfgEmail: varchar("sugerir_cfg_email", { length: 100 })
      .default("0")
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCfgEmail],
      name: "cfg_emails_etapas_id_cfg_email",
    }),
  ]
);

export const cfgEtapas = mysqlTable(
  "cfg_etapas",
  {
    codEtapaMotivoDesaprovaCfgEtapa: int(
      "cod_etapa_motivo_desaprova_cfg_etapa"
    ),
    codEtapaReabreDesaprovaCfgEtapa: int(
      "cod_etapa_reabre_desaprova_cfg_etapa"
    ),
    editarAnexosSemReabrirCfgEtapa: tinyint(
      "editar_anexos_sem_reabrir_cfg_etapa"
    )
      .default(0)
      .notNull(),
    editarSemReabrirCfgEtapa: tinyint("editar_sem_reabrir_cfg_etapa")
      .default(0)
      .notNull(),
    etapasFlagExibirCfgEtapa: varchar("etapas_flag_exibir_cfg_etapa", {
      length: 11,
    }),
    etapasPendentesAssinaturaCfgEtapa: varchar(
      "etapas_pendentes_assinatura_cfg_etapa",
      { length: 300 }
    ),
    idCfgEtapa: int("id_cfg_etapa").autoincrement().notNull(),
    isAssinaturaCfgEtapa: int("is_assinatura_cfg_etapa").default(0),
    msgConfirmacaoCfgEtapa: varchar("msg_confirmacao_cfg_etapa", {
      length: 500,
    }),
    nomeAnexosgeraisCfgEtapa: varchar("nome_anexosgerais_cfg_etapa", {
      length: 50,
    })
      .default("Anexos Gerais")
      .notNull(),
    nomeCampopadrao2CfgEtapa: varchar("nome_campopadrao2_cfg_etapa", {
      length: 100,
    }),
    nomeCampopadraoCfgEtapa: varchar("nome_campopadrao_cfg_etapa", {
      length: 100,
    })
      .default("Responsável")
      .notNull(),
    nomeCfgEtapa: varchar("nome_cfg_etapa", { length: 100 }).notNull(),
    nomeData1CfgEtapa: varchar("nome_data1_cfg_etapa", { length: 100 })
      .default("Data")
      .notNull(),
    nomeData2CfgEtapa: varchar("nome_data2_cfg_etapa", { length: 100 })
      .default("Data")
      .notNull(),
    nomeObsCfgEtapa: varchar("nome_obs_cfg_etapa", { length: 100 })
      .default("Observação")
      .notNull(),
    obrigatoriocampo2CfgEtapa: int("obrigatoriocampo2_cfg_etapa").default(0),
    obrigatoriocampoCfgEtapa: int("obrigatoriocampo_cfg_etapa").default(1),
    perfisCfgEtapa: varchar("perfis_cfg_etapa", { length: 100 }),
    perfisEditarCfgEtapa: varchar("perfis_editar_cfg_etapa", { length: 100 }),
    possuiAnexoCfgEtapa: tinyint("possui_anexo_cfg_etapa").notNull(),
    possuiAnexosgeraisCfgEtapa: tinyint(
      "possui_anexosgerais_cfg_etapa"
    ).notNull(),
    possuiAprovacaoCfgEtapa: tinyint("possui_aprovacao_cfg_etapa")
      .default(0)
      .notNull(),
    possuiCampopadrao2CfgEtapa: int("possui_campopadrao2_cfg_etapa").default(0),
    possuiCampopadraoCfgEtapa: tinyint("possui_campopadrao_cfg_etapa")
      .default(0)
      .notNull(),
    possuiData1CfgEtapa: tinyint("possui_data1_cfg_etapa").notNull(),
    possuiData2CfgEtapa: tinyint("possui_data2_cfg_etapa").default(0).notNull(),
    possuiEmailCfgEtapa: tinyint("possui_email_cfg_etapa").notNull(),
    possuiObsCfgEtapa: tinyint("possui_obs_cfg_etapa").notNull(),
    rotinaAuxCfgEtapa: varchar("rotina_aux_cfg_etapa", { length: 100 }),
    rotinalogAuxCfgEtapa: varchar("rotinalog_aux_cfg_etapa", { length: 100 }),
    seq1CfgEtapa: int("seq1_cfg_etapa"),
    seq2CfgEtapa: int("seq2_cfg_etapa"),
    statusCfgEtapa: int("status_cfg_etapa").notNull(),
    tabelaAuxCfgEtapa: varchar("tabela_aux_cfg_etapa", { length: 100 }),
  },
  (table) => [
    primaryKey({
      columns: [table.idCfgEtapa],
      name: "cfg_etapas_id_cfg_etapa",
    }),
  ]
);

export const cfgEtapasCategorias = mysqlTable(
  "cfg_etapas_categorias",
  {
    etapaFinalCfgCategoria: int("etapaFinal_cfg_categoria"),
    etapasCfgCategoria: varchar("etapas_cfg_categoria", {
      length: 500,
    }).notNull(),
    idCfgCategoria: int("id_cfg_categoria").autoincrement().notNull(),
    statusCfgCategoria: int("status_cfg_categoria").notNull(),
    tipopropostaCfgCategoria: varchar("tipoproposta_cfg_categoria", {
      length: 100,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCfgCategoria],
      name: "cfg_etapas_categorias_id_cfg_categoria",
    }),
  ]
);

export const cfgEtapasMatrizes = mysqlTable(
  "cfg_etapas_matrizes",
  {
    codCfgCategoria: int("cod_cfg_categoria").notNull(),
    codCfgEtapa: int("cod_cfg_etapa").notNull(),
    dependenciasCfgMatriz: varchar("dependencias_cfg_matriz", {
      length: 100,
    }).notNull(),
    idCfgMatriz: int("id_cfg_matriz").autoincrement().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCfgMatriz],
      name: "cfg_etapas_matrizes_id_cfg_matriz",
    }),
  ]
);

export const cfgServidor = mysqlTable(
  "cfg_servidor",
  {
    idCfgServidor: int("id_cfg_servidor").autoincrement().notNull(),
    ipServidorTestes: varchar("ip_servidor_testes", { length: 20 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCfgServidor],
      name: "cfg_servidor_id_cfg_servidor",
    }),
  ]
);

export const cfgSmtpEmail = mysqlTable(
  "cfg_smtp_email",
  {
    hostSmtpEmail: varchar("host_smtp_email", { length: 200 }).notNull(),
    idSmtpEmail: int("id_smtp_email").autoincrement().notNull(),
    portaSmtpEmail: int("porta_smtp_email").notNull(),
    senhaSmtpEmail: varchar("senha_smtp_email", { length: 500 }).notNull(),
    usuarioSmtpEmail: varchar("usuario_smtp_email", { length: 100 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idSmtpEmail],
      name: "cfg_smtp_email_id_smtp_email",
    }),
  ]
);

export const chaveMaps = mysqlTable(
  "chave_maps",
  {
    chaveMapa: varchar("chave_mapa", { length: 500 }).notNull(),
    idMaps: int("id_maps").autoincrement().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idMaps], name: "chave_maps_id_maps" }),
  ]
);

export const cidades = mysqlTable(
  "cidades",
  {
    estadoCidade: int("estado_cidade"),
    idCidade: int("id_cidade").notNull(),
    nomeCidade: varchar("nome_cidade", { length: 120 }),
  },
  (table) => [index("estado_cidade").on(table.estadoCidade)]
);

export const clienteColigados = mysqlTable(
  "cliente_coligados",
  {
    bairroColigado: varchar("bairro_coligado", { length: 300 }),
    cepColigado: varchar("cep_coligado", { length: 20 }),
    cidadeColigado: varchar("cidade_coligado", { length: 100 }),
    codClienteColigado: int("cod_cliente_coligado").notNull(),
    complementoColigado: varchar("complemento_coligado", { length: 200 }),
    cpfColigado: varchar("cpf_coligado", { length: 50 }).notNull(),
    emailColigado: varchar("email_coligado", { length: 500 }),
    estadoColigado: varchar("estado_coligado", { length: 2 }),
    idColigado: int("id_coligado").autoincrement().notNull(),
    mesmoEnderecoColigado: int("mesmo_endereco_coligado"),
    nascimentoColigado: date("nascimento_coligado", {
      mode: "string",
    }).notNull(),
    nomeColigado: varchar("nome_coligado", { length: 100 }).notNull(),
    nroColigado: varchar("nro_coligado", { length: 20 }),
    pessoaColigado: varchar("pessoa_coligado", { length: 5 })
      .default("f")
      .notNull(),
    rgColigado: varchar("rg_coligado", { length: 30 }).notNull(),
    ruaColigado: varchar("rua_coligado", { length: 200 }),
    statusColigado: int("status_coligado").default(1).notNull(),
    telefoneColigado: varchar("telefone_coligado", { length: 50 }),
  },
  (table) => [
    index("cod_cliente_coligado").on(table.codClienteColigado),
    primaryKey({
      columns: [table.idColigado],
      name: "cliente_coligados_id_coligado",
    }),
  ]
);

export const clientes = mysqlTable(
  "clientes",
  {
    bairroCliente: varchar("bairro_cliente", { length: 100 }),
    bloqueioPosvCliente: int("bloqueio_posv_cliente").default(0).notNull(),
    cepCliente: varchar("cep_cliente", { length: 20 }),
    cidadeCliente: varchar("cidade_cliente", { length: 100 }),
    codErpCliente: int("codErp_cliente"),
    comoConheceuCliente: varchar("como_conheceu_cliente", { length: 150 }),
    compCliente: varchar("comp_cliente", { length: 100 }),
    cpfcnpjCliente: varchar("cpfcnpj_cliente", { length: 20 }),
    dataBloqueioPosvCliente: date("dataBloqueio_posv_cliente", {
      mode: "string",
    }),
    dataCadastroCliente: date("data_cadastro_cliente", { mode: "string" }),
    emailCliente: varchar("email_cliente", { length: 100 }),
    estadoCliente: varchar("estado_cliente", { length: 100 }),
    fantasiaCliente: varchar("fantasia_cliente", { length: 100 }),
    idCliente: int("id_cliente").autoincrement().notNull(),
    inscestadualCliente: varchar("inscestadual_cliente", { length: 30 }),
    motivoBloqueioPosvCliente: varchar("motivoBloqueio_posv_cliente", {
      length: 1000,
    }),
    nascAberturaCliente: varchar("nasc_abertura_cliente", { length: 15 }),
    nomeCliente: varchar("nome_cliente", { length: 100 }),
    nroCliente: varchar("nro_cliente", { length: 20 }),
    origemCadastroCliente: int("origem_cadastro_cliente").default(0).notNull(),
    pastaCliente: varchar("pasta_cliente", { length: 350 }),
    pessoaCliente: varchar("pessoa_cliente", { length: 5 }).notNull(),
    razaosocialCliente: varchar("razaosocial_cliente", { length: 100 }),
    representanteCliente: int("representante_cliente").notNull(),
    responsavelCliente: varchar("responsavel_cliente", { length: 150 }),
    rgCliente: varchar("rg_cliente", { length: 30 }),
    ruaCliente: varchar("rua_cliente", { length: 100 }),
    statusCliente: int("status_cliente").notNull(),
    telefone1Cliente: varchar("telefone1_cliente", { length: 20 }),
    telefone2Cliente: varchar("telefone2_cliente", { length: 20 }),
    usuarioBloqueioPosvCliente: int("usuarioBloqueio_posv_cliente"),
  },
  (table) => [
    index("cidade_cliente").on(table.cidadeCliente),
    index("id_cliente").on(table.idCliente),
    index("pessoa_cliente").on(table.pessoaCliente),
    index("representante_cliente").on(table.representanteCliente),
    primaryKey({ columns: [table.idCliente], name: "clientes_id_cliente" }),
  ]
);

export const coletaDados = mysqlTable(
  "coleta_dados",
  {
    abatimentoColeta: decimal("abatimento_coleta", {
      precision: 10,
      scale: 2,
    }).notNull(),
    areaUtilColeta: int("areaUtil_coleta").notNull(),
    caminhoSolicVistoriaColeta: varchar("caminhoSolicVistoria_coleta", {
      length: 500,
    }),
    caminhoVistoriaColeta: varchar("caminhoVistoria_coleta", { length: 500 }),
    cidadeUcColeta: varchar("cidadeUC_coleta", { length: 200 }),
    classificacaoColeta: int("classificacao_coleta").notNull(),
    clienteColeta: int("cliente_coleta").notNull(),
    codEngenhariaErpColeta: varchar("codEngenhariaErp_coleta", { length: 100 }),
    codSelecaoGeradaErpColeta: int("codSelecaoGeradaErp_coleta"),
    complementoStatusFollowUpColeta: varchar(
      "complementoStatusFollowUp_coleta",
      { length: 200 }
    ),
    compraEnergiaColeta: varchar("compraEnergia_coleta", {
      length: 200,
    }).notNull(),
    concessionariaColeta: varchar("concessionaria_coleta", {
      length: 100,
    }).notNull(),
    consumoTotalColeta: int("consumoTotal_coleta").notNull(),
    dataFollowUpColeta: date("dataFollowUp_coleta", { mode: "string" }),
    dataProjetoColeta: date("dataProjeto_coleta", { mode: "string" }),
    dataReaberturaColeta: date("dataReabertura_coleta", { mode: "string" }),
    dateEncaminhamentoColeta: datetime("dateEncaminhamento_coleta", {
      mode: "string",
    }),
    datetimeColeta: datetime("datetime_coleta", { mode: "string" }).notNull(),
    demandaContratadaColeta: int("demandaContratada_coleta").notNull(),
    descricaoEngenhariaErpColeta: varchar("descricaoEngenhariaErp_coleta", {
      length: 200,
    }),
    desvio1Coleta: decimal("desvio1_coleta", { precision: 10, scale: 2 }),
    desvio2Coleta: decimal("desvio2_coleta", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    desvio3Coleta: decimal("desvio3_coleta", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    desvio4Coleta: decimal("desvio4_coleta", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    disjuntorColeta: int("disjuntor_coleta").notNull(),
    empresaColeta: int("empresa_coleta").notNull(),
    encaminhamentoColeta: int("encaminhamento_coleta").notNull(),
    estadoUcColeta: varchar("estadoUC_coleta", { length: 2 }),
    estimativaColeta: int("estimativa_coleta").notNull(),
    estruturaOrientacao1Coleta: int("estruturaOrientacao1_coleta")
      .default(0)
      .notNull(),
    estruturaOrientacao2Coleta: int("estruturaOrientacao2_coleta")
      .default(0)
      .notNull(),
    estruturaOrientacao3Coleta: int("estruturaOrientacao3_coleta")
      .default(0)
      .notNull(),
    estruturaOrientacao4Coleta: int("estruturaOrientacao4_coleta")
      .default(0)
      .notNull(),
    estruturaTelhado2Coleta: int("estruturaTelhado2_coleta"),
    estruturaTelhado3Coleta: int("estruturaTelhado3_coleta"),
    estruturaTelhadoColeta: int("estruturaTelhado_coleta").notNull(),
    fatorAjusteColeta: varchar("fatorAjuste_coleta", { length: 200 }).notNull(),
    finameColeta: int("finame_coleta").default(0).notNull(),
    grupoEmpresaColeta: varchar("grupoEmpresa_coleta", {
      length: 50,
    }).notNull(),
    grupoGeradorColeta: int("grupoGerador_coleta").notNull(),
    idColeta: int("id_coleta").autoincrement().notNull(),
    idMotivoCancelColeta: int("idMotivoCancel_coleta"),
    inclinacao1Coleta: int("inclinacao1_coleta"),
    inclinacao2Coleta: int("inclinacao2_coleta").default(0),
    inclinacao3Coleta: int("inclinacao3_coleta").default(0),
    inclinacao4Coleta: int("inclinacao4_coleta").default(0),
    inclinacaoTelhadoColeta: varchar("inclinacaoTelhado_coleta", {
      length: 100,
    }).notNull(),
    isAssinaturaColeta: int("is_assinatura_coleta").default(0),
    kitColeta: int("kit_coleta"),
    limitanteColeta: varchar("limitante_coleta", { length: 50 }).notNull(),
    mesRefFaturaColeta: varchar("mesRefFatura_coleta", {
      length: 20,
    }).notNull(),
    moduloColeta: int("modulo_coleta").notNull(),
    modulosNecessariosColeta: decimal("modulosNecessarios_coleta", {
      precision: 10,
      scale: 1,
    }).notNull(),
    motivoCancelColeta: varchar("motivoCancel_coleta", { length: 1000 }),
    motivoEncaminhamentoColeta: varchar("motivoEncaminhamento_coleta", {
      length: 1000,
    }),
    motivoReaberturaColeta: varchar("motivoReabertura_coleta", {
      length: 1000,
    }),
    obsColeta: varchar("obs_coleta", { length: 1000 }).notNull(),
    obsVistoriaColeta: varchar("obsVistoria_coleta", { length: 2000 }),
    orientacao1Coleta: int("orientacao1_coleta"),
    orientacao2Coleta: int("orientacao2_coleta").default(0),
    orientacao3Coleta: int("orientacao3_coleta").default(0),
    orientacao4Coleta: int("orientacao4_coleta").default(0),
    orientacaoSolarColeta: int("orientacaoSolar_coleta").notNull(),
    performanceRationColeta: int("performanceRation_coleta").notNull(),
    potenciaColeta: varchar("potencia_coleta", { length: 20 }).notNull(),
    potenciaModuloColeta: int("potenciaModulo_coleta").notNull(),
    potenciaTransformadorColeta: int("potenciaTransformador_coleta").notNull(),
    pronafColeta: int("pronaf_coleta").notNull(),
    qtdEstruturasColeta: int("qtdEstruturas_coleta").default(0).notNull(),
    qtdModulos1Coleta: int("qtdModulos1_coleta"),
    qtdModulos2Coleta: int("qtdModulos2_coleta").default(0),
    qtdModulos3Coleta: int("qtdModulos3_coleta").default(0),
    qtdModulos4Coleta: int("qtdModulos4_coleta").default(0),
    qtdModulosColeta: int("qtdModulos_coleta").notNull(),
    qtdOrientacoesColeta: int("qtdOrientacoes_coleta"),
    qtdTelhadosColeta: int("qtdTelhados_coleta").default(0).notNull(),
    qtdUcColeta: int("qtdUC_coleta").notNull(),
    reaberturaColeta: int("reabertura_coleta"),
    regiaoVendaColeta: int("regiaoVenda_coleta"),
    revisaoAtualColeta: int("revisaoAtual_coleta").notNull(),
    simplificadaColeta: tinyint("simplificada_coleta").default(0).notNull(),
    sombreamentosColeta: int("sombreamentos_coleta").notNull(),
    statusColeta: int("status_coleta").notNull(),
    statusFollowUpColeta: int("statusFollowUp_coleta"),
    telhadoOrientacao1Coleta: int("telhadoOrientacao1_coleta")
      .default(0)
      .notNull(),
    telhadoOrientacao2Coleta: int("telhadoOrientacao2_coleta")
      .default(0)
      .notNull(),
    telhadoOrientacao3Coleta: int("telhadoOrientacao3_coleta")
      .default(0)
      .notNull(),
    telhadoOrientacao4Coleta: int("telhadoOrientacao4_coleta")
      .default(0)
      .notNull(),
    tensaoColeta: varchar("tensao_coleta", { length: 20 }).notNull(),
    tipoColeta: varchar("tipo_coleta", { length: 50 }).notNull(),
    tipoEncaminhamentoColeta: varchar("tipoEncaminhamento_coleta", {
      length: 200,
    }).notNull(),
    tipoInstalacaoColeta: int("tipoInstalacao_coleta").notNull(),
    tipoTelhado2Coleta: int("tipoTelhado2_coleta"),
    tipoTelhado3Coleta: int("tipoTelhado3_coleta"),
    tipoTelhadoColeta: int("tipoTelhado_coleta").notNull(),
    tipoVendaColeta: int("tipoVenda_coleta").notNull(),
    ucPrincipalColeta: varchar("UCPrincipal_coleta", { length: 50 }).notNull(),
    userColeta: int("user_coleta").notNull(),
    userEncaminhamentoColeta: int("userEncaminhamento_coleta"),
    userReaberturaColeta: int("userReabertura_coleta"),
    vendedorColeta: int("vendedor_coleta").notNull(),
  },
  (table) => [
    index("cliente_coleta").on(table.clienteColeta),
    index("id_coleta").on(table.idColeta),
    index("status_coleta").on(table.statusColeta),
    primaryKey({ columns: [table.idColeta], name: "coleta_dados_id_coleta" }),
  ]
);

export const coligadosInativos = mysqlTable(
  "coligados_inativos",
  {
    bairroColigadoInativo: varchar("bairro_coligado_inativo", { length: 300 }),
    cepColigadoInativo: varchar("cep_coligado_inativo", { length: 20 }),
    cidadeColigadoInativo: varchar("cidade_coligado_inativo", { length: 100 }),
    clienteColigadoInativo: int("cliente_coligado_inativo").notNull(),
    complementoColigadoInativo: varchar("complemento_coligado_inativo", {
      length: 200,
    }),
    cpfColigadoInativo: varchar("cpf_coligado_inativo", {
      length: 30,
    }).notNull(),
    dataAlteracaoInativo: datetime("dataAlteracao_inativo", {
      mode: "string",
    }).notNull(),
    estadoColigadoInativo: varchar("estado_coligado_inativo", { length: 2 }),
    idColigadoInativo: int("id_coligado_inativo").autoincrement().notNull(),
    mesmoEnderecoInativo: int("mesmo_endereco_inativo"),
    nascColigadoInativo: date("nasc_coligado_inativo", {
      mode: "string",
    }).notNull(),
    nomeColigadoInativo: varchar("nome_coligado_inativo", {
      length: 200,
    }).notNull(),
    nroColigadoInativo: varchar("nro_coligado_inativo", { length: 20 }),
    rgColigadoInativo: int("rg_coligado_inativo").notNull(),
    ruaColigadoInativo: varchar("rua_coligado_inativo", { length: 200 }),
    userInativo: int("user_inativo").notNull(),
  },
  (table) => [
    index("cliente_coligado_inativo").on(table.clienteColigadoInativo),
    primaryKey({
      columns: [table.idColigadoInativo],
      name: "coligados_inativos_id_coligado_inativo",
    }),
  ]
);

export const comissoesAprovadas = mysqlTable(
  "comissoes_aprovadas",
  {
    anoComissaoAprovada: int("ano_comissao_aprovada").notNull(),
    clienteComissaoAprovada: int("cliente_comissao_aprovada").notNull(),
    coletaComissaoAprovada: int("coleta_comissao_aprovada").notNull(),
    datahoraComissaoAprovada: datetime("datahora_comissao_aprovada", {
      mode: "string",
    }).notNull(),
    idComissaoAprovada: int("id_comissao_aprovada").autoincrement().notNull(),
    mesComissaoAprovada: int("mes_comissao_aprovada").notNull(),
    percentualComissaoAprovada: decimal("percentual_comissao_aprovada", {
      precision: 10,
      scale: 2,
    }).notNull(),
    statusComissaoAprovada: int("status_comissao_aprovada").notNull(),
    userComissaoAprovada: int("user_comissao_aprovada").notNull(),
    valorComissaoAprovada: decimal("valor_comissao_aprovada", {
      precision: 10,
      scale: 2,
    }).notNull(),
    vendedorComissaoAprovada: int("vendedor_comissao_aprovada").notNull(),
  },
  (table) => [
    index("coleta_comissao_aprovada").on(table.coletaComissaoAprovada),
    primaryKey({
      columns: [table.idComissaoAprovada],
      name: "comissoes_aprovadas_id_comissao_aprovada",
    }),
  ]
);

export const comissoesAprovadasPeriodo = mysqlTable(
  "comissoes_aprovadas_periodo",
  {
    anoAprovadaPeriodo: int("ano_aprovada_periodo").notNull(),
    datetimeAprovadaPeriodo: datetime("datetime_aprovada_periodo", {
      mode: "string",
    }).notNull(),
    idAprovadaPeriodo: int("id_aprovada_periodo").autoincrement().notNull(),
    mesAprovadaPeriodo: int("mes_aprovada_periodo").notNull(),
    somaAprovadaPeriodo: decimal("soma_aprovada_periodo", {
      precision: 10,
      scale: 2,
    }).notNull(),
    statusAprovadaPeriodo: int("status_aprovada_periodo").notNull(),
    userAprovadaPeriodo: int("user_aprovada_periodo").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idAprovadaPeriodo],
      name: "comissoes_aprovadas_periodo_id_aprovada_periodo",
    }),
  ]
);

export const comissoesEmails = mysqlTable(
  "comissoes_emails",
  {
    anoComissaoEmail: int("ano_comissao_email").notNull(),
    destinatarioComissaoEmail: varchar("destinatario_comissao_email", {
      length: 150,
    }).notNull(),
    idComissaoEmail: int("id_comissao_email").autoincrement().notNull(),
    mesComissaoEmail: int("mes_comissao_email").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idComissaoEmail],
      name: "comissoes_emails_id_comissao_email",
    }),
  ]
);

export const comissoesFiliais = mysqlTable(
  "comissoes_filiais",
  {
    codAprovadorFilial: int("cod_aprovador_filial").notNull(),
    codColetaFilial: int("cod_coleta_filial").notNull(),
    codEmpresaFilial: int("cod_empresa_filial").notNull(),
    codPropostaFilial: int("cod_proposta_filial").notNull(),
    datahoraFilial: datetime("datahora_filial", { mode: "string" }).notNull(),
    idComissaoFilial: int("id_comissao_filial").autoincrement().notNull(),
    porcentagemFilial: decimal("porcentagem_filial", {
      precision: 10,
      scale: 2,
    }).notNull(),
    tipoComissaoFilial: int("tipo_comissao_filial").notNull(),
    valorFilial: decimal("valor_filial", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [
    index("cod_coleta_filial").on(table.codColetaFilial),
    index("tipo_comissao_filial").on(table.tipoComissaoFilial),
    primaryKey({
      columns: [table.idComissaoFilial],
      name: "comissoes_filiais_id_comissao_filial",
    }),
  ]
);

export const comissoesVendedores = mysqlTable(
  "comissoes_vendedores",
  {
    codAprovadorComissao: int("cod_aprovador_comissao").notNull(),
    codColetaComissao: int("cod_coleta_comissao").notNull(),
    codPropostaComissao: int("cod_proposta_comissao").notNull(),
    codVendedorComissao: int("cod_vendedor_comissao").notNull(),
    datahoraComissao: datetime("datahora_comissao", {
      mode: "string",
    }).notNull(),
    idComissao: int("id_comissao").autoincrement().notNull(),
    porcentagemComissao: decimal("porcentagem_comissao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    tipoComissao: int("tipo_comissao").notNull(),
    valorComissao: decimal("valor_comissao", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    index("cod_coleta_comissao").on(table.codColetaComissao),
    index("tipo_comissao").on(table.tipoComissao),
    primaryKey({
      columns: [table.idComissao],
      name: "comissoes_vendedores_id_comissao",
    }),
  ]
);

export const contratos = mysqlTable(
  "contratos",
  {
    caminhoContrato: varchar("caminho_contrato", { length: 1000 }),
    clienteContrato: int("cliente_contrato").notNull(),
    codColigadoContrato: int("cod_coligado_contrato"),
    coletaContrato: int("coleta_contrato").notNull(),
    coligadoContrato: int("coligado_contrato").notNull(),
    dataContrato: datetime("data_contrato", { mode: "string" }).notNull(),
    dataEmailContrato: date("dataEmail_contrato", { mode: "string" }),
    horaEmailContrato: time("horaEmail_contrato"),
    idContrato: int("id_contrato").autoincrement().notNull(),
    origemContrato: int("origem_contrato").default(1).notNull(),
    propostaContrato: int("proposta_contrato").notNull(),
    revisaoContrato: int("revisao_contrato").notNull(),
    rsiContrato: int("rsi_contrato").notNull(),
    statusContrato: int("status_contrato").notNull(),
    userContrato: int("user_contrato").notNull(),
    userEmailContrato: int("userEmail_contrato"),
  },
  (table) => [
    index("coleta_contrato").on(table.coletaContrato),
    primaryKey({ columns: [table.idContrato], name: "contratos_id_contrato" }),
  ]
);

export const custosAssumidos = mysqlTable(
  "custos_assumidos",
  {
    idCustoAssumido: int("id_custo_assumido").autoincrement().notNull(),
    nomeCustoAssumido: varchar("nome_custo_assumido", {
      length: 500,
    }).notNull(),
    statusCustoAssumido: int("status_custo_assumido").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCustoAssumido],
      name: "custos_assumidos_id_custo_assumido",
    }),
  ]
);

export const custosInstalacao = mysqlTable(
  "custos_instalacao",
  {
    dataCustoinst: date("data_custoinst", { mode: "string" }).notNull(),
    idCustoinst: int("id_custoinst").autoincrement().notNull(),
    maxModulosCustoinst: int("maxModulos_custoinst").notNull(),
    minModulosCustoinst: int("minModulos_custoinst").notNull(),
    statusCustoinst: int("status_custoinst").notNull(),
    tabelaCustoinst: int("tabela_custoinst").notNull(),
    valorAmpliacaoCustoinst: decimal("valorAmpliacao_custoinst", {
      precision: 10,
      scale: 2,
    }),
    valorCustoinst: decimal("valor_custoinst", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCustoinst],
      name: "custos_instalacao_id_custoinst",
    }),
  ]
);

export const dadosEmissaoContrato = mysqlTable(
  "dados_emissao_contrato",
  {
    adequacaoDisjuntorEmissao: int("adequacao_disjuntor_emissao"),
    adequacaoSubestacaoEmissao: decimal("adequacao_subestacao_emissao", {
      precision: 10,
      scale: 2,
    }),
    agenciaIndicadorEmissao: varchar("agencia_indicador_emissao", {
      length: 20,
    }),
    alturaTelhadoEmissao: decimal("altura_telhado_emissao", {
      precision: 10,
      scale: 2,
    }),
    aprovacaoEmissao: tinyint("aprovacao_emissao").default(2),
    assinaturaDigitalEmissao: int("assinatura_digital_emissao").default(0),
    bancoFinanciamentoEmissao: varchar("banco_financiamento_emissao", {
      length: 100,
    }),
    bancoIndicadorEmissao: varchar("banco_indicador_emissao", { length: 100 }),
    bancorecEntradaEmissao: int("bancorec_entrada_emissao"),
    bancorecFinanciamentoEmissao: int("bancorec_financiamento_emissao"),
    carenciaEmissao: varchar("carencia_emissao", { length: 50 }),
    codColetaEmissao: int("cod_coleta_emissao").notNull(),
    codColigadoEmissao: int("cod_coligado_emissao"),
    condicaoPgtoParcelaEmissao: varchar("condicao_pgto_parcela_emissao", {
      length: 300,
    }),
    contaIndicadorEmissao: varchar("conta_indicador_emissao", { length: 20 }),
    cpfIndicadorEmissao: varchar("cpf_indicador_emissao", { length: 20 }),
    dataAvistaEntradaEmissao: date("data_avista_entrada_emissao", {
      mode: "string",
    }),
    dataEntregaAgendamentoEmissao: date("dataEntregaAgendamento_emissao", {
      mode: "string",
    }),
    dataPrevisaoEntradaEmissao: date("data_previsao_entrada_emissao", {
      mode: "string",
    }),
    dataTabelaEmissao: varchar("data_tabela_emissao", { length: 15 }),
    datasConsiderarEmissao: int("datas_considerar_emissao").default(0),
    distAcomodaEquipEmissao: decimal("dist_acomoda_equip_emissao", {
      precision: 10,
      scale: 2,
    }),
    estCustoMaterialAdcEmissao: decimal("est_custo_material_adc_emissao", {
      precision: 10,
      scale: 2,
    }),
    estaEmObrasEmissao: tinyint("esta_em_obras_emissao"),
    estaEmObrasEmissaoAgendamento: int("esta_em_obras_emissao_agendamento"),
    financPossuiEntradaEmissao: tinyint("financ_possui_entrada_emissao"),
    formaPgtoEntradaEmissao: varchar("forma_pgto_entrada_emissao", {
      length: 50,
    }),
    formaPgtoSaldoEmissao: varchar("forma_pgto_saldo_emissao", { length: 50 }),
    geraBoletoEmissao: tinyint("gera_boleto_emissao").default(0),
    idEmissao: int("id_emissao").autoincrement().notNull(),
    instaladorEmissao: int("instalador_emissao"),
    iofEmissao: decimal("iof_emissao", { precision: 10, scale: 2 }),
    jurosEmissao: decimal("juros_emissao", { precision: 10, scale: 2 }),
    localAcomodaEquipEmissao: varchar("local_acomoda_equip_emissao", {
      length: 100,
    }),
    materialAdcPorContaEmissao: int("material_adc_por_conta_emissao"),
    nomeIndicadorEmissao: varchar("nome_indicador_emissao", { length: 100 }),
    obsAprovacaoEmissao: varchar("obs_aprovacao_emissao", { length: 500 }),
    obsAvistaOutrosEmissao: varchar("obs_avista_outros_emissao", {
      length: 300,
    }),
    obsEntrada2Emissao: varchar("obs_entrada_2_emissao", { length: 500 }),
    obsParaContratoEmissao: varchar("obs_para_contrato_emissao", {
      length: 1000,
    }),
    obsParaGestaoEmissao: varchar("obs_para_gestao_emissao", { length: 1000 }),
    obsPgtoEntradaEmissao: varchar("obs_pgto_entrada_emissao", { length: 300 }),
    obsRecproprioOutrosEmissao: varchar("obs_recproprio_outros_emissao", {
      length: 300,
    }),
    parcelasEmissao: int("parcelas_emissao"),
    percComissaoIndicadorEmissao: decimal("perc_comissao_indicador_emissao", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    percComissaoPadraoVendedorEmissao: decimal(
      "perc_comissaoPadrao_vendedor_emissao",
      { precision: 10, scale: 2 }
    ),
    percComissaoVendedorEmissao: decimal("perc_comissao_vendedor_emissao", {
      precision: 10,
      scale: 2,
    }),
    percMargemLucroEmissao: decimal("perc_margem_lucro_emissao", {
      precision: 10,
      scale: 2,
    }),
    percTotalComissaoEmissao: decimal("perc_total_comissao_emissao", {
      precision: 10,
      scale: 2,
    }),
    periodoInstalacaoEmissao: text("periodo_instalacao_emissao"),
    pixIndicadorEmissao: varchar("pix_indicador_emissao", { length: 100 }),
    possuiAdeqSubestacaoEmissao: tinyint("possui_adeq_subestacao_emissao"),
    possuiFotovoltaicoEmissao: tinyint("possui_fotovoltaico_emissao"),
    possuiIndicadorEmissao: tinyint("possui_indicador_emissao"),
    prazoInstEquipEmissao: int("prazo_inst_equip_emissao").default(90),
    precoTabelaEmissao: decimal("preco_tabela_emissao", {
      precision: 10,
      scale: 2,
    }),
    prevConclusaoObrasAgendamentoEmissao: date(
      "prev_conclusao_obras_agendamento_emissao",
      { mode: "string" }
    ),
    prevConclusaoObrasEmissao: date("prev_conclusao_obras_emissao", {
      mode: "string",
    }),
    qtdAjusteInclinacaoEmissao: int("qtd_ajuste_inclinacao_emissao"),
    saldoRestanteEmissao: decimal("saldo_restante_emissao", {
      precision: 10,
      scale: 2,
    }),
    statusEmissao: int("status_emissao"),
    tabelaCustoInstalacaoEmissao: int("tabela_custo_instalacao_emissao"),
    tipoPgtoEmissao: int("tipo_pgto_emissao"),
    tipoTrocaDisjuntorEmissao: varchar("tipo_troca_disjuntor_emissao", {
      length: 50,
    }),
    topsunManutencaoPreventivaEmissao: varchar(
      "topsun_manutencao_preventiva_emissao",
      { length: 45 }
    ),
    topsunManutencaoSeguroEmissao: varchar("topsun_manutencao_seguro_emissao", {
      length: 45,
    }),
    topsunSeguroEmissao: varchar("topsun_seguro_emissao", { length: 45 }),
    usarColigadoEmissao: tinyint("usar_coligado_emissao").default(0),
    valorEntrada2Emissao: decimal("valor_entrada_2_emissao", {
      precision: 10,
      scale: 2,
    }),
    valorEntradaEmissao: decimal("valor_entrada_emissao", {
      precision: 10,
      scale: 2,
    }),
    valorInvestimentoEmissao: decimal("valor_investimento_emissao", {
      precision: 10,
      scale: 2,
    }),
    valorParcelaEmissao: decimal("valor_parcela_emissao", {
      precision: 10,
      scale: 2,
    }),
    vendidoAquecimentoEmissao: tinyint("vendido_aquecimento_emissao"),
    vlrAvistaEntradaEmissao: decimal("vlr_avista_entrada_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrAvistaFatEmissao: decimal("vlr_avista_fat_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrAvistaInstEmissao: decimal("vlr_avista_inst_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrAvistaOutrosEmissao: decimal("vlr_avista_outros_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrComissaoIndicadorEmissao: decimal("vlr_comissao_indicador_emissao", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    vlrCustoFinanceiroCompraEmissao: decimal(
      "vlr_custo_financeiro_compra_emissao",
      { precision: 10, scale: 2 }
    ),
    vlrCustoFinanzeroEmissao: decimal("vlr_custo_finanzero_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrCustoInstalacaoEmissao: decimal("vlr_custo_instalacao_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrCustoKitEmissao: decimal("vlr_custo_kit_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrCustosTotaisEmissao: decimal("vlr_custos_totais_emissao", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    vlrCustounInstalacaoEmissao: decimal("vlr_custoun_instalacao_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrEngenhariaEmissao: decimal("vlr_engenharia_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrImpostosEmissao: decimal("vlr_impostos_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrItensAdicionaisEmissao: decimal("vlr_itens_adicionais_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrLucroLiquidoEmissao: decimal("vlr_lucro_liquido_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrMaterialAdcEmissao: decimal("vlr_material_adc_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrOperacionalEmissao: decimal("vlr_operacional_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrRecproprioFatEmissao: decimal("vlr_recproprio_fat_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrRecproprioInstEmissao: decimal("vlr_recproprio_inst_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrRecproprioOutrosEmissao: decimal("vlr_recproprio_outros_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrTotalComissaoEmissao: decimal("vlr_total_comissao_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrtabCustoInstalacaoEmissao: decimal("vlrtab_custo_instalacao_emissao", {
      precision: 10,
      scale: 2,
    }),
    vlrtabCustounInstalacaoEmissao: decimal(
      "vlrtab_custoun_instalacao_emissao",
      { precision: 10, scale: 2 }
    ),
  },
  (table) => [
    index("cod_coleta_emissao").on(table.codColetaEmissao),
    index("idx_emissao_coleta_instalador").on(
      table.codColetaEmissao,
      table.instaladorEmissao
    ),
    primaryKey({
      columns: [table.idEmissao],
      name: "dados_emissao_contrato_id_emissao",
    }),
  ]
);

export const dadosEtpArtReq = mysqlTable(
  "dados_etp_art_req",
  {
    codColetaDados: int("cod_coleta_dados").notNull(),
    codEtapaDados: int("cod_etapa_dados").notNull(),
    engenheiroResponsavelArtDados: int(
      "engenheiro_responsavel_art_dados"
    ).notNull(),
    enviarAutFaturaDados: tinyint("enviar_aut_fatura_dados"),
    enviarDecCovidDados: tinyint("enviar_dec_covid_dados"),
    idDados: int("id_dados").autoincrement().notNull(),
  },
  (table) => [
    index("cod_coleta_dados").on(table.codColetaDados),
    primaryKey({
      columns: [table.idDados],
      name: "dados_etp_art_req_id_dados",
    }),
  ]
);

export const dadosEtpConclusaoInstalacao = mysqlTable(
  "dados_etp_conclusao_instalacao",
  {
    caMetrosInstalacao: varchar("ca_metros_instalacao", { length: 45 }),
    caMotivoInstalacao: varchar("ca_motivo_instalacao", { length: 45 }),
    caboCaInstalacao: varchar("cabo_ca_instalacao", { length: 45 }),
    caboCcInstalacao: varchar("cabo_cc_instalacao", { length: 45 }),
    categoriasPendenciasInstalacao: varchar(
      "categorias_pendencias_instalacao",
      { length: 1000 }
    ),
    ccMetrosInstalacao: varchar("cc_metros_instalacao", { length: 45 }),
    ccMotivoInstalacao: varchar("cc_motivo_instalacao", { length: 45 }),
    coletaDadosInstalacao: int("coleta_dados_instalacao").notNull(),
    custoInstalacao: decimal("custo_instalacao", { precision: 10, scale: 2 }),
    idDadosInstalacao: int("id_dados_instalacao").autoincrement().notNull(),
    justificativaInstalacao: varchar("justificativa_instalacao", {
      length: 1000,
    }),
    justificativaPendenciasInstalacao: varchar(
      "justificativa_pendencias_instalacao",
      { length: 1000 }
    ),
    possuiPendenciasInstalacao: int("possui_pendencias_instalacao").default(0),
    statusCustoInstalacao: int("status_custo_instalacao").default(1).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idDadosInstalacao],
      name: "dados_etp_conclusao_instalacao_id_dados_instalacao",
    }),
  ]
);

export const dadosEtpConclusaoLiberacoes = mysqlTable(
  "dados_etp_conclusao_liberacoes",
  {
    coletaConclusaoLiberacao: int("coleta_conclusao_liberacao").notNull(),
    datetimeConclusaoLiberacao: datetime("datetime_conclusao_liberacao", {
      mode: "string",
    }).notNull(),
    flagConclusaoLiberacao: int("flag_conclusao_liberacao").notNull(),
    idConclusaoLiberacao: int("id_conclusao_liberacao")
      .autoincrement()
      .notNull(),
    obsConclusaoLiberacao: varchar("obs_conclusao_liberacao", { length: 500 }),
    userConclusaoLiberacao: int("user_conclusao_liberacao").notNull(),
  },
  (table) => [
    index("idx_liberacoes_data_coleta").on(
      table.datetimeConclusaoLiberacao,
      table.coletaConclusaoLiberacao
    ),
    primaryKey({
      columns: [table.idConclusaoLiberacao],
      name: "dados_etp_conclusao_liberacoes_id_conclusao_liberacao",
    }),
  ]
);

export const dadosEtpLayout = mysqlTable(
  "dados_etp_layout",
  {
    caminhoAditivoLayout: varchar("caminho_aditivo_layout", { length: 500 }),
    codColetaLayout: int("cod_coleta_layout"),
    codOriSolar1Layout: int("cod_ori_solar1_layout").default(0),
    codOriSolar2Layout: int("cod_ori_solar2_layout").default(0).notNull(),
    codOriSolar3Layout: int("cod_ori_solar3_layout").default(0).notNull(),
    codOriSolar4Layout: int("cod_ori_solar4_layout").default(0).notNull(),
    estGeracaoLayout: decimal("est_geracao_layout", {
      precision: 10,
      scale: 2,
    }),
    idLayout: int("id_layout").autoincrement().notNull(),
    isAssinaturaLayout: int("is_assinatura_layout").default(0),
    perdaMediaLayout: decimal("perda_media_layout", {
      precision: 10,
      scale: 2,
    }),
    possuiAditivoLayout: tinyint("possui_aditivo_layout"),
  },
  (table) => [
    index("cod_coleta_layout").on(table.codColetaLayout),
    primaryKey({
      columns: [table.idLayout],
      name: "dados_etp_layout_id_layout",
    }),
  ]
);

export const dadosEtpOs = mysqlTable(
  "dados_etp_os",
  {
    caminhoOsDados: varchar("caminho_os_dados", { length: 100 }),
    codColetaDados: int("cod_coleta_dados").notNull(),
    dataPrevInicioOsDados: date("data_prev_inicio_os_dados", {
      mode: "string",
    }),
    diasPrevOsDados: int("dias_prev_os_dados"),
    idDados: int("id_dados").autoincrement().notNull(),
    localInstInversorOsDados: varchar("local_inst_inversor_os_dados", {
      length: 100,
    }),
    materiaisFaltantesOsDados: varchar("materiais_faltantes_os_dados", {
      length: 500,
    }),
    medidorDados: varchar("medidor_dados", { length: 100 }),
  },
  (table) => [
    index("cod_coleta_dados").on(table.codColetaDados),
    primaryKey({ columns: [table.idDados], name: "dados_etp_os_id_dados" }),
  ]
);

export const dadosEtpPgtoEntrada = mysqlTable(
  "dados_etp_pgto_entrada",
  {
    codColetaPgto: int("cod_coleta_pgto").notNull(),
    codUsuarioEditouPgto: int("cod_usuario_editou_pgto"),
    codUsuarioInativouPgto: int("cod_usuario_inativou_pgto"),
    codUsuarioPgto: int("cod_usuario_pgto").notNull(),
    dataPgto: date("data_pgto", { mode: "string" }).notNull(),
    datahoraInativouPgto: datetime("datahora_inativou_pgto", {
      mode: "string",
    }),
    descricaoPgto: varchar("descricao_pgto", { length: 1000 }).notNull(),
    idPgto: int("id_pgto").autoincrement().notNull(),
    motivoInativouPgto: varchar("motivo_inativou_pgto", { length: 300 }),
    statusPgto: int("status_pgto").notNull(),
    valorPgto: decimal("valor_pgto", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [
    index("cod_coleta_pgto").on(table.codColetaPgto),
    index("status_pgto").on(table.statusPgto),
    primaryKey({
      columns: [table.idPgto],
      name: "dados_etp_pgto_entrada_id_pgto",
    }),
  ]
);

export const dadosEtpReqMat = mysqlTable(
  "dados_etp_req_mat",
  {
    codInversor1Dadosreq: int("cod_inversor1_dadosreq"),
    codInversor2Dadosreq: int("cod_inversor2_dadosreq"),
    codInversor3Dadosreq: int("cod_inversor3_dadosreq"),
    coletaDadosreq: int("coleta_dadosreq"),
    coordenadasDadosreq: varchar("coordenadas_dadosreq", { length: 100 }),
    disjuntorInversor1Dadosreq: int("disjuntor_inversor1_dadosreq"),
    disjuntorInversor2Dadosreq: int("disjuntor_inversor2_dadosreq"),
    disjuntorInversor3Dadosreq: int("disjuntor_inversor3_dadosreq"),
    idDadosreq: int("id_dadosreq").autoincrement().notNull(),
    moduloDadosreq: int("modulo_dadosreq"),
    potenciaModuloDadosreq: varchar("potencia_modulo_dadosreq", {
      length: 100,
    }),
    qtdDisjuntorInversor1Dadosreq: int("qtdDisjuntor_inversor1_dadosreq"),
    qtdDisjuntorInversor2Dadosreq: int("qtdDisjuntor_inversor2_dadosreq"),
    qtdDisjuntorInversor3Dadosreq: int("qtdDisjuntor_inversor3_dadosreq"),
    qtdInversor1Dadosreq: int("qtd_inversor1_dadosreq"),
    qtdInversor2Dadosreq: int("qtd_inversor2_dadosreq"),
    qtdInversor3Dadosreq: int("qtd_inversor3_dadosreq"),
    qtdInversoresDadosreq: int("qtd_inversores_dadosreq"),
    qtdModulosDadosreq: int("qtd_modulos_dadosreq"),
    trocaInversorDadosreq: int("troca_inversor_dadosreq"),
    trocaModuloDadosreq: int("troca_modulo_dadosreq"),
  },
  (table) => [
    index("coleta_dadosreq").on(table.coletaDadosreq),
    primaryKey({
      columns: [table.idDadosreq],
      name: "dados_etp_req_mat_id_dadosreq",
    }),
  ]
);

export const dadosEtpValidArt = mysqlTable(
  "dados_etp_valid_art",
  {
    codColetaValidaArt: int("cod_coleta_valida_art").notNull(),
    idValidArt: int("id_valid_art").autoincrement().notNull(),
    protocoloAutomaticoValidaArt: int(
      "protocolo_automatico_valida_art"
    ).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idValidArt],
      name: "dados_etp_valid_art_id_valid_art",
    }),
  ]
);

export const dadosEtpVistConcess = mysqlTable(
  "dados_etp_vist_concess",
  {
    codColetaDados: int("cod_coleta_dados").notNull(),
    codEngenheiroVistDados: int("cod_engenheiro_vist_dados"),
    codEtapaDados: int("cod_etapa_dados").notNull(),
    codRegionalVistDados: int("cod_regional_vist_dados"),
    idDados: int("id_dados").autoincrement().notNull(),
  },
  (table) => [
    index("cod_coleta_dados").on(table.codColetaDados),
    primaryKey({
      columns: [table.idDados],
      name: "dados_etp_vist_concess_id_dados",
    }),
  ]
);

export const dadosEtpVistTecnica = mysqlTable(
  "dados_etp_vist_tecnica",
  {
    codColetaVistTecnica: int("cod_coleta_vist_tecnica").notNull(),
    codEtapaVistTecnica: int("cod_etapa_vist_tecnica").notNull(),
    disjuntorVistTecnica: int("disjuntor_vist_tecnica"),
    idVistTecnica: int("id_vist_tecnica").autoincrement().notNull(),
    motivoNaoInformadoVistTecnica: varchar(
      "motivo_nao_informado_vist_tecnica",
      { length: 300 }
    ),
    senhaVistTecnica: varchar("senha_vist_tecnica", { length: 100 }),
    statusVendaVistTecnica: int("status_venda_vist_tecnica")
      .default(1)
      .notNull(),
    wifiInformadoVistTecnica: tinyint("wifi_informado_vist_tecnica"),
    wifiVistTecnica: varchar("wifi_vist_tecnica", { length: 100 }),
  },
  (table) => [
    index("cod_coleta_vist_tecnica").on(table.codColetaVistTecnica),
    primaryKey({
      columns: [table.idVistTecnica],
      name: "dados_etp_vist_tecnica_id_vist_tecnica",
    }),
  ]
);

export const diasMes = mysqlTable(
  "dias_mes",
  {
    diasMes: int("dias_mes").notNull(),
    idMes: int("id_mes").autoincrement().notNull(),
    nomeMes: varchar("nome_mes", { length: 200 }).notNull(),
    nroMes: varchar("nro_mes", { length: 2 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.idMes], name: "dias_mes_id_mes" })]
);

export const disjuntorFornecedores = mysqlTable(
  "disjuntor_fornecedores",
  {
    codDisjuntor: int("cod_disjuntor").notNull(),
    codFornecedor: int("cod_fornecedor").notNull(),
    idDisjuntorFornecedor: int("id_disjuntor_fornecedor")
      .autoincrement()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idDisjuntorFornecedor],
      name: "disjuntor_fornecedores_id_disjuntor_fornecedor",
    }),
  ]
);

export const disjuntores = mysqlTable(
  "disjuntores",
  {
    correntenominalDisjuntor: decimal("correntenominal_disjuntor", {
      precision: 10,
      scale: 2,
    }).notNull(),
    curvaDisparoDisjuntor: varchar("curva_disparo_disjuntor", {
      length: 10,
    }).notNull(),
    idDisjuntor: int("id_disjuntor").autoincrement().notNull(),
    marcaDisjuntor: varchar("marca_disjuntor", { length: 100 }).notNull(),
    modeloDisjuntor: varchar("modelo_disjuntor", { length: 100 }).notNull(),
    nroPolosDisjuntor: varchar("nro_polos_disjuntor", { length: 30 }).notNull(),
    origemDisjuntor: varchar("origem_disjuntor", { length: 30 }).notNull(),
    precovendaDisjuntor: decimal("precovenda_disjuntor", {
      precision: 10,
      scale: 2,
    }).notNull(),
    statusDisjuntor: int("status_disjuntor").notNull(),
    tensaovcaDisjuntor: decimal("tensaovca_disjuntor", {
      precision: 10,
      scale: 2,
    }).notNull(),
    tensaovccDisjuntor: decimal("tensaovcc_disjuntor", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idDisjuntor],
      name: "disjuntores_id_disjuntor",
    }),
  ]
);

export const emailCentralizadoEngenharia = mysqlTable(
  "email_centralizado_engenharia",
  {
    descricaoEmail: varchar("descricao_email", { length: 100 }).notNull(),
    idEmail: int("id_email").autoincrement().notNull(),
    statusEmail: int("status_email").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEmail],
      name: "email_centralizado_engenharia_id_email",
    }),
  ]
);

export const emailContasPagar = mysqlTable(
  "email_contas_pagar",
  {
    idEmailPagar: int("id_email_pagar").autoincrement().notNull(),
    statusEmailPagar: int("status_email_pagar").notNull(),
    usuarioEmailPagar: int("usuario_email_pagar").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEmailPagar],
      name: "email_contas_pagar_id_email_pagar",
    }),
  ]
);

export const emailsCsv = mysqlTable(
  "emails_csv",
  {
    descricaoEmailsCsv: varchar("descricao_emails_csv", {
      length: 5000,
    }).notNull(),
    idEmailCsv: int("id_email_csv").autoincrement().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEmailCsv],
      name: "emails_csv_id_email_csv",
    }),
  ]
);

export const empresas = mysqlTable(
  "empresas",
  {
    apelidoEmpresa: varchar("apelido_empresa", { length: 200 }).notNull(),
    bairroEmpresa: varchar("bairro_empresa", { length: 100 }).notNull(),
    cepEmpresa: varchar("cep_empresa", { length: 30 }).notNull(),
    cidadeEmpresa: varchar("cidade_empresa", { length: 50 }).notNull(),
    cnpjEmpresa: varchar("cnpj_empresa", { length: 30 }).notNull(),
    estadoEmpresa: varchar("estado_empresa", { length: 50 }).notNull(),
    idEmpresa: int("id_empresa").autoincrement().notNull(),
    inscestadualEmpresa: varchar("inscestadual_empresa", {
      length: 30,
    }).notNull(),
    matrizEmpresa: int("matriz_empresa").notNull(),
    nomeEmpresa: varchar("nome_empresa", { length: 100 }).notNull(),
    nroEmpresa: int("nro_empresa").notNull(),
    ruaEmpresa: varchar("rua_empresa", { length: 300 }).notNull(),
    statusEmpresa: int("status_empresa").notNull(),
    telefone1Empresa: varchar("telefone1_empresa", { length: 20 }).notNull(),
    telefone2Empresa: varchar("telefone2_empresa", { length: 20 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idEmpresa], name: "empresas_id_empresa" }),
  ]
);

export const engenheiroResponsavelColeta = mysqlTable(
  "engenheiro_responsavel_coleta",
  {
    coletaResponsavelColeta: int("coleta_responsavel_coleta").notNull(),
    dataResponsavelColeta: datetime("data_responsavel_coleta", {
      mode: "string",
    }).notNull(),
    engenheiroResponsavelColeta: int("engenheiro_responsavel_coleta").notNull(),
    idResponsavelColeta: int("id_responsavel_coleta").autoincrement().notNull(),
    statusResponsavelColeta: int("status_responsavel_coleta").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idResponsavelColeta],
      name: "engenheiro_responsavel_coleta_id_responsavel_coleta",
    }),
  ]
);

export const engenheirosResponsaveis = mysqlTable(
  "engenheiros_responsaveis",
  {
    assEngenheiro: text("ass_engenheiro").notNull(),
    cpfEngenheiro: varchar("cpf_engenheiro", { length: 200 }).notNull(),
    dataNascEngenheiro: date("data_nasc_engenheiro", { mode: "string" }),
    emailEngenheiro: varchar("email_engenheiro", { length: 100 }).notNull(),
    idEngenheiro: int("id_engenheiro").autoincrement().notNull(),
    nomeEngenheiro: varchar("nome_engenheiro", { length: 100 }).notNull(),
    statusEngenheiro: int("status_engenheiro").notNull(),
    telefoneEngenheiro: varchar("telefone_engenheiro", {
      length: 20,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEngenheiro],
      name: "engenheiros_responsaveis_id_engenheiro",
    }),
  ]
);

export const envioEmailsComissoes = mysqlTable(
  "envio_emails_comissoes",
  {
    anoEnvioComissao: int("ano_envio_comissao").notNull(),
    datahoraEnvioComissao: datetime("datahora_envio_comissao", {
      mode: "string",
    }).notNull(),
    emailEnvioComissao: varchar("email_envio_comissao", {
      length: 200,
    }).notNull(),
    idEnvioComissao: int("id_envio_comissao").autoincrement().notNull(),
    mesEnvioComissao: int("mes_envio_comissao").notNull(),
    motivoReaberturaComissao: varchar("motivo_reabertura_comissao", {
      length: 2000,
    }),
    parametroComissao: int("parametro_comissao").notNull(),
    representanteEnvioComissao: int("representante_envio_comissao").notNull(),
    statusEnvioComissao: int("status_envio_comissao").notNull(),
    tipoEnvioComissao: varchar("tipo_envio_comissao", { length: 20 }).notNull(),
    userEnvioComissao: int("user_envio_comissao").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEnvioComissao],
      name: "envio_emails_comissoes_id_envio_comissao",
    }),
  ]
);

export const envioEmailsInstalacoes = mysqlTable(
  "envio_emails_instalacoes",
  {
    anoEnvioInstalacao: int("ano_envio_instalacao").notNull(),
    datahoraEnvioInstalacao: datetime("datahora_envio_instalacao", {
      mode: "string",
    }).notNull(),
    emailEnvioInstalacao: varchar("email_envio_instalacao", {
      length: 200,
    }).notNull(),
    idEnvioInstalacao: int("id_envio_instalacao").autoincrement().notNull(),
    instaladorEnvioInstalacao: int("instalador_envio_instalacao").notNull(),
    mesEnvioInstalacao: int("mes_envio_instalacao").notNull(),
    motivoReaberturaInstalacao: varchar("motivo_reabertura_instalacao", {
      length: 2000,
    }),
    parametroInstalacao: int("parametro_instalacao").notNull(),
    quinzenaEnvioInstalacao: int("quinzena_envio_instalacao").notNull(),
    statusEnvioInstalacao: int("status_envio_instalacao").notNull(),
    tipoEnvioInstalacao: varchar("tipo_envio_instalacao", {
      length: 20,
    }).notNull(),
    userEnvioInstalacao: int("user_envio_instalacao").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEnvioInstalacao],
      name: "envio_emails_instalacoes_id_envio_instalacao",
    }),
  ]
);

export const estados = mysqlTable("estados", {
  idEstado: int("id_estado").notNull(),
  nomeEstado: varchar("nome_estado", { length: 75 }),
  ufEstado: varchar("uf_estado", { length: 5 }),
});

export const estadosCivis = mysqlTable(
  "estados_civis",
  {
    idEstadoCivil: int("id_estado_civil").autoincrement().notNull(),
    nomeEstadoCivil: varchar("nome_estado_civil", { length: 30 }).notNull(),
    statusEstadoCivil: int("status_estado_civil").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEstadoCivil],
      name: "estados_civis_id_estado_civil",
    }),
  ]
);

export const estimativaConsumoDireto = mysqlTable(
  "estimativa_consumo_direto",
  {
    idEstimativa: int("id_estimativa").autoincrement().notNull(),
    statusEstimativa: int("status_estimativa").notNull(),
    tipoFaturaEstimativa: varchar("tipo_fatura_estimativa", {
      length: 100,
    }).notNull(),
    valorEstimativa: decimal("valor_estimativa", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEstimativa],
      name: "estimativa_consumo_direto_id_estimativa",
    }),
  ]
);

export const estruturasFixacao = mysqlTable(
  "estruturas_fixacao",
  {
    codTipoInstalacao: int("cod_tipo_instalacao").notNull(),
    idEstrutura: int("id_estrutura").autoincrement().notNull(),
    nomeEstrutura: varchar("nome_estrutura", { length: 250 }).notNull(),
    statusEstrutura: int("status_estrutura").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEstrutura],
      name: "estruturas_fixacao_id_estrutura",
    }),
  ]
);

export const etapas = mysqlTable(
  "etapas",
  {
    bloqueadaEtapa: int("bloqueada_etapa").default(0).notNull(),
    campopadrao2Etapa: varchar("campopadrao2_etapa", { length: 100 }),
    campopadraoEtapa: varchar("campopadrao_etapa", { length: 100 }),
    codCfgCategoria: int("cod_cfg_categoria").notNull(),
    codCfgEtapa: int("cod_cfg_etapa").notNull(),
    codColetaEtapa: int("cod_coleta_etapa").notNull(),
    codUsuConclusaoEtapa: int("cod_usu_conclusao_etapa"),
    countAssinaturaEtapa: int("count_assinatura_etapa"),
    data1Etapa: date("data1_etapa", { mode: "string" }),
    data2Etapa: date("data2_etapa", { mode: "string" }),
    datahoraAberturaEtapa: datetime("datahora_abertura_etapa", {
      mode: "string",
    }),
    datahoraConclusaoEtapa: datetime("datahora_conclusao_etapa", {
      mode: "string",
    }),
    datahoraReaberturaEtapa: datetime("datahora_reabertura_etapa", {
      mode: "string",
    }),
    documentKeyEtapa: varchar("document_key_etapa", { length: 500 }),
    documentosAssinadosEtapa: varchar("documentos_assinados_etapa", {
      length: 60,
    }),
    flagExibirEtapasOcultasEtapa: tinyint(
      "flag_exibir_etapas_ocultas_etapa"
    ).default(0),
    flagJaFoiConcluidaEtapa: tinyint("flag_ja_foi_concluida_etapa").default(0),
    idEtapa: int("id_etapa").autoincrement().notNull(),
    isCustoAdicionalEtapa: int("isCustoAdicional_etapa"),
    listarAppEtapa: int("listarApp_etapa").default(1).notNull(),
    motivoReaberturaEtapa: varchar("motivo_reabertura_etapa", { length: 1000 }),
    obsAprovacaoEtapa: varchar("obs_aprovacao_etapa", { length: 10_000 }),
    obsEtapa: varchar("obs_etapa", { length: 10_000 }),
    origemConclusaoEtapa: int("origemConclusao_etapa").default(0),
    qtdDocsEnviadosAssinaturaEtapa: int("qtd_docs_enviados_assinatura_etapa"),
    statusAprovacaoEtapa: tinyint("status_aprovacao_etapa")
      .default(2)
      .notNull(),
    statusEtapa: int("status_etapa").notNull(),
    usuarioReaberturaEtapa: int("usuario_reabertura_etapa"),
  },
  (table) => [
    index("cod_cfg_etapa").on(table.codCfgEtapa),
    index("cod_coleta_etapa").on(table.codColetaEtapa),
    index("data1_etapa").on(table.data1Etapa),
    index("data2_etapa").on(table.data2Etapa),
    index("idx_etapas_36_status_data_coleta").on(
      table.codCfgEtapa,
      table.statusEtapa,
      table.datahoraConclusaoEtapa,
      table.codColetaEtapa
    ),
    index("status_etapa").on(table.statusEtapa),
    primaryKey({ columns: [table.idEtapa], name: "etapas_id_etapa" }),
  ]
);

export const etapasAnexos = mysqlTable(
  "etapas_anexos",
  {
    caminhoAnexo: varchar("caminho_anexo", { length: 500 }).notNull(),
    codCfgAnexo: int("cod_cfg_anexo").notNull(),
    codEtapaAnexo: int("cod_etapa_anexo").notNull(),
    idAnexo: int("id_anexo").autoincrement().notNull(),
    nomearquivoAnexo: varchar("nomearquivo_anexo", { length: 100 }),
    statusAnexo: int("status_anexo").notNull(),
  },
  (table) => [
    index("cod_etapa_anexo").on(table.codEtapaAnexo),
    primaryKey({ columns: [table.idAnexo], name: "etapas_anexos_id_anexo" }),
  ]
);

export const etapasAssinatura = mysqlTable(
  "etapas_assinatura",
  {
    andEtapaAssinatura: varchar("and_etapa_assinatura", {
      length: 300,
    }).notNull(),
    caminhoEtapaAssinatura: varchar("caminho_etapa_assinatura", {
      length: 300,
    }).notNull(),
    codCfgAnexoAssinatura: int("cod_cfg_anexo_assinatura").notNull(),
    codCfgEtapaAssinatura: int("cod_cfg_etapa_assinatura").notNull(),
    documentKeyEtapa: varchar("document_key_etapa", { length: 500 }).notNull(),
    etpValidacaoEtapaAssinatura: int("etp_validacao_etapa_assinatura"),
    idCfgEtapaAssinatura: int("id_cfg_etapa_assinatura").notNull(),
    idEtapaAssinatura: int("id_etapa_assinatura").autoincrement().notNull(),
    isEtapaPrimariaAssinatura: int("is_etapa_primaria_assinatura").notNull(),
    pastaEtapaAssinatura: varchar("pasta_etapa_assinatura", {
      length: 200,
    }).notNull(),
    tabelaEtapaAssinatura: varchar("tabela_etapa_assinatura", {
      length: 300,
    }).notNull(),
    whereEtapaAssinatura: varchar("where_etapa_assinatura", {
      length: 300,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEtapaAssinatura],
      name: "etapas_assinatura_id_etapa_assinatura",
    }),
  ]
);

export const etapasEmails = mysqlTable(
  "etapas_emails",
  {
    codCfgEmail: int("cod_cfg_email").notNull(),
    codEtapaEmail: int("cod_etapa_email").notNull(),
    dataEmail: datetime("data_email", { mode: "string" }).notNull(),
    destinatarioEmail: varchar("destinatario_email", { length: 200 }).notNull(),
    idEmail: int("id_email").autoincrement().notNull(),
    statusEmail: int("status_email").notNull(),
  },
  (table) => [
    index("cod_etapa_email").on(table.codEtapaEmail),
    primaryKey({ columns: [table.idEmail], name: "etapas_emails_id_email" }),
  ]
);

export const etapasPendentes = mysqlTable(
  "etapas_pendentes",
  {
    codEtapasPendentes: varchar("codEtapas_pendentes", {
      length: 2000,
    }).notNull(),
    coletaPendente: int("coleta_pendente").notNull(),
    idPendente: int("id_pendente").autoincrement().notNull(),
  },
  (table) => [
    index("coleta_pendente").on(table.coletaPendente),
    primaryKey({
      columns: [table.idPendente],
      name: "etapas_pendentes_id_pendente",
    }),
  ]
);

export const execucaoLogsAutomaticos = mysqlTable(
  "execucao_logs_automaticos",
  {
    datetimeExecLog: datetime("datetime_exec_log", {
      mode: "string",
    }).notNull(),
    idExecAuto: int("id_exec_auto").autoincrement().notNull(),
    qtdExcluidosExecLog: int("qtdExcluidos_exec_log").notNull(),
    tipoLogExecAuto: varchar("tipoLog_exec_auto", { length: 100 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idExecAuto],
      name: "execucao_logs_automaticos_id_exec_auto",
    }),
  ]
);

export const fiadores = mysqlTable(
  "fiadores",
  {
    bairroFiador: varchar("bairro_fiador", { length: 50 }),
    cepFiador: varchar("cep_fiador", { length: 20 }),
    cidadeFiador: varchar("cidade_fiador", { length: 50 }),
    codColetaFiador: int("cod_coleta_fiador").notNull(),
    codDadosContratoFiador: int("cod_dados_contrato_fiador").notNull(),
    codEstadoCivilFiador: int("cod_estado_civil_fiador"),
    complementoFiador: varchar("complemento_fiador", { length: 100 }),
    cpfcnpjConjujeFiador: varchar("cpfcnpj_conjuje_fiador", { length: 25 }),
    cpfcnpjFiador: varchar("cpfcnpj_fiador", { length: 25 }),
    emailFiador: varchar("email_fiador", { length: 500 }),
    idFiador: int("id_fiador").autoincrement().notNull(),
    nascimentoConjujeFiador: varchar("nascimento_conjuje_fiador", {
      length: 20,
    }),
    nascimentoFiador: varchar("nascimento_fiador", { length: 20 }),
    nomeConjujeFiador: varchar("nome_conjuje_fiador", { length: 100 }),
    nomeFiador: varchar("nome_fiador", { length: 100 }),
    numeroFiador: varchar("numero_fiador", { length: 10 }),
    orgaoemissorConjujeFiador: varchar("orgaoemissor_conjuje_fiador", {
      length: 50,
    }),
    orgaoemissorFiador: varchar("orgaoemissor_fiador", { length: 50 }),
    pessoaFiador: varchar("pessoa_fiador", { length: 20 }),
    profissaoConjujeFiador: varchar("profissao_conjuje_fiador", {
      length: 100,
    }),
    profissaoFiador: varchar("profissao_fiador", { length: 100 }),
    rgConjujeFiador: varchar("rg_conjuje_fiador", { length: 20 }),
    rgFiador: varchar("rg_fiador", { length: 20 }),
    ruaFiador: varchar("rua_fiador", { length: 100 }),
    statusFiador: int("status_fiador"),
    telefoneFiador: varchar("telefone_fiador", { length: 500 }),
    ufFiador: varchar("uf_fiador", { length: 5 }),
  },
  (table) => [
    index("cod_coleta_fiador").on(table.codColetaFiador),
    primaryKey({ columns: [table.idFiador], name: "fiadores_id_fiador" }),
  ]
);

export const fornecedores = mysqlTable(
  "fornecedores",
  {
    bairroFornecedor: varchar("bairro_fornecedor", { length: 100 }).notNull(),
    cepFornecedor: varchar("cep_fornecedor", { length: 20 }).notNull(),
    cidadeFornecedor: varchar("cidade_fornecedor", { length: 100 }).notNull(),
    compFornecedor: varchar("comp_fornecedor", { length: 100 }).notNull(),
    cpfcnpjFornecedor: varchar("cpfcnpj_fornecedor", { length: 20 }).notNull(),
    emailFornecedor: varchar("email_fornecedor", { length: 100 }).notNull(),
    estadoFornecedor: varchar("estado_fornecedor", { length: 100 }).notNull(),
    idFornecedor: int("id_fornecedor").autoincrement().notNull(),
    inscestadualFornecedor: varchar("inscestadual_fornecedor", {
      length: 30,
    }).notNull(),
    nomeFornecedor: varchar("nome_fornecedor", { length: 100 }).notNull(),
    nroFornecedor: varchar("nro_fornecedor", { length: 20 }).notNull(),
    pessoaFornecedor: varchar("pessoa_fornecedor", { length: 5 }).notNull(),
    razaosocialFornecedor: varchar("razaosocial_fornecedor", {
      length: 100,
    }).notNull(),
    ruaFornecedor: varchar("rua_fornecedor", { length: 100 }).notNull(),
    statusFornecedor: int("status_fornecedor").notNull(),
    telefone1Fornecedor: varchar("telefone1_fornecedor", {
      length: 20,
    }).notNull(),
    telefone2Fornecedor: varchar("telefone2_fornecedor", {
      length: 20,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idFornecedor],
      name: "fornecedores_id_fornecedor",
    }),
  ]
);

export const fotosDisjuntor = mysqlTable(
  "fotos_disjuntor",
  {
    caminhoFotoDisjuntor: varchar("caminho_fotoDisjuntor", { length: 200 }),
    coletaFotoDisjuntor: int("coleta_fotoDisjuntor").notNull(),
    conversaoFotoDisjuntor: int("conversao_fotoDisjuntor"),
    idFotoDisjuntor: int("id_fotoDisjuntor").autoincrement().notNull(),
    obsConversaoFotoDisjuntor: varchar("obsConversao_fotoDisjuntor", {
      length: 500,
    }),
  },
  (table) => [
    index("coleta_fotoDisjuntor").on(table.coletaFotoDisjuntor),
    primaryKey({
      columns: [table.idFotoDisjuntor],
      name: "fotos_disjuntor_id_fotoDisjuntor",
    }),
  ]
);

export const fotosInversor = mysqlTable(
  "fotos_inversor",
  {
    caminhoFotoInversor: varchar("caminho_fotoInversor", { length: 200 }),
    coletaFotoInversor: int("coleta_fotoInversor").notNull(),
    conversaoFotoInversor: int("conversao_fotoInversor"),
    idFotoInversor: int("id_fotoInversor").autoincrement().notNull(),
    obsConversaoFotoInversor: varchar("obsConversao_fotoInversor", {
      length: 500,
    }),
  },
  (table) => [
    index("coleta_fotoInversor").on(table.coletaFotoInversor),
    primaryKey({
      columns: [table.idFotoInversor],
      name: "fotos_inversor_id_fotoInversor",
    }),
  ]
);

export const fotosLayoutOrientativo = mysqlTable(
  "fotos_layout_orientativo",
  {
    caminhoLayout: varchar("caminho_layout", { length: 200 }),
    coletaLayout: int("coleta_layout").notNull(),
    conversaoLayout: int("conversao_layout"),
    idLayout: int("id_layout").autoincrement().notNull(),
    obsConversaoLayout: varchar("obsConversao_layout", { length: 500 }),
  },
  (table) => [
    index("coleta_layout").on(table.coletaLayout),
    primaryKey({
      columns: [table.idLayout],
      name: "fotos_layout_orientativo_id_layout",
    }),
  ]
);

export const fotosOsReparo = mysqlTable(
  "fotos_os_reparo",
  {
    base64Reparo: varchar("base64_reparo", { length: 10_000 }).notNull(),
    codOsReparo: int("codOS_reparo").notNull(),
    idFotoReparo: int("id_foto_reparo").autoincrement().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idFotoReparo],
      name: "fotos_os_reparo_id_foto_reparo",
    }),
  ]
);

export const fotosRamal = mysqlTable(
  "fotos_ramal",
  {
    caminhoFotoRamal: varchar("caminho_fotoRamal", { length: 200 }),
    coletaFotoRamal: int("coleta_fotoRamal").notNull(),
    conversaoFotoRamal: int("conversao_fotoRamal"),
    idFotoRamal: int("id_fotoRamal").autoincrement().notNull(),
    obsConversaoFotoRamal: varchar("obsConversao_fotoRamal", { length: 500 }),
  },
  (table) => [
    index("coleta_fotoRamal").on(table.coletaFotoRamal),
    primaryKey({
      columns: [table.idFotoRamal],
      name: "fotos_ramal_id_fotoRamal",
    }),
  ]
);

export const fotosTelhado = mysqlTable(
  "fotos_telhado",
  {
    caminhoFotoTelhado: varchar("caminho_fotoTelhado", { length: 200 }),
    coletaFotoTelhado: int("coleta_fotoTelhado").notNull(),
    conversaoFotoTelhado: int("conversao_fotoTelhado"),
    idFotoTelhado: int("id_fotoTelhado").autoincrement().notNull(),
    obsConversaoFotoTelhado: varchar("obsConversao_fotoTelhado", {
      length: 500,
    }),
  },
  (table) => [
    index("coleta_fotoTelhado").on(table.coletaFotoTelhado),
    primaryKey({
      columns: [table.idFotoTelhado],
      name: "fotos_telhado_id_fotoTelhado",
    }),
  ]
);

export const fotosTipoTelhado = mysqlTable(
  "fotos_tipo_telhado",
  {
    base64TipoTelhado: longtext("base64_tipo_telhado").notNull(),
    caminhoTipoTelhado: varchar("caminho_tipo_telhado", { length: 3000 }),
    codTelhado: int("cod_telhado").notNull(),
    idFotoTipo: int("id_foto_tipo").autoincrement().notNull(),
    statusTipoTelhado: int("status_tipo_telhado").notNull(),
  },
  (table) => [
    index("cod_telhado").on(table.codTelhado),
    primaryKey({
      columns: [table.idFotoTipo],
      name: "fotos_tipo_telhado_id_foto_tipo",
    }),
  ]
);

export const hdeskChamados = mysqlTable(
  "hdesk_chamados",
  {
    assuntoChamado: varchar("assunto_chamado", { length: 100 }).notNull(),
    codCliente: int("cod_cliente"),
    codTipoChamado: int("cod_tipo_chamado").notNull(),
    codUsuarioCriador: int("cod_usuario_criador").notNull(),
    dataAberturaChamado: datetime("data_abertura_chamado", {
      mode: "string",
    }).notNull(),
    dataBaixaChamado: datetime("data_baixa_chamado", { mode: "string" }),
    dataPrevisaoChamado: date("data_previsao_chamado", { mode: "string" }),
    descricaoChamado: varchar("descricao_chamado", { length: 2000 }).notNull(),
    idChamado: int("id_chamado").autoincrement().notNull(),
    obsBaixaChamado: varchar("obs_baixa_chamado", { length: 500 }),
    statusChamado: int("status_chamado").notNull(),
    urgenciaChamado: int("urgencia_chamado").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idChamado],
      name: "hdesk_chamados_id_chamado",
    }),
  ]
);

export const hdeskOs = mysqlTable(
  "hdesk_os",
  {
    codChamado: int("cod_chamado").notNull(),
    codUsuarioCriador: int("cod_usuario_criador").notNull(),
    codUsuarioDesignado: int("cod_usuario_designado").notNull(),
    dataAberturaOs: datetime("data_abertura_os", { mode: "string" }).notNull(),
    dataBaixaOs: datetime("data_baixa_os", { mode: "string" }),
    dataPrevisaoOs: date("data_previsao_os", { mode: "string" }).notNull(),
    descricaoOs: varchar("descricao_os", { length: 2000 }).notNull(),
    horasPrevisaoOs: varchar("horas_previsao_os", { length: 10 }).notNull(),
    idOs: int("id_os").autoincrement().notNull(),
    objetivoOs: varchar("objetivo_os", { length: 100 }).notNull(),
    statusOs: int("status_os").notNull(),
  },
  (table) => [primaryKey({ columns: [table.idOs], name: "hdesk_os_id_os" })]
);

export const hdeskOsLancamentos = mysqlTable(
  "hdesk_os_lancamentos",
  {
    codOs: int("cod_os").notNull(),
    codUsuario: int("cod_usuario").notNull(),
    dataLancamento: date("data_lancamento", { mode: "string" }).notNull(),
    descricaoLancamento: varchar("descricao_lancamento", {
      length: 500,
    }).notNull(),
    horasLancamento: varchar("horas_lancamento", { length: 10 }).notNull(),
    idLancamento: int("id_lancamento").autoincrement().notNull(),
    statusLancamento: int("status_lancamento").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idLancamento],
      name: "hdesk_os_lancamentos_id_lancamento",
    }),
  ]
);

export const hdeskTiposChamado = mysqlTable(
  "hdesk_tipos_chamado",
  {
    idTipoChamado: int("id_tipo_chamado").autoincrement().notNull(),
    nomeTipoChamado: varchar("nome_tipo_chamado", { length: 100 }).notNull(),
    statusTipoChamado: int("status_tipo_chamado").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTipoChamado],
      name: "hdesk_tipos_chamado_id_tipo_chamado",
    }),
  ]
);

export const historicoUcs = mysqlTable(
  "historico_ucs",
  {
    aumentadoHistorico: decimal("aumentado_historico", {
      precision: 10,
      scale: 2,
    }).notNull(),
    coletaHistorico: int("coleta_historico").notNull(),
    compensavelHistorico: decimal("compensavel_historico", {
      precision: 10,
      scale: 2,
    }).notNull(),
    consumoHistorico: varchar("consumo_historico", { length: 30 }).notNull(),
    energiaNecessariaHistorico: decimal("energiaNecessaria_historico", {
      precision: 10,
      scale: 2,
    }).notNull(),
    forapontaHistorico: decimal("foraponta_historico", {
      precision: 10,
      scale: 2,
    }).notNull(),
    idHistorico: int("id_historico").autoincrement().notNull(),
    mesHistorico: varchar("mes_historico", { length: 50 }).notNull(),
    nomemesHistorico: varchar("nomemes_historico", { length: 50 }).notNull(),
    pontaAjustadoHistorico: decimal("pontaAjustado_historico", {
      precision: 10,
      scale: 2,
    }).notNull(),
    pontaHistorico: decimal("ponta_historico", {
      precision: 10,
      scale: 2,
    }).notNull(),
    porcentagemFpHistorico: int("porcentagemFP_historico").notNull(),
    porcentagemPHistorico: int("porcentagemP_historico").notNull(),
    ucHistorico: int("uc_historico").notNull(),
  },
  (table) => [
    index("coleta_historico").on(table.coletaHistorico),
    primaryKey({
      columns: [table.idHistorico],
      name: "historico_ucs_id_historico",
    }),
  ]
);

export const imagemFaturaColeta = mysqlTable(
  "imagem_fatura_coleta",
  {
    caminhoImagemFatura: varchar("caminho_imagem_fatura", { length: 200 }),
    coletaImagemFatura: int("coleta_imagem_fatura").notNull(),
    conversaoImagemFatura: int("conversao_imagem_fatura"),
    idImagemFatura: int("id_imagem_fatura").autoincrement().notNull(),
    obsConversaoImagemFatura: varchar("obsConversao_imagem_fatura", {
      length: 500,
    }),
    tipoArquivoFatura: int("tipoArquivo_fatura").notNull(),
  },
  (table) => [
    index("coleta_imagem_fatura").on(table.coletaImagemFatura),
    primaryKey({
      columns: [table.idImagemFatura],
      name: "imagem_fatura_coleta_id_imagem_fatura",
    }),
  ]
);

export const inclinacoesTelhado = mysqlTable(
  "inclinacoes_telhado",
  {
    idInclinacao: int("id_inclinacao").autoincrement().notNull(),
    statusInclinacao: int("status_inclinacao").notNull(),
    valorInclinacao: int("valor_inclinacao").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idInclinacao],
      name: "inclinacoes_telhado_id_inclinacao",
    }),
  ]
);

export const informativos = mysqlTable(
  "informativos",
  {
    capaInformativo: varchar("capa_informativo", { length: 255 }),
    categoriaInformativo: int("categoria_informativo").notNull(),
    dataInformativo: date("data_informativo", { mode: "string" }).notNull(),
    descricaoInformativo: varchar("descricao_informativo", {
      length: 10_000,
    }).notNull(),
    idInformativo: int("id_informativo").autoincrement().notNull(),
    statusInformativo: int("status_informativo").notNull(),
    tituloInformativo: varchar("titulo_informativo", { length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idInformativo],
      name: "informativos_id_informativo",
    }),
  ]
);

export const instFinanceiras = mysqlTable(
  "inst_financeiras",
  {
    codigoInst: varchar("codigo_inst", { length: 10 }).notNull(),
    idInst: int("id_inst").autoincrement().notNull(),
    iofInst: decimal("iof_inst", { precision: 10, scale: 2 }).notNull(),
    jurosPf108Inst: decimal("jurosPF108_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPf120Inst: decimal("jurosPF120_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPf12Inst: decimal("jurosPF12_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPf24Inst: decimal("jurosPF24_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPf36Inst: decimal("jurosPF36_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPf48Inst: decimal("jurosPF48_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPf60Inst: decimal("jurosPF60_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPf6Inst: decimal("jurosPF6_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPf72Inst: decimal("jurosPF72_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPf84Inst: decimal("jurosPF84_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPf96Inst: decimal("jurosPF96_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj108Inst: decimal("jurosPJ108_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj120Inst: decimal("jurosPJ120_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj12Inst: decimal("jurosPJ12_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj24Inst: decimal("jurosPJ24_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj36Inst: decimal("jurosPJ36_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj48Inst: decimal("jurosPJ48_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj60Inst: decimal("jurosPJ60_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj6Inst: decimal("jurosPJ6_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj72Inst: decimal("jurosPJ72_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj84Inst: decimal("jurosPJ84_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosPj96Inst: decimal("jurosPJ96_inst", {
      precision: 10,
      scale: 2,
    }).notNull(),
    nomeInst: varchar("nome_inst", { length: 100 }).notNull(),
    statusInst: int("status_inst").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idInst], name: "inst_financeiras_id_inst" }),
  ]
);

export const instalacoesAprovadas = mysqlTable(
  "instalacoes_aprovadas",
  {
    anoInstalacaoAprovada: int("ano_instalacao_aprovada").notNull(),
    clienteInstalacaoAprovada: int("cliente_instalacao_aprovada").notNull(),
    coletaInstalacaoAprovada: int("coleta_instalacao_aprovada"),
    datahoraInstalacaoAprovada: datetime("datahora_instalacao_aprovada", {
      mode: "string",
    }).notNull(),
    idInstalacaoAprovada: int("id_instalacao_aprovada")
      .autoincrement()
      .notNull(),
    instaladorInstalacaoAprovada: int(
      "instalador_instalacao_aprovada"
    ).notNull(),
    mesInstalacaoAprovada: int("mes_instalacao_aprovada").notNull(),
    osInstalacaoAprovada: int("os_instalacao_aprovada"),
    quinzenaInstalacaoAprovada: int("quinzena_instalacao_aprovada").notNull(),
    statusInstalacaoAprovada: int("status_instalacao_aprovada").notNull(),
    tipoInstalacaoAprovada: int("tipo_instalacao_aprovada").notNull(),
    userInstalacaoAprovada: int("user_instalacao_aprovada").notNull(),
    valorInstalacaoAprovada: decimal("valor_instalacao_aprovada", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    index("idx_instalacoes_aprovadas_tipo").on(table.tipoInstalacaoAprovada),
    primaryKey({
      columns: [table.idInstalacaoAprovada],
      name: "instalacoes_aprovadas_id_instalacao_aprovada",
    }),
  ]
);

export const instalacoesAprovadasPeriodo = mysqlTable(
  "instalacoes_aprovadas_periodo",
  {
    anoInstalacaoAprovadaPeriodo: int(
      "ano_instalacao_aprovada_periodo"
    ).notNull(),
    datetimeInstalacaoAprovadaPeriodo: datetime(
      "datetime_instalacao_aprovada_periodo",
      { mode: "string" }
    ).notNull(),
    idInstalacaoAprovadaPeriodo: int("id_instalacao_aprovada_periodo")
      .autoincrement()
      .notNull(),
    mesInstalacaoAprovadaPeriodo: int(
      "mes_instalacao_aprovada_periodo"
    ).notNull(),
    quinzenaInstalacaoAprovadaPeriodo: int(
      "quinzena_instalacao_aprovada_periodo"
    ).notNull(),
    somaInstalacaoAprovadaPeriodo: decimal("soma_instalacao_aprovada_periodo", {
      precision: 10,
      scale: 2,
    }).notNull(),
    statusInstalacaoAprovadaPeriodo: int(
      "status_instalacao_aprovada_periodo"
    ).notNull(),
    userInstalacaoAprovadaPeriodo: int(
      "user_instalacao_aprovada_periodo"
    ).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idInstalacaoAprovadaPeriodo],
      name: "instalacoes_aprovadas_periodo_id_instalacao_aprovada_periodo",
    }),
  ]
);

export const inversorFornecedores = mysqlTable(
  "inversor_fornecedores",
  {
    codFornecedor: int("cod_fornecedor").notNull(),
    codInversor: int("cod_inversor").notNull(),
    idInversorFornecedor: int("id_inversor_fornecedor")
      .autoincrement()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idInversorFornecedor],
      name: "inversor_fornecedores_id_inversor_fornecedor",
    }),
  ]
);

export const inversores = mysqlTable(
  "inversores",
  {
    codigoFinameAcima375Inversor: int("codigo_finameAcima375_inversor"),
    codigoFinameAte375Inversor: int("codigo_finameAte375_inversor"),
    codigoFinameAte75Inversor: int("codigo_finameAte75_inversor"),
    correnteInversor: decimal("corrente_inversor", {
      precision: 10,
      scale: 2,
    }).notNull(),
    garantiaInversor: varchar("garantia_inversor", { length: 50 }),
    idInversor: int("id_inversor").autoincrement().notNull(),
    ligacaoInversor: varchar("ligacao_inversor", { length: 30 }).notNull(),
    marcaInversor: varchar("marca_inversor", { length: 100 }).notNull(),
    modeloInversor: varchar("modelo_inversor", { length: 100 }).notNull(),
    mpptsInversor: int("mppts_inversor"),
    origemInversor: varchar("origem_inversor", { length: 50 }),
    potenciaInversor: decimal("potencia_inversor", {
      precision: 10,
      scale: 2,
    }).notNull(),
    potenciaKvaInversor: decimal("potenciaKVA_inversor", {
      precision: 10,
      scale: 2,
    }).notNull(),
    precovendaInversor: decimal("precovenda_inversor", {
      precision: 10,
      scale: 2,
    }).notNull(),
    statusInversor: int("status_inversor").notNull(),
    tensaoInversor: int("tensao_inversor").notNull(),
    vlrGarantiaEstInversor: decimal("vlr_garantia_est_inversor", {
      precision: 10,
      scale: 2,
    }),
  },
  (table) => [
    primaryKey({ columns: [table.idInversor], name: "inversores_id_inversor" }),
  ]
);

export const irradiacaoCresesb = mysqlTable(
  "irradiacao_cresesb",
  {
    abrilIrradiacao: decimal("abril_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    agostoIrradiacao: decimal("agosto_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    cidadeIrradiacao: varchar("cidade_irradiacao", { length: 300 }).notNull(),
    dezembroIrradiacao: decimal("dezembro_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    fevereiroIrradiacao: decimal("fevereiro_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    idIrradiacao: int("id_irradiacao").autoincrement().notNull(),
    inclinacaoIrradiacao: int("inclinacao_irradiacao").notNull(),
    janeiroIrradiacao: decimal("janeiro_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    julhoIrradiacao: decimal("julho_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    junhoIrradiacao: decimal("junho_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    maioIrradiacao: decimal("maio_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    marcoIrradiacao: decimal("marco_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    mediaIrradiacao: decimal("media_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    novembroIrradiacao: decimal("novembro_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    outubroIrradiacao: decimal("outubro_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    regiaoIrradiacao: int("regiao_irradiacao").notNull(),
    setembroIrradiacao: decimal("setembro_irradiacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    statusIrradiacao: int("status_irradiacao").notNull(),
    ufIrradiacao: varchar("uf_irradiacao", { length: 30 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idIrradiacao],
      name: "irradiacao_cresesb_id_irradiacao",
    }),
  ]
);

export const isencoesGeracao = mysqlTable(
  "isencoes_geracao",
  {
    cofinsIsencao: decimal("cofins_isencao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    icms1Isencao: decimal("icms1_isencao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    icms2Isencao: decimal("icms2_isencao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    idIsencao: int("id_isencao").autoincrement().notNull(),
    pisIsencao: decimal("pis_isencao", { precision: 10, scale: 2 }).notNull(),
    statusIsencao: int("status_isencao").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idIsencao],
      name: "isencoes_geracao_id_isencao",
    }),
  ]
);

export const itemFornecedores = mysqlTable(
  "item_fornecedores",
  {
    codFornecedor: int("cod_fornecedor").notNull(),
    codItem: int("cod_item").notNull(),
    idItemFornecedor: int("id_item_fornecedor").autoincrement().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idItemFornecedor],
      name: "item_fornecedores_id_item_fornecedor",
    }),
  ]
);

export const itensGerais = mysqlTable(
  "itens_gerais",
  {
    idItem: int("id_item").autoincrement().notNull(),
    marcaItem: varchar("marca_item", { length: 100 }).notNull(),
    medidasItem: varchar("medidas_item", { length: 100 }).notNull(),
    modeloItem: varchar("modelo_item", { length: 100 }).notNull(),
    origemItem: varchar("origem_item", { length: 30 }).notNull(),
    potenciaItem: decimal("potencia_item", {
      precision: 10,
      scale: 2,
    }).notNull(),
    precovendaItem: decimal("precovenda_item", {
      precision: 10,
      scale: 2,
    }).notNull(),
    statusItem: int("status_item").notNull(),
    tensaoItem: int("tensao_item").notNull(),
    tipoItem: varchar("tipo_item", { length: 50 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idItem], name: "itens_gerais_id_item" }),
  ]
);

export const keysAmazon = mysqlTable(
  "keys_amazon",
  {
    accessKey: varchar("access_key", { length: 500 }).notNull(),
    bucketAmazon: varchar("bucket_amazon", { length: 100 }).notNull(),
    idKey: int("id_key").autoincrement().notNull(),
    regiaoAmazon: varchar("regiao_amazon", { length: 100 }).notNull(),
    secretKey: varchar("secret_key", { length: 500 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idKey], name: "keys_amazon_id_key" }),
  ]
);

export const keysApiConsistem = mysqlTable(
  "keys_api_consistem",
  {
    idApiConsistem: int("id_api_consistem").autoincrement().notNull(),
    tokenApiConsistem: varchar("token_api_consistem", {
      length: 1000,
    }).notNull(),
    urlApiConsistem: varchar("url_api_consistem", { length: 50 }).notNull(),
    versaoApiConsistem: varchar("versao_api_consistem", {
      length: 20,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idApiConsistem],
      name: "keys_api_consistem_id_api_consistem",
    }),
  ]
);

export const keysApiCustomax = mysqlTable(
  "keys_api_customax",
  {
    idApiCustomax: int("id_api_customax").autoincrement().notNull(),
    loginAuthApiCustomax: varchar("loginAuth_api_customax", {
      length: 1000,
    }).notNull(),
    senhaAuthApiCustomax: varchar("senhaAuth_api_customax", {
      length: 1000,
    }).notNull(),
    urlApiCustomax: varchar("url_api_customax", { length: 50 }).notNull(),
    versaoApiCustomax: varchar("versao_api_customax", { length: 20 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idApiCustomax],
      name: "keys_api_customax_id_api_customax",
    }),
  ]
);

export const kitsSistema = mysqlTable(
  "kits_sistema",
  {
    codInversor1Kit: int("cod_inversor1_kit"),
    codInversor2Kit: int("cod_inversor2_kit").default(0),
    codInversor3Kit: int("cod_inversor3_kit").default(0),
    correnteInversores1Kit: decimal("corrente_inversores1_kit", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    correnteInversores2Kit: decimal("corrente_inversores2_kit", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    disjuntorComercialKit: int("disjuntor_comercial_kit").default(0),
    dpsCaKit: varchar("dps_ca_kit", { length: 150 }),
    finameKit: int("finame_kit").default(0).notNull(),
    idKit: int("id_kit").autoincrement().notNull(),
    monitoramentoKit: varchar("monitoramento_kit", { length: 300 }),
    potenciaInversorKit: decimal("potencia_inversor_kit", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    potenciaModuloKit: int("potencia_modulo_kit").notNull(),
    potenciaTrafoKit: decimal("potencia_trafo_kit", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    qtdInversor1Kit: int("qtd_inversor1_kit"),
    qtdInversor2Kit: int("qtd_inversor2_kit").default(0),
    qtdInversor3Kit: int("qtd_inversor3_kit").default(0),
    qtdMaxModulosKit: int("qtd_max_modulos_kit").notNull(),
    qtdMinModulosKit: int("qtd_min_modulos_kit").notNull(),
    rangeModulosKit: int("range_modulos_kit").notNull(),
    statusKit: int("status_kit").notNull(),
    tipoKit: int("tipo_kit").notNull(),
    valorComercialKit: decimal("valor_comercial_kit", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
  },
  (table) => [
    index("potencia_modulo_kit").on(table.potenciaModuloKit),
    primaryKey({ columns: [table.idKit], name: "kits_sistema_id_kit" }),
  ]
);

export const locksEtapas = mysqlTable(
  "locks_etapas",
  {
    coletaLock: int("coleta_lock").notNull(),
    datetimeLock: datetime("datetime_lock", { mode: "string" }).notNull(),
    etapaLock: int("etapa_lock").notNull(),
    idLock: int("id_lock").autoincrement().notNull(),
    userLock: int("user_lock").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idLock], name: "locks_etapas_id_lock" }),
  ]
);

export const logCustosProjeto = mysqlTable(
  "log_custos_projeto",
  {
    coletaLogCusto: int("coleta_log_custo").notNull(),
    dataLogCusto: datetime("data_log_custo", { mode: "string" }).notNull(),
    descricaoLogCusto: varchar("descricao_log_custo", { length: 4000 }),
    idLogCusto: int("id_log_custo").autoincrement().notNull(),
    motivoLogCusto: varchar("motivo_log_custo", { length: 4000 }),
    usuarioLogCusto: int("usuario_log_custo").notNull(),
  },
  (table) => [
    index("coleta_log_custo").on(table.coletaLogCusto),
    primaryKey({
      columns: [table.idLogCusto],
      name: "log_custos_projeto_id_log_custo",
    }),
  ]
);

export const logEncaminhamento = mysqlTable(
  "log_encaminhamento",
  {
    coletaLogEncaminhamento: int("coleta_log_encaminhamento").notNull(),
    dataLogEncaminhamento: datetime("data_log_encaminhamento", {
      mode: "string",
    }).notNull(),
    geracaoLogEncaminhamento: int("geracao_log_encaminhamento").notNull(),
    idLogEncaminhamento: int("id_log_encaminhamento").autoincrement().notNull(),
    motivoLogEncaminhamento: varchar("motivo_log_encaminhamento", {
      length: 1000,
    }).notNull(),
    responsavelLogEncaminhamento: int(
      "responsavel_log_encaminhamento"
    ).notNull(),
    statusLogEncaminhamento: int("status_log_encaminhamento").notNull(),
    usuarioLogEncaminhamento: int("usuario_log_encaminhamento").notNull(),
  },
  (table) => [
    index("coleta_log_encaminhamento").on(table.coletaLogEncaminhamento),
    primaryKey({
      columns: [table.idLogEncaminhamento],
      name: "log_encaminhamento_id_log_encaminhamento",
    }),
  ]
);

export const logGeracaoCsv = mysqlTable(
  "log_geracao_csv",
  {
    datetimeLogCsv: datetime("datetime_log_csv", { mode: "string" }).notNull(),
    descricaoLogCsv: varchar("descricao_log_csv", { length: 5000 }).notNull(),
    idLogCsv: int("id_log_csv").autoincrement().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idLogCsv],
      name: "log_geracao_csv_id_log_csv",
    }),
  ]
);

export const logIntegracaoConsistem = mysqlTable(
  "log_integracao_consistem",
  {
    clienteIntegracaoConsistem: int("cliente_integracao_consistem").notNull(),
    dataHoraIntegracaoConsistem: datetime("dataHora_integracao_consistem", {
      mode: "string",
    }).notNull(),
    idIntegracaoConsistem: int("id_integracao_consistem")
      .autoincrement()
      .notNull(),
    obsIntegracaoConsistem: varchar("obs_integracao_consistem", {
      length: 2000,
    }),
    origemIntegracaoConsistem: varchar("origem_integracao_consistem", {
      length: 100,
    }),
    projetoIntegracaoConsistem: int("projeto_integracao_consistem"),
    retornoApiIntegracaoConsistem: varchar("retornoAPI_integracao_consistem", {
      length: 2000,
    }).notNull(),
    tipoLogIntegracaoConsistem: varchar("tipoLog_integracao_consistem", {
      length: 500,
    }),
    usuarioIntegracaoConsistem: int("usuario_integracao_consistem"),
  },
  (table) => [
    primaryKey({
      columns: [table.idIntegracaoConsistem],
      name: "log_integracao_consistem_id_integracao_consistem",
    }),
  ]
);

export const logIntegracaoCrm = mysqlTable(
  "log_integracao_crm",
  {
    coletaLogIntegracaoCrm: int("coleta_logIntegracao_crm").notNull(),
    datetimeLogIntegracaoCrm: datetime("datetime_logIntegracao_crm", {
      mode: "string",
    }).notNull(),
    idLogIntegracaoCrm: int("id_logIntegracao_crm").autoincrement().notNull(),
    msgLogIntegracaoCrm: varchar("msg_logIntegracao_crm", {
      length: 500,
    }).notNull(),
    sucessoLogIntegracaoCrm: varchar("sucesso_logIntegracao_crm", {
      length: 100,
    }).notNull(),
    userLogIntegracaoCrm: int("user_logIntegracao_crm").notNull(),
  },
  (table) => [
    index("coleta_logIntegracao_crm").on(table.coletaLogIntegracaoCrm),
    primaryKey({
      columns: [table.idLogIntegracaoCrm],
      name: "log_integracao_crm_id_logIntegracao_crm",
    }),
  ]
);

export const logMudancaRegiaoVenda = mysqlTable(
  "log_mudanca_regiao_venda",
  {
    cidadeUfLogMudanca: varchar("cidadeUf_log_mudanca", {
      length: 255,
    }).notNull(),
    coletaLogMudanca: int("coleta_log_mudanca").notNull(),
    dateTimeLogMudanca: datetime("dateTime_log_mudanca", {
      mode: "string",
    }).notNull(),
    descricaoLogMudanca: varchar("descricao_log_mudanca", { length: 1000 }),
    idLogMudanca: int("id_log_mudanca").autoincrement().notNull(),
    regiaoAlteradaLogMudanca: int("regiaoAlterada_log_mudanca"),
    regiaoAntigaLogMudanca: int("regiaoAntiga_log_mudanca"),
    tipoLogMudanca: varchar("tipo_log_mudanca", { length: 100 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idLogMudanca],
      name: "log_mudanca_regiao_venda_id_log_mudanca",
    }),
  ]
);

export const logsAssinaturaDigital = mysqlTable(
  "logs_assinatura_digital",
  {
    documentKeyRetorno: varchar("document_key_retorno", {
      length: 500,
    }).notNull(),
    id: int().autoincrement().notNull(),
    idCfgAnexoLog: varchar("id_cfg_anexo_log", { length: 300 }),
    msgErroLog: varchar("msg_erro_log", { length: 800 }),
    retornoAws: varchar("retorno_aws", { length: 700 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "logs_assinatura_digital_id" }),
  ]
);

export const logsEmailInformativo = mysqlTable(
  "logs_email_informativo",
  {
    codCliente: int("cod_cliente").notNull(),
    codInformativo: int("cod_informativo").notNull(),
    codUsuario: int("cod_usuario").notNull(),
    dataLog: timestamp("data_log", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    descricaoLog: varchar("descricao_log", { length: 4000 }).notNull(),
    idLog: int("id_log").autoincrement().notNull(),
    rotinaLog: varchar("rotina_log", { length: 50 }).notNull(),
    tipoLog: varchar("tipo_log", { length: 50 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idLog],
      name: "logs_email_informativo_id_log",
    }),
  ]
);

export const logsErros = mysqlTable(
  "logs_erros",
  {
    datetimeLogErro: datetime("datetime_log_erro", {
      mode: "string",
    }).notNull(),
    descricaoLogErro: varchar("descricao_log_erro", { length: 1000 }).notNull(),
    idLogErro: int("id_log_erro").autoincrement().notNull(),
    rotinaLogErro: varchar("rotina_log_erro", { length: 100 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idLogErro], name: "logs_erros_id_log_erro" }),
  ]
);

export const logsEtapas = mysqlTable(
  "logs_etapas",
  {
    codCfgEtapaLog: int("cod_cfg_etapa_log").notNull(),
    codRegistro: int("cod_registro").notNull(),
    codUsuario: int("cod_usuario").notNull(),
    dataLog: timestamp("data_log", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    descricaoLog: varchar("descricao_log", { length: 4000 }).notNull(),
    idLog: int("id_log").autoincrement().notNull(),
    tipoLog: varchar("tipo_log", { length: 50 }).notNull(),
  },
  (table) => [
    index("cod_registro").on(table.codRegistro),
    primaryKey({ columns: [table.idLog], name: "logs_etapas_id_log" }),
  ]
);

export const logsGerais = mysqlTable(
  "logs_gerais",
  {
    codRegistro: int("cod_registro").notNull(),
    codUsuario: int("cod_usuario").notNull(),
    dataLog: timestamp("data_log", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    descricaoLog: varchar("descricao_log", { length: 4000 }).notNull(),
    idLog: int("id_log").autoincrement().notNull(),
    rotinaLog: varchar("rotina_log", { length: 50 }).notNull(),
    tipoLog: varchar("tipo_log", { length: 50 }).notNull(),
  },
  (table) => [
    index("rotina_log").on(table.rotinaLog),
    primaryKey({ columns: [table.idLog], name: "logs_gerais_id_log" }),
  ]
);

export const materiaisAdicionais = mysqlTable(
  "materiais_adicionais",
  {
    descritivoAdicional: varchar("descritivo_adicional", {
      length: 1000,
    }).notNull(),
    garantiaAdicional: varchar("garantia_adicional", { length: 300 }),
    idAdicional: int("id_adicional").autoincrement().notNull(),
    precoCustoAdicional: decimal("preco_custo_adicional", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    precoVendaAdicional: decimal("preco_venda_adicional", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    statusAdicional: int("status_adicional").notNull(),
    unidadeAdicional: varchar("unidade_adicional", { length: 50 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idAdicional],
      name: "materiais_adicionais_id_adicional",
    }),
  ]
);

export const materiaisComplementaresRequisicao = mysqlTable(
  "materiais_complementares_requisicao",
  {
    categoriasMaterial: varchar("categorias_material", { length: 100 }),
    idMaterial: int("id_material").autoincrement().notNull(),
    nomeMaterial: varchar("nome_material", { length: 100 }).notNull(),
    statusMaterial: int("status_material").notNull(),
    telhadosMaterial: varchar("telhados_material", { length: 100 }),
    unidadeMedidaMaterial: varchar("unidade_medida_material", {
      length: 20,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idMaterial],
      name: "materiais_complementares_requisicao_id_material",
    }),
  ]
);

export const matrizInstaladorRegiao = mysqlTable(
  "matriz_instalador_regiao",
  {
    idInstaladorRegiao: int("id_instalador_regiao").autoincrement().notNull(),
    instaladorInstaladorRegiao: int("instalador_instalador_regiao").notNull(),
    regiaoInstaladorRegiao: int("regiao_instalador_regiao").notNull(),
    statusInstaladorRegiao: int("status_instalador_regiao").notNull(),
    tabelaInstaladorRegiao: int("tabela_instalador_regiao").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idInstaladorRegiao],
      name: "matriz_instalador_regiao_id_instalador_regiao",
    }),
  ]
);

export const matrizMaximoPlacas = mysqlTable(
  "matriz_maximo_placas",
  {
    idMaximoPlacas: int("id_maximo_placas").autoincrement().notNull(),
    inversorMaximoPlacas: decimal("inversor_maximo_placas", {
      precision: 10,
      scale: 2,
    }).notNull(),
    moduloMaximoPlacas: decimal("modulo_maximo_placas", {
      precision: 10,
      scale: 2,
    }).notNull(),
    valorMaximoPlacas: int("valor_maximo_placas").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idMaximoPlacas],
      name: "matriz_maximo_placas_id_maximo_placas",
    }),
  ]
);

export const matrizMudancaInversores = mysqlTable(
  "matriz_mudanca_inversores",
  {
    de1Matriz: decimal("de1_matriz", { precision: 10, scale: 2 }).notNull(),
    de2Matriz: decimal("de2_matriz", { precision: 10, scale: 2 }).notNull(),
    de3Matriz: decimal("de3_matriz", { precision: 10, scale: 2 }).notNull(),
    idMatriz: int("id_matriz").autoincrement().notNull(),
    para1Matriz: decimal("para1_matriz", { precision: 10, scale: 2 }).notNull(),
    para2Matriz: decimal("para2_matriz", { precision: 10, scale: 2 }).notNull(),
    para3Matriz: decimal("para3_matriz", { precision: 10, scale: 2 }).notNull(),
    qtdDeMatriz: int("qtdDe_matriz").notNull(),
    qtdParaMatriz: int("qtdPara_matriz").notNull(),
    statusMatriz: int("status_matriz").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idMatriz],
      name: "matriz_mudanca_inversores_id_matriz",
    }),
  ]
);

export const mensagensContrato = mysqlTable(
  "mensagens_contrato",
  {
    codTipoContrato: int("cod_tipo_contrato").notNull(),
    idMensagem: int("id_mensagem").autoincrement().notNull(),
    statusMensagem: int("status_mensagem").notNull(),
    textoMensagem: varchar("texto_mensagem", { length: 2000 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idMensagem],
      name: "mensagens_contrato_id_mensagem",
    }),
  ]
);

export const menus = mysqlTable(
  "menus",
  {
    acessoDemoMenu: int("acessoDemo_menu").default(1).notNull(),
    consultaMenu: int("consulta_menu").default(0).notNull(),
    exclusivoCustomaxMenu: tinyint("exclusivo_customax_menu").notNull(),
    iconeMenu: varchar("icone_menu", { length: 50 }).notNull(),
    idMenu: int("id_menu").autoincrement().notNull(),
    menuMenu: int("menu_menu").notNull(),
    nomeMenu: varchar("nome_menu", { length: 100 }).notNull(),
    rotinaMenu: varchar("rotina_menu", { length: 25 }).notNull(),
    statusMenu: int("status_menu").notNull(),
    tipoMenu: int("tipo_menu").notNull(),
  },
  (table) => [primaryKey({ columns: [table.idMenu], name: "menus_id_menu" })]
);

export const minimoModulos = mysqlTable(
  "minimo_modulos",
  {
    idMinimo: int("id_minimo").autoincrement().notNull(),
    valorMinimo: int("valor_minimo").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idMinimo], name: "minimo_modulos_id_minimo" }),
  ]
);

export const modificacoesInversores = mysqlTable(
  "modificacoes_inversores",
  {
    coletaModificacao: int("coleta_modificacao").notNull(),
    correnteDisjuntorModificacao: decimal("correnteDisjuntor_modificacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    correnteInversores1Modificacao: decimal("correnteInversores1_modificacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    correnteInversores2Modificacao: decimal("correnteInversores2_modificacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    disjuntorComercialModificacao: int(
      "disjuntorComercial_modificacao"
    ).notNull(),
    idModificacao: int("id_modificacao").autoincrement().notNull(),
    inversor1Modificacao: int("inversor1_modificacao").notNull(),
    inversor2Modificacao: int("inversor2_modificacao").notNull(),
    inversor3Modificacao: int("inversor3_modificacao").notNull(),
    maiorDisjuntorModificacao: int("maiorDisjuntor_modificacao").notNull(),
    origemModificacao: int("origem_modificacao").default(0),
    potenciaInversoresModificacao: decimal("potenciaInversores_modificacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    potenciaTrafoModificacao: decimal("potenciaTrafo_modificacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    qtdInversor1Modificacao: int("qtdInversor1_modificacao").notNull(),
    qtdInversor2Modificacao: int("qtdInversor2_modificacao").notNull(),
    qtdInversor3Modificacao: int("qtdInversor3_modificacao").notNull(),
    valorAdicionalModificacao: decimal("valorAdicional_modificacao", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    index("coleta_modificacao").on(table.coletaModificacao),
    primaryKey({
      columns: [table.idModificacao],
      name: "modificacoes_inversores_id_modificacao",
    }),
  ]
);

export const moduloFornecedores = mysqlTable(
  "modulo_fornecedores",
  {
    codFornecedor: int("cod_fornecedor").notNull(),
    codModulo: int("cod_modulo").notNull(),
    idModuloFornecedor: int("id_modulo_fornecedor").autoincrement().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idModuloFornecedor],
      name: "modulo_fornecedores_id_modulo_fornecedor",
    }),
  ]
);

export const modulos = mysqlTable(
  "modulos",
  {
    celulaModulo: varchar("celula_modulo", { length: 50 }).notNull(),
    codigoFinameAcima375Modulo: int("codigo_finameAcima375_modulo"),
    codigoFinameAte375Modulo: int("codigo_finameAte375_modulo"),
    codigoFinameAte75Modulo: int("codigo_finameAte75_modulo"),
    garantiaModulo: int("garantia_modulo"),
    grupoModulo: varchar("grupo_modulo", { length: 50 }).notNull(),
    idModulo: int("id_modulo").autoincrement().notNull(),
    marcaModulo: varchar("marca_modulo", { length: 100 }).notNull(),
    medidasModulo: varchar("medidas_modulo", { length: 50 }).notNull(),
    minimoPlacaModulo: int("minimoPlaca_modulo").default(1).notNull(),
    modeloModulo: varchar("modelo_modulo", { length: 100 }).notNull(),
    origemModulo: varchar("origem_modulo", { length: 30 }).notNull(),
    potenciaModulo: decimal("potencia_modulo", {
      precision: 10,
      scale: 2,
    }).notNull(),
    precovendaModulo: decimal("precovenda_modulo", {
      precision: 10,
      scale: 2,
    }).notNull(),
    statusModulo: int("status_modulo").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idModulo], name: "modulos_id_modulo" }),
  ]
);

export const motivosNegocioPerdido = mysqlTable(
  "motivos_negocio_perdido",
  {
    idPerdido: int("id_perdido").autoincrement().notNull(),
    motivoPerdido: varchar("motivo_perdido", { length: 200 }).notNull(),
    statusPerdido: int("status_perdido").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idPerdido],
      name: "motivos_negocio_perdido_id_perdido",
    }),
  ]
);

export const ordensServico = mysqlTable(
  "ordens_servico",
  {
    caminhoOs: varchar("caminho_os", { length: 100 }).notNull(),
    codCliente: int("cod_cliente").notNull(),
    codColeta: int("cod_coleta").notNull(),
    codContrato: int("cod_contrato").notNull(),
    idOs: int("id_os").autoincrement().notNull(),
    statusOs: int("status_os").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idOs], name: "ordens_servico_id_os" }),
  ]
);

export const orientacaoSolar = mysqlTable(
  "orientacao_solar",
  {
    idOrientacao: int("id_orientacao").autoincrement().notNull(),
    nomeOrientacao: varchar("nome_orientacao", { length: 200 }).notNull(),
    siglaOrientacao: varchar("sigla_orientacao", { length: 10 }).notNull(),
    statusOrientacao: int("status_orientacao").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idOrientacao],
      name: "orientacao_solar_id_orientacao",
    }),
  ]
);

export const origens = mysqlTable(
  "origens",
  {
    idOrigem: int("id_origem").autoincrement().notNull(),
    nomeOrigem: varchar("nome_origem", { length: 200 }).notNull(),
    statusOrigem: int("status_origem").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idOrigem], name: "origens_id_origem" }),
  ]
);

export const osReparo = mysqlTable(
  "os_reparo",
  {
    caminhoOsReparo: varchar("caminhoOS_reparo", { length: 10_000 }),
    clienteReparo: int("cliente_reparo").notNull(),
    custoReparo: varchar("custo_reparo", { length: 300 }).notNull(),
    dataReclamacaoReparo: date("dataReclamacao_reparo", {
      mode: "string",
    }).notNull(),
    idosReparo: int("idos_reparo").autoincrement().notNull(),
    ocorrenciaReparo: varchar("ocorrencia_reparo", { length: 3000 }).notNull(),
    responsavelReparo: varchar("responsavel_reparo", { length: 50 }).notNull(),
    statusOsReparo: int("statusOS_reparo").notNull(),
    telefoneReparo: varchar("telefone_reparo", { length: 20 }).notNull(),
    ucReparo: int("uc_reparo").notNull(),
    vinculoColetaReparo: int("vinculoColeta_reparo").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idosReparo], name: "os_reparo_idos_reparo" }),
  ]
);

export const pagamentoInstaladores = mysqlTable(
  "pagamento_instaladores",
  {
    codAprovadorPagamentoInstalador: int(
      "cod_aprovador_pagamento_instalador"
    ).notNull(),
    codColetaPagamentoInstalador: int(
      "cod_coleta_pagamento_instalador"
    ).notNull(),
    codInstaladorPagamentoInstalador: int(
      "cod_instalador_pagamento_instalador"
    ).notNull(),
    codOsPagamentoInstalador: int("cod_os_pagamento_instalador").notNull(),
    datahoraPagamentoInstalador: datetime("datahora_pagamento_instalador", {
      mode: "string",
    }).notNull(),
    idPagamentoInstalador: int("id_pagamento_instalador")
      .autoincrement()
      .notNull(),
    tipoPagamentoInstalador: int("tipo_pagamento_instalador").notNull(),
    valorPagamentoInstalador: decimal("valor_pagamento_instalador", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    index("idx_pag_instalador_tipo").on(table.tipoPagamentoInstalador),
    primaryKey({
      columns: [table.idPagamentoInstalador],
      name: "pagamento_instaladores_id_pagamento_instalador",
    }),
  ]
);

export const parametrosComerciais = mysqlTable(
  "parametros_comerciais",
  {
    adicionalMaximoParametro: decimal("adicional_maximo_parametro", {
      precision: 10,
      scale: 2,
    }).notNull(),
    codigoFinameAcima375Parametro: int("codigo_finameAcima375_parametro"),
    codigoFinameAte375Parametro: int("codigo_finameAte375_parametro"),
    codigoFinameAte75Parametro: int("codigo_finameAte75_parametro"),
    custoFinanceiroCompraParametro: decimal(
      "custoFinanceiro_compra_parametro",
      { precision: 10, scale: 2 }
    ),
    custosFinanzeroParametro: decimal("custos_finanzero_parametro", {
      precision: 10,
      scale: 2,
    }),
    descontoMaximoParametro: decimal("desconto_maximo_parametro", {
      precision: 10,
      scale: 2,
    }).notNull(),
    descricao1FolharostoParametro: longtext("descricao1_folharosto_parametro"),
    descricao2FolharostoParametro: longtext("descricao2_folharosto_parametro"),
    despesasOperacionaisParametro: decimal("despesas_operacionais_parametro", {
      precision: 10,
      scale: 2,
    }),
    idParametro: int("id_parametro").autoincrement().notNull(),
    imgCabecalhoPropostaParametro: varchar("img_cabecalho_proposta_parametro", {
      length: 1000,
    }),
    imgCapa1PropostaParametro: varchar("img_capa1_proposta_parametro", {
      length: 1000,
    }),
    imgCapa2PropostaParametro: varchar("img_capa2_proposta_parametro", {
      length: 1000,
    }),
    imgRodapePropostaParametro: varchar("img_rodape_proposta_parametro", {
      length: 1000,
    }),
    imgRosto1PropostaParametro: varchar("img_rosto1_proposta_parametro", {
      length: 1000,
    }),
    imgRosto2PropostaParametro: varchar("img_rosto2_proposta_parametro", {
      length: 1000,
    }),
    impostosParametro: decimal("impostos_parametro", {
      precision: 10,
      scale: 2,
    }),
    inclinacaoLajeParametro: decimal("inclinacao_laje_parametro", {
      precision: 10,
      scale: 2,
    }).notNull(),
    inclinacaoTelhadoParametro: decimal("inclinacao_telhado_parametro", {
      precision: 10,
      scale: 2,
    }).notNull(),
    iofParametro: decimal("iof_parametro", {
      precision: 10,
      scale: 2,
    }).notNull(),
    jurosFinanciamentoParametro: decimal("juros_financiamento_parametro", {
      precision: 10,
      scale: 2,
    }).notNull(),
    materialAdicionalParametro: decimal("material_adicional_parametro", {
      precision: 10,
      scale: 2,
    }),
    modeloModuloParametro: int("modelo_modulo_parametro"),
    percentDiffTrocaInversor: decimal("percent_diff_troca_inversor", {
      precision: 10,
      scale: 2,
    }),
    potenciaModuloParametro: int("potencia_modulo_parametro"),
    reajusteRsiParametro: decimal("reajuste_rsi_parametro", {
      precision: 10,
      scale: 2,
    }).notNull(),
    titulo1FolharostoParametro: varchar("titulo1_folharosto_parametro", {
      length: 500,
    }),
    titulo2FolharostoParametro: varchar("titulo2_folharosto_parametro", {
      length: 500,
    }),
    topico113PropostaParametro: longtext("topico1_1_3_proposta_parametro"),
    topico13PropostaParametro: longtext("topico1_3_proposta_parametro"),
    topico32PropostaParametro: longtext("topico3_2_proposta_parametro"),
    topico341PropostaParametro: longtext("topico3_4_1_proposta_parametro"),
    topico343PropostaParametro: longtext("topico3_4_3_proposta_parametro"),
    topico344PropostaParametro: longtext("topico3_4_4_proposta_parametro"),
    valorHoraParametro: decimal("valor_hora_parametro", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    valorKmParametro: decimal("valor_km_parametro", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
  },
  (table) => [
    primaryKey({
      columns: [table.idParametro],
      name: "parametros_comerciais_id_parametro",
    }),
  ]
);

export const pedidosVenda = mysqlTable(
  "pedidos_venda",
  {
    caminhoPedido: varchar("caminho_pedido", { length: 100 }).notNull(),
    codClientePedido: int("cod_cliente_pedido").notNull(),
    codColetaPedido: int("cod_coleta_pedido").notNull(),
    codContratoPedido: int("cod_contrato_pedido").notNull(),
    idPedido: int("id_pedido").autoincrement().notNull(),
    statusPedido: int("status_pedido").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idPedido], name: "pedidos_venda_id_pedido" }),
  ]
);

export const percentualFiob = mysqlTable(
  "percentual_fiob",
  {
    anoPercentualFiob: int("ano_percentual_fiob").notNull(),
    idPercentualFiob: int("id_percentual_fiob").autoincrement().notNull(),
    valorPercentualFiob: int("valor_percentual_fiob").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idPercentualFiob],
      name: "percentual_fiob_id_percentual_fiob",
    }),
  ]
);

export const perdasMedias = mysqlTable(
  "perdas_medias",
  {
    codInclinacaoTelhado: int("cod_inclinacao_telhado").notNull(),
    codOrientacaoSolar: int("cod_orientacao_solar").notNull(),
    idPerda: int("id_perda").autoincrement().notNull(),
    statusPerda: int("status_perda").notNull(),
    valorPerda: decimal("valor_perda", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idPerda], name: "perdas_medias_id_perda" }),
  ]
);

export const perfis = mysqlTable(
  "perfis",
  {
    alteraInstaladorPerfil: int("alteraInstalador_perfil").default(0).notNull(),
    alteraPeriodoPerfil: int("alteraPeriodo_perfil").default(0).notNull(),
    baixaOsPosvPerfil: int("baixaOS_posv_perfil").default(0).notNull(),
    bloqueioPosvPerfil: int("bloqueio_posv_perfil").default(0).notNull(),
    editaClienteBloqueadoPerfil: int("editaCliente_bloqueado_perfil")
      .default(0)
      .notNull(),
    engenhariaPerfil: int("engenharia_perfil").notNull(),
    finalizaArtSemDocPerfil: int("finalizaARTSemDoc_perfil").default(0),
    idPerfil: int("id_perfil").autoincrement().notNull(),
    liberaPagamentoPerfil: int("libera_pagamento_perfil").default(0).notNull(),
    nomePerfil: varchar("nome_perfil", { length: 100 }).notNull(),
    permissaoObsDigitalPerfil: int("permissao_obs_digital_perfil").default(1),
    permissaoReaberturaPerfil: int("permissaoReabertura_perfil")
      .default(0)
      .notNull(),
    permissoesPerfil: varchar("permissoes_perfil", { length: 5000 }),
    reabreFaturamentoPerfil: int("reabre_faturamento_perfil")
      .default(0)
      .notNull(),
    reabreValidacaoCustoPerfil: int("reabre_validacao_custo_perfil")
      .default(0)
      .notNull(),
    reabreValidacaoPerfil: int("reabre_validacao_perfil").default(0),
    reagendamentoPosvPerfil: int("reagendamentoPosv_perfil").default(0),
    statusPerfil: int("status_perfil").notNull(),
    tipoPermissaoReaberturaPerfil: int("tipoPermissaoReabertura_perfil"),
    vendedorPerfil: int("vendedor_perfil").notNull(),
    visualizaArquivosDiversosPerfil: int("visualizaArquivosDiversos_perfil")
      .default(0)
      .notNull(),
    visualizaColetasPerfil: int("visualizaColetas_perfil").default(0),
  },
  (table) => [
    primaryKey({ columns: [table.idPerfil], name: "perfis_id_perfil" }),
  ]
);

export const permissaoMultiempresa = mysqlTable(
  "permissao_multiempresa",
  {
    configMultiempresa: int("config_multiempresa").notNull(),
    idPermMultiempresa: int("id_perm_multiempresa").autoincrement().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idPermMultiempresa],
      name: "permissao_multiempresa_id_perm_multiempresa",
    }),
  ]
);

export const posvArqChamado = mysqlTable(
  "posv_arq_chamado",
  {
    caminhoArqChamado: varchar("caminho_arq_chamado", {
      length: 255,
    }).notNull(),
    codChamado: int("cod_chamado").notNull(),
    idArqChamado: int("id_arq_chamado").autoincrement().notNull(),
    nomeArqChamado: varchar("nome_arq_chamado", { length: 255 }).notNull(),
  },
  (table) => [
    index("cod_chamado").on(table.codChamado),
    primaryKey({
      columns: [table.idArqChamado],
      name: "posv_arq_chamado_id_arq_chamado",
    }),
  ]
);

export const posvArqOrdensServico = mysqlTable(
  "posv_arq_ordens_servico",
  {
    caminhoArqPvos: varchar("caminho_arq_pvos", { length: 300 }).notNull(),
    codOsPvos: int("cod_os_pvos").notNull(),
    idArqPvos: int("id_arq_pvos").autoincrement().notNull(),
    nomeArqPvos: varchar("nome_arq_pvos", { length: 100 }).notNull(),
    origemArqPvos: int("origem_arq_pvos").default(0),
    pdfOsPvos: int("pdf_os_pvos"),
  },
  (table) => [
    index("cod_os_pvos").on(table.codOsPvos),
    primaryKey({
      columns: [table.idArqPvos],
      name: "posv_arq_ordens_servico_id_arq_pvos",
    }),
  ]
);

export const posvCategoriaChamados = mysqlTable(
  "posv_categoria_chamados",
  {
    colunaCatcham: varchar("coluna_catcham", { length: 255 }).notNull(),
    idCatcham: int("id_catcham").autoincrement().notNull(),
    nomeCatcham: varchar("nome_catcham", { length: 300 }).notNull(),
    statusCatcham: int("status_catcham").notNull(),
    tipoCatcham: int("tipo_catcham").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCatcham],
      name: "posv_categoria_chamados_id_catcham",
    }),
  ]
);

export const posvChamadoHistorico = mysqlTable(
  "posv_chamado_historico",
  {
    codChamadoHcham: int("cod_chamado_hcham").notNull(),
    codUsuarioHcham: int("cod_usuario_hcham"),
    dataHcham: datetime("data_hcham", { mode: "string" }).notNull(),
    descHcham: varchar("desc_hcham", { length: 1000 }).notNull(),
    idHcham: int("id_hcham").autoincrement().notNull(),
    tipoHcham: int("tipo_hcham").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idHcham],
      name: "posv_chamado_historico_id_hcham",
    }),
  ]
);

export const posvChamados = mysqlTable(
  "posv_chamados",
  {
    aberturaCham: date("abertura_cham", { mode: "string" }),
    autorCham: int("autor_cham"),
    chamadoRefCham: int("chamadoRef_cham"),
    codCategoriaCham: int("cod_categoria_cham"),
    codClienteCham: int("cod_cliente_cham"),
    codColetaCham: int("cod_coleta_cham"),
    codTipoDuvidaCham: int("cod_tipo_duvida_cham"),
    codTipoReclamacaoCham: int("cod_tipo_reclamacao_cham"),
    codTipoServicoCham: int("cod_tipo_servico_cham"),
    condicaoPagamentoCham: int("condicao_pagamento_cham"),
    dataCancelamento: date("data_cancelamento", { mode: "string" }),
    dataFaturamentoCham: date("data_faturamento_cham", { mode: "string" }),
    idCham: int("id_cham").autoincrement().notNull(),
    motivoCancelamento: varchar("motivo_cancelamento", { length: 500 }),
    nroNfCham: varchar("nro_nf_cham", { length: 100 }),
    obsCham: varchar("obs_cham", { length: 2000 }),
    obsInternasCham: varchar("obs_internas_cham", { length: 3000 }),
    previsaoCham: date("previsao_cham", { mode: "string" }),
    previsaoOriginalCham: date("previsao_original_cham", { mode: "string" }),
    prioridadeCham: int("prioridade_cham"),
    statusCham: int("status_cham").notNull(),
    tipoCham: int("tipo_cham").notNull(),
    totalFaturamentoCham: decimal("total_faturamento_cham", {
      precision: 10,
      scale: 2,
    }),
    ultimoStatusCham: int("ultimoStatus_cham"),
  },
  (table) => [
    index("cod_cliente_cham").on(table.codClienteCham),
    index("cod_coleta_cham").on(table.codColetaCham),
    index("cod_tipo_servico_cham").on(table.codTipoServicoCham),
    index("id_cham").on(table.idCham),
    index("tipo_cham").on(table.tipoCham),
    primaryKey({ columns: [table.idCham], name: "posv_chamados_id_cham" }),
  ]
);

export const posvCondicoesPagamento = mysqlTable(
  "posv_condicoes_pagamento",
  {
    idCondicaoPagamento: int("id_condicao_pagamento").autoincrement().notNull(),
    parcelaCondicaoPagamento: varchar("parcela_condicao_pagamento", {
      length: 1000,
    }).notNull(),
    statusCondicaoPagamento: int("status_condicao_pagamento").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idCondicaoPagamento],
      name: "posv_condicoes_pagamento_id_condicao_pagamento",
    }),
  ]
);

export const posvEmailFaturamento = mysqlTable(
  "posv_email_faturamento",
  {
    emailFaturamentoPvos: varchar("email_faturamento_pvos", {
      length: 1000,
    }).notNull(),
    idEmailFaturamentoPvos: int("id_email_faturamento_pvos")
      .autoincrement()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEmailFaturamentoPvos],
      name: "posv_email_faturamento_id_email_faturamento_pvos",
    }),
  ]
);

export const posvEquipesInstalacao = mysqlTable(
  "posv_equipes_instalacao",
  {
    idEquipe: int("id_equipe").autoincrement().notNull(),
    instaladorEquipe: int("instalador_equipe").notNull(),
    loginAppEquipe: varchar("loginApp_equipe", { length: 100 }),
    nomeEquipe: varchar("nome_equipe", { length: 500 }).notNull(),
    responsavelEquipe: varchar("responsavel_equipe", { length: 500 }).notNull(),
    senhaAppEquipe: varchar("senhaApp_equipe", { length: 100 }),
    statusEquipe: int("status_equipe").notNull(),
    termoAceito: int("termo_aceito").default(0).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idEquipe],
      name: "posv_equipes_instalacao_id_equipe",
    }),
  ]
);

export const posvLogClientesImportacao = mysqlTable(
  "posv_log_clientes_importacao",
  {
    cpfcnpjLogClienteImportacao: varchar("cpfcnpj_log_cliente_importacao", {
      length: 100,
    }).notNull(),
    idLogClienteImportacao: int("id_log_cliente_importacao")
      .autoincrement()
      .notNull(),
    nomeLogClienteImportacao: varchar("nome_log_cliente_importacao", {
      length: 1000,
    }).notNull(),
    tipoLogClienteImportacao: int("tipo_log_cliente_importacao").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idLogClienteImportacao],
      name: "posv_log_clientes_importacao_id_log_cliente_importacao",
    }),
  ]
);

export const posvMotivosReagendamento = mysqlTable(
  "posv_motivos_reagendamento",
  {
    idMotivoReagendamento: int("id_motivo_reagendamento")
      .autoincrement()
      .notNull(),
    motivoReagendamento: varchar("motivo_reagendamento", {
      length: 200,
    }).notNull(),
    statusMotivoReagendamento: int("status_motivo_reagendamento").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idMotivoReagendamento],
      name: "posv_motivos_reagendamento_id_motivo_reagendamento",
    }),
  ]
);

export const posvOrdensServico = mysqlTable(
  "posv_ordens_servico",
  {
    caminhoLayoutPvos: varchar("caminho_layout_pvos", { length: 3000 }),
    caminhoOsPvos: varchar("caminho_os_pvos", { length: 3000 }),
    codChamPvos: int("cod_cham_pvos").notNull(),
    codExecucaoPvos: int("codExecucao_pvos").notNull(),
    codExecutorPvos: int("codExecutor_pvos").notNull(),
    codInstaladorPagantePvos: int("codInstaladorPagante_pvos"),
    codRespfinPvos: int("cod_respfin_pvos").default(0).notNull(),
    condicaoPagamentoPvos: int("condicaoPagamento_pvos"),
    custoAssumidoPvos: int("custoAssumido_pvos"),
    dataAberturaPvos: datetime("data_abertura_pvos", {
      mode: "string",
    }).notNull(),
    dataBaixaPvos: datetime("data_baixa_pvos", { mode: "string" }),
    dataServicoPvos: date("data_servico_pvos", { mode: "string" }),
    dataconclusaoServicoPvos: date("dataconclusao_servico_pvos", {
      mode: "string",
    }),
    datafinalServicoPvos: date("datafinal_servico_pvos", { mode: "string" }),
    datasConsiderarPvos: int("datas_considerar_pvos").default(0).notNull(),
    equipePvos: int("equipe_pvos"),
    fotosEnviadasAppPvos: int("fotosEnviadasApp_pvos"),
    idPvos: int("id_pvos").autoincrement().notNull(),
    indicarInstaladorPvos: int("indicarInstalador_pvos").default(0).notNull(),
    justificativaInstaladorPagantePvos: varchar(
      "justificativaInstaladorPagante_pvos",
      { length: 1500 }
    ),
    motivoReagendamentoPvos: varchar("motivo_reagendamento_pvos", {
      length: 1000,
    }),
    obsCustoAssumidoPvos: varchar("obsCustoAssumido_pvos", { length: 1000 }),
    obsParaOsPvos: varchar("obs_para_os_pvos", { length: 3000 }),
    obsPvos: varchar("obs_pvos", { length: 3000 }),
    periodoPvos: varchar("periodo_pvos", { length: 30 }),
    qtdModulosPvos: int("qtdModulos_pvos").notNull(),
    statusPvos: int("status_pvos").notNull(),
    telefoneAdicionalPvos: varchar("telefone_adicional_pvos", { length: 20 }),
    terceiroPvos: int("terceiro_pvos").default(0).notNull(),
    userGerouPvos: int("user_gerou_pvos").notNull(),
    valorBaixaPvos: decimal("valorBaixa_pvos", { precision: 10, scale: 2 }),
    valorClientePvos: decimal("valorCliente_pvos", { precision: 10, scale: 2 }),
    valorInstaladorPagantePvos: decimal("valorInstaladorPagante_pvos", {
      precision: 10,
      scale: 2,
    }),
    valorPrebaixaPvos: decimal("valorPrebaixa_pvos", {
      precision: 10,
      scale: 2,
    }),
    valorTerceiroAberturaPvos: decimal("valorTerceiroAbertura_pvos", {
      precision: 10,
      scale: 2,
    }),
  },
  (table) => [
    index("cod_cham_pvos").on(table.codChamPvos),
    index("codExecutor_pvos").on(table.codExecutorPvos),
    index("data_servico_pvos").on(table.dataServicoPvos),
    index("datafinal_servico_pvos").on(table.datafinalServicoPvos),
    index("status_pvos").on(table.statusPvos),
    primaryKey({
      columns: [table.idPvos],
      name: "posv_ordens_servico_id_pvos",
    }),
  ]
);

export const posvPrebaixaOs = mysqlTable(
  "posv_prebaixa_os",
  {
    chamadoPrebaixaOs: int("chamado_prebaixa_os").notNull(),
    conclusaoServicoOs: date("conclusaoServico_os", {
      mode: "string",
    }).notNull(),
    datetimePrebaixaOs: datetime("datetime_prebaixa_os", {
      mode: "string",
    }).notNull(),
    descricaoAtrasoPrebaixaOs: varchar("descricaoAtraso_prebaixa_os", {
      length: 3000,
    }),
    idPrebaixaOs: int("id_prebaixa_os").autoincrement().notNull(),
    motivoAtrasoPrebaixaOs: int("motivoAtraso_prebaixa_os"),
    obsPrebaixaOs: varchar("obs_prebaixa_os", { length: 3000 }),
    origemPrebaixaOs: int("origem_prebaixa_os").default(0).notNull(),
    osAtrasadaPrebaixaOs: int("OsAtrasada_prebaixa_os"),
    osPrebaixaOs: int("os_prebaixa_os").notNull(),
    pdfPrebaixaOs: varchar("pdf_prebaixa_os", { length: 500 }),
    qtdHorasPrebaixaOs: int("qtdHoras_prebaixa_os"),
    qtdKmPrebaixaOs: int("qtdKm_prebaixa_os"),
    statusPrebaixaOs: int("status_prebaixa_os").notNull(),
    tipoCalculoPrebaixaOs: int("tipoCalculo_prebaixa_os").default(0).notNull(),
    userPrebaixaOs: int("user_prebaixa_os").notNull(),
    valorHoraPrebaixaOs: decimal("valorHora_prebaixa_os", {
      precision: 10,
      scale: 2,
    }),
    valorKmPrebaixaOs: decimal("valorKm_prebaixa_os", {
      precision: 10,
      scale: 2,
    }),
    valorPrebaixaOs: decimal("valor_prebaixa_os", {
      precision: 10,
      scale: 2,
    }).notNull(),
    valorServicoPrebaixaOs: decimal("valorServico_prebaixa_os", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    valorTotalHoraPrebaixaOs: decimal("valorTotalHora_prebaixa_os", {
      precision: 10,
      scale: 2,
    }),
    valorTotalKmPrebaixaOs: decimal("valorTotalKm_prebaixa_os", {
      precision: 10,
      scale: 2,
    }),
  },
  (table) => [
    index("chamado_prebaixa_os").on(table.chamadoPrebaixaOs),
    primaryKey({
      columns: [table.idPrebaixaOs],
      name: "posv_prebaixa_os_id_prebaixa_os",
    }),
  ]
);

export const posvPrioridades = mysqlTable(
  "posv_prioridades",
  {
    diasPrioridade: int("dias_prioridade").notNull(),
    idPrioridade: int("id_prioridade").autoincrement().notNull(),
    nomePrioridade: varchar("nome_prioridade", { length: 255 }).notNull(),
    statusPrioridade: int("status_prioridade").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idPrioridade],
      name: "posv_prioridades_id_prioridade",
    }),
  ]
);

export const posvProjetosExternos = mysqlTable(
  "posv_projetos_externos",
  {
    cidadeProjetoExterno: varchar("cidade_projeto_externo", { length: 100 }),
    clienteProjetoExterno: int("cliente_projeto_externo"),
    codigoProjetoExterno: int("codigo_projeto_externo"),
    coletaRefProjetoExterno: int("coletaRef_projeto_externo"),
    conclusaoInstProjetoExterno: varchar("conclusaoInst_projeto_externo", {
      length: 20,
    }),
    dataFechamentoProjetoExterno: date("dataFechamento_projeto_externo", {
      mode: "string",
    }),
    dataUltimaMntProjetoExterno: varchar("dataUltimaMnt_projeto_externo", {
      length: 20,
    }),
    enderecoUcProjetoExterno: varchar("enderecoUC_projeto_externo", {
      length: 1000,
    }),
    idProjetoExterno: int("id_projeto_externo").autoincrement().notNull(),
    inversor1ProjetoExterno: varchar("inversor1_projeto_externo", {
      length: 500,
    }),
    inversor2ProjetoExterno: varchar("inversor2_projeto_externo", {
      length: 500,
    }),
    inversor3ProjetoExterno: varchar("inversor3_projeto_externo", {
      length: 500,
    }),
    marcaModuloProjetoExterno: varchar("marcaModulo_projeto_externo", {
      length: 500,
    }),
    modeloModuloProjetoExterno: varchar("modeloModulo_projeto_externo", {
      length: 500,
    }),
    nroUcProjetoExterno: varchar("nroUC_projeto_externo", { length: 50 }),
    obsProjetoExterno: varchar("obs_projeto_externo", { length: 2000 }),
    potenciaModuloProjetoExterno: int("potenciaModulo_projeto_externo"),
    potenciaSistemaProjetoExterno: decimal("potenciaSistema_projeto_externo", {
      precision: 10,
      scale: 2,
    }),
    qtdInversor1ProjetoExterno: int("qtdInversor1_projeto_externo"),
    qtdInversor2ProjetoExterno: int("qtdInversor2_projeto_externo"),
    qtdInversor3ProjetoExterno: int("qtdInversor3_projeto_externo"),
    qtdModulosProjetoExterno: int("qtdModulos_projeto_externo"),
    statusProjetoExterno: int("status_projeto_externo"),
    tipoTelhadoProjetoExterno: varchar("tipoTelhado_projeto_externo", {
      length: 500,
    }),
    vendedorProjetoExterno: int("vendedor_projeto_externo"),
  },
  (table) => [
    index("cliente_projeto_externo").on(table.clienteProjetoExterno),
    primaryKey({
      columns: [table.idProjetoExterno],
      name: "posv_projetos_externos_id_projeto_externo",
    }),
  ]
);

export const posvPropostas = mysqlTable(
  "posv_propostas",
  {
    aprovadaPvproposta: int("aprovada_pvproposta").default(0).notNull(),
    caminhoPvproposta: varchar("caminho_pvproposta", { length: 100 }).notNull(),
    codChamPvproposta: int("cod_cham_pvproposta").notNull(),
    condicaoPagamentoPvproposta: varchar("condicao_pagamento_pvproposta", {
      length: 500,
    }).notNull(),
    dataPvproposta: datetime("data_pvproposta", { mode: "string" }).notNull(),
    datetimeAprovadaPvproposta: datetime("datetimeAprovada_pvproposta", {
      mode: "string",
    }),
    diamesPgtoPvproposta: int("diames_pgto_pvproposta"),
    espservPvproposta: varchar("espserv_pvproposta", { length: 3000 }),
    idPvproposta: int("id_pvproposta").autoincrement().notNull(),
    infaddPvproposta: varchar("infadd_pvproposta", { length: 3000 }),
    qtdModulosPvproposta: int("qtdModulos_pvproposta").notNull(),
    revisaoPvproposta: int("revisao_pvproposta").notNull(),
    statusPvproposta: int("status_pvproposta").notNull(),
    userAprovadaPvproposta: int("userAprovada_pvproposta"),
    userPvproposta: int("user_pvproposta").notNull(),
    valorPvproposta: decimal("valor_pvproposta", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    index("cod_cham_pvproposta").on(table.codChamPvproposta),
    primaryKey({
      columns: [table.idPvproposta],
      name: "posv_propostas_id_pvproposta",
    }),
  ]
);

export const posvReaberturaPrebaixa = mysqlTable(
  "posv_reabertura_prebaixa",
  {
    chamadoReaberturaPre: int("chamado_reabertura_pre").notNull(),
    datetimeReaberturaPre: datetime("datetime_reabertura_pre", {
      mode: "string",
    }).notNull(),
    idReaberturaPre: int("id_reabertura_pre").autoincrement().notNull(),
    osReaberturaPre: int("os_reabertura_pre").notNull(),
    statusReaberturaPre: int("status_reabertura_pre").notNull(),
    userReaberturaPre: int("user_reabertura_pre").notNull(),
  },
  (table) => [
    index("chamado_reabertura_pre").on(table.chamadoReaberturaPre),
    primaryKey({
      columns: [table.idReaberturaPre],
      name: "posv_reabertura_prebaixa_id_reabertura_pre",
    }),
  ]
);

export const posvReaberturaValidacaoCusto = mysqlTable(
  "posv_reabertura_validacao_custo",
  {
    chamadoReaberturaValidacaoCusto: int(
      "chamado_reabertura_validacao_custo"
    ).notNull(),
    codValidacaoReaberturaValidacaoCusto: int(
      "codValidacao_reabertura_validacao_custo"
    ).notNull(),
    datetimeReaberturaValidacaoCusto: datetime(
      "datetime_reabertura_validacao_custo",
      { mode: "string" }
    ).notNull(),
    idReaberturaValidacaoCusto: int("id_reabertura_validacao_custo")
      .autoincrement()
      .notNull(),
    userReaberturaValidacaoCusto: int(
      "user_reabertura_validacao_custo"
    ).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idReaberturaValidacaoCusto],
      name: "posv_reabertura_validacao_custo_id_reabertura_validacao_custo",
    }),
  ]
);

export const posvReagendamentos = mysqlTable(
  "posv_reagendamentos",
  {
    chamadoPvosReagendamento: int("chamado_pvos_reagendamento").notNull(),
    datetimeReagendamento: datetime("datetime_reagendamento", {
      mode: "string",
    }).notNull(),
    descMotivoReagendamentoPvos: varchar("descMotivo_reagendamento_pvos", {
      length: 3000,
    }).notNull(),
    execucaoReagendamento: int("execucao_reagendamento").notNull(),
    fimOriginalReagendamento: date("fimOriginal_reagendamento", {
      mode: "string",
    }).notNull(),
    idPvosReagendamento: int("id_pvos_reagendamento").autoincrement().notNull(),
    inicioOriginalReagendamento: date("inicioOriginal_reagendamento", {
      mode: "string",
    }).notNull(),
    motivoReagendamentoPvos: int("motivo_reagendamento_pvos").notNull(),
    novoFimReagendamento: date("novoFim_reagendamento", {
      mode: "string",
    }).notNull(),
    novoInicioReagendamento: date("novoInicio_reagendamento", {
      mode: "string",
    }).notNull(),
    osPvosReagendamento: int("os_pvos_reagendamento").notNull(),
    statusReagendamento: int("status_reagendamento").notNull(),
    terceiroPvosReagendamento: int("terceiro_pvos_reagendamento").notNull(),
    userReagendamento: int("user_reagendamento").notNull(),
  },
  (table) => [
    index("chamado_pvos_reagendamento").on(table.chamadoPvosReagendamento),
    index("os_pvos_reagendamento").on(table.osPvosReagendamento),
    primaryKey({
      columns: [table.idPvosReagendamento],
      name: "posv_reagendamentos_id_pvos_reagendamento",
    }),
  ]
);

export const posvRespFinanceira = mysqlTable(
  "posv_resp_financeira",
  {
    faturarRespfin: int("faturar_respfin").notNull(),
    idRespfin: int("id_respfin").autoincrement().notNull(),
    isTerceiroRespfin: tinyint("is_terceiro_respfin").notNull(),
    nomeRespfin: varchar("nome_respfin", { length: 100 }).notNull(),
    statusRespfin: int("status_respfin").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idRespfin],
      name: "posv_resp_financeira_id_respfin",
    }),
  ]
);

export const posvStatusChamado = mysqlTable(
  "posv_status_chamado",
  {
    codStcham: int("cod_stcham").notNull(),
    corStcham: varchar("cor_stcham", { length: 20 }).notNull(),
    idStcham: int("id_stcham").notNull(),
    inativaOsStcham: int("inativaOS_stcham").notNull(),
    inativaPropostaStcham: int("inativaProposta_stcham").notNull(),
    mudancaManualStcham: int("mudancaManual_stcham").notNull(),
    nomeStcham: varchar("nome_stcham", { length: 100 }).notNull(),
    statusStcham: int("status_stcham").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idStcham],
      name: "posv_status_chamado_id_stcham",
    }),
  ]
);

export const posvTarefas = mysqlTable(
  "posv_tarefas",
  {
    codChamadoTarefa: int("cod_chamado_tarefa").notNull(),
    dataBaixaTarefa: date("data_baixa_tarefa", { mode: "string" }),
    dataLimiteTarefa: date("data_limite_tarefa", { mode: "string" }).notNull(),
    descricaoConclusao: varchar("descricao_conclusao", { length: 2000 }),
    descricaoTarefa: varchar("descricao_tarefa", { length: 2000 }).notNull(),
    idTarefa: int("id_tarefa").autoincrement().notNull(),
    problemaResolvido: int("problema_resolvido").default(0).notNull(),
    responsavelTarefa: int("responsavel_tarefa").notNull(),
    statusTarefa: int("status_tarefa").notNull(),
    tituloTarefa: varchar("titulo_tarefa", { length: 255 }).notNull(),
  },
  (table) => [
    index("cod_chamado_tarefa").on(table.codChamadoTarefa),
    primaryKey({ columns: [table.idTarefa], name: "posv_tarefas_id_tarefa" }),
  ]
);

export const posvTarefasAnexos = mysqlTable(
  "posv_tarefas_anexos",
  {
    caminhoAnexoTarefa: varchar("caminho_anexo_tarefa", {
      length: 255,
    }).notNull(),
    codTarefaAnexo: int("cod_tarefa_anexo").notNull(),
    idAnexoTarefa: int("id_anexo_tarefa").autoincrement().notNull(),
    nomeAnexoTarefa: varchar("nome_anexo_tarefa", { length: 255 }).notNull(),
  },
  (table) => [
    index("cod_tarefa_anexo").on(table.codTarefaAnexo),
    primaryKey({
      columns: [table.idAnexoTarefa],
      name: "posv_tarefas_anexos_id_anexo_tarefa",
    }),
  ]
);

export const posvTarefasLancamentos = mysqlTable(
  "posv_tarefas_lancamentos",
  {
    codTarefa: int("cod_tarefa").notNull(),
    dataLancamento: timestamp("data_lancamento", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    descricaoLancamento: varchar("descricao_lancamento", {
      length: 255,
    }).notNull(),
    idLancamento: int("id_lancamento").autoincrement().notNull(),
    problemaResolvido: int("problema_resolvido").notNull(),
  },
  (table) => [
    index("cod_tarefa").on(table.codTarefa),
    primaryKey({
      columns: [table.idLancamento],
      name: "posv_tarefas_lancamentos_id_lancamento",
    }),
  ]
);

export const posvTiposDuvida = mysqlTable(
  "posv_tipos_duvida",
  {
    codPrioridadeDuvida: int("cod_prioridade_duvida").notNull(),
    codResponsavelDuvida: int("cod_responsavel_duvida").notNull(),
    idTipoDuvida: int("id_tipo_duvida").autoincrement().notNull(),
    nomeTipoDuvida: varchar("nome_tipo_duvida", { length: 500 }).notNull(),
    statusTipoDuvida: int("status_tipo_duvida").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTipoDuvida],
      name: "posv_tipos_duvida_id_tipo_duvida",
    }),
  ]
);

export const posvTiposPeriodo = mysqlTable(
  "posv_tipos_periodo",
  {
    idTipoPeriodo: int("id_tipo_periodo").autoincrement().notNull(),
    multiplicadorTipoPeriodo: int("multiplicador_tipo_periodo").notNull(),
    nomePluralTipoPeriodo: varchar("nomePlural_tipo_periodo", {
      length: 50,
    }).notNull(),
    nomeTipoPeriodo: varchar("nome_tipo_periodo", { length: 50 }).notNull(),
    statusTipoPeriodo: int("status_tipo_periodo").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTipoPeriodo],
      name: "posv_tipos_periodo_id_tipo_periodo",
    }),
  ]
);

export const posvTiposReclamacao = mysqlTable(
  "posv_tipos_reclamacao",
  {
    codPrioridadeReclamacao: int("cod_prioridade_reclamacao").notNull(),
    codResponsavelReclamacao: int("cod_responsavel_reclamacao").notNull(),
    idTipoReclamacao: int("id_tipo_reclamacao").autoincrement().notNull(),
    nomeTipoReclamacao: varchar("nome_tipo_reclamacao", {
      length: 500,
    }).notNull(),
    statusTipoReclamacao: int("status_tipo_reclamacao").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTipoReclamacao],
      name: "posv_tipos_reclamacao_id_tipo_reclamacao",
    }),
  ]
);

export const posvTiposServico = mysqlTable(
  "posv_tipos_servico",
  {
    categoriaTipoServico: int("categoria_tipo_servico").notNull(),
    codPrioridadeServico: int("cod_prioridade_servico"),
    codResponsavelServico: int("cod_responsavel_servico"),
    codTipoPeriodoTipoServico: int("cod_tipoPeriodo_tipo_servico"),
    especificacoesTipoServico: varchar("especificacoes_tipo_servico", {
      length: 3000,
    }).notNull(),
    idTipoServico: int("id_tipo_servico").autoincrement().notNull(),
    informacoesaddTipoServico: varchar("informacoesadd_tipo_servico", {
      length: 3000,
    }).notNull(),
    modeloOsTipoServico: varchar("modeloOS_tipo_servico", {
      length: 200,
    }).notNull(),
    nomeTipoServico: varchar("nome_tipo_servico", { length: 300 }).notNull(),
    periodoTipoServico: int("periodo_tipo_servico"),
    statusTipoServico: int("status_tipo_servico").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTipoServico],
      name: "posv_tipos_servico_id_tipo_servico",
    }),
  ]
);

export const posvValidacaoCusto = mysqlTable(
  "posv_validacao_custo",
  {
    alteracaoValidacaoCusto: int("alteracao_validacao_custo")
      .default(0)
      .notNull(),
    chamadoValidacaoCusto: int("chamado_validacao_custo").notNull(),
    codInstaladorPaganteOriginalValidacaoCusto: int(
      "codInstaladorPaganteOriginal_validacao_custo"
    ),
    codInstaladorPaganteValidadoValidacaoCusto: int(
      "codInstaladorPaganteValidado_validacao_custo"
    ),
    dataConclusaoOriginalValidacaoCusto: date(
      "dataConclusaoOriginal_validacao_custo",
      { mode: "string" }
    ).notNull(),
    dataConclusaoValidadoValidacaoCusto: date(
      "dataConclusaoValidado_validacao_custo",
      { mode: "string" }
    ).notNull(),
    datetimeValidacaoCusto: datetime("datetime_validacao_custo", {
      mode: "string",
    }).notNull(),
    idValidacaoCusto: int("id_validacao_custo").autoincrement().notNull(),
    indicarInstaladorOriginalValidacaoCusto: int(
      "indicarInstaladorOriginal_validacao_custo"
    ).default(0),
    indicarInstaladorValidadoValidacaoCusto: int(
      "indicarInstaladorValidado_validacao_custo"
    ).default(0),
    justificativaInstaladorPaganteOriginalValidacaoCusto: text(
      "justificativaInstaladorPaganteOriginal_validacao_custo"
    ),
    justificativaInstaladorPaganteValidadoValidacaoCusto: text(
      "justificativaInstaladorPaganteValidado_validacao_custo"
    ),
    kilometragemOriginalValidacaoCusto: int(
      "kilometragemOriginal_validacao_custo"
    ),
    kilometragemValidadoValidacaoCusto: int(
      "kilometragemValidado_validacao_custo"
    ),
    motivoAlteracaoValidacaoCusto: varchar("motivoAlteracao_validacao_custo", {
      length: 5000,
    }),
    obsOriginalValidacaoCusto: varchar("obsOriginal_validacao_custo", {
      length: 5000,
    }),
    obsValidadoValidacaoCusto: varchar("obsValidado_validacao_custo", {
      length: 5000,
    }),
    qtdHorasOriginalValidacaoCusto: int("qtdHorasOriginal_validacao_custo"),
    qtdHorasValidadoValidacaoCusto: int("qtdHorasValidado_validacao_custo"),
    responsFinOriginalValidacaoCusto: int(
      "responsFinOriginal_validacao_custo"
    ).notNull(),
    responsFinValidadoValidacaoCusto: int(
      "responsFinValidado_validacao_custo"
    ).notNull(),
    statusValidacaoCusto: int("status_validacao_custo").notNull(),
    terceiroRespFinOriginalValidacaoCusto: int(
      "terceiroRespFinOriginal_validacao_custo"
    ),
    terceiroRespFinValidadoValidacaoCusto: int(
      "terceiroRespFinValidado_validacao_custo"
    ),
    tipoCalculoOriginalValidacaoCusto: int(
      "tipoCalculoOriginal_validacao_custo"
    ).notNull(),
    tipoCalculoValidadoValidacaoCusto: int(
      "tipoCalculoValidado_validacao_custo"
    ).notNull(),
    userValidacaoCusto: int("user_validacao_custo").notNull(),
    valorCobradoClienteOriginalValidacaoCusto: decimal(
      "valorCobradoClienteOriginal_validacao_custo",
      { precision: 10, scale: 2 }
    )
      .default("0.00")
      .notNull(),
    valorCobradoClienteValidadoValidacaoCusto: decimal(
      "valorCobradoClienteValidado_validacao_custo",
      { precision: 10, scale: 2 }
    )
      .default("0.00")
      .notNull(),
    valorHoraOriginalValidacaoCusto: decimal(
      "valorHoraOriginal_validacao_custo",
      { precision: 10, scale: 2 }
    ),
    valorHoraValidadoValidacaoCusto: decimal(
      "valorHoraValidado_validacao_custo",
      { precision: 10, scale: 2 }
    ),
    valorInstaladorPaganteOriginalValidacaoCusto: decimal(
      "valorInstaladorPaganteOriginal_validacao_custo",
      { precision: 10, scale: 2 }
    ),
    valorInstaladorPaganteValidadoValidacaoCusto: decimal(
      "valorInstaladorPaganteValidado_validacao_custo",
      { precision: 10, scale: 2 }
    ),
    valorKmOriginalValidacaoCusto: decimal("valorKmOriginal_validacao_custo", {
      precision: 10,
      scale: 2,
    }),
    valorKmValidadoValidacaoCusto: decimal("valorKmValidado_validacao_custo", {
      precision: 10,
      scale: 2,
    }),
    valorServicoOriginalValidacaoCusto: decimal(
      "valorServicoOriginal_validacao_custo",
      { precision: 10, scale: 2 }
    ),
    valorServicoValidadoValidacaoCusto: decimal(
      "valorServicoValidado_validacao_custo",
      { precision: 10, scale: 2 }
    ),
    valorTotalOriginalValidacaoCusto: decimal(
      "valorTotalOriginal_validacao_custo",
      { precision: 10, scale: 2 }
    ).notNull(),
    valorTotalValidadoValidacaoCusto: decimal(
      "valorTotalValidado_validacao_custo",
      { precision: 10, scale: 2 }
    ).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idValidacaoCusto],
      name: "posv_validacao_custo_id_validacao_custo",
    }),
  ]
);

export const precosKits = mysqlTable(
  "precos_kits",
  {
    caminhoPrecoKit: varchar("caminho_preco_kit", { length: 500 }).notNull(),
    ceramicaEquipamentoPrecoKit: decimal("ceramica_equipamento_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    ceramicaPrecoKit: decimal("ceramica_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    ceramicaServicoPrecoKit: decimal("ceramica_servico_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    ceramicaTotalPrecoKit: decimal("ceramica_total_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    ceramicoCustoKit: decimal("ceramico_custo_kit", {
      precision: 10,
      scale: 2,
    }).notNull(),
    datahoraPrecoKit: datetime("datahora_preco_kit", {
      mode: "string",
    }).notNull(),
    fccaCustoKit: decimal("fcca_custo_kit", {
      precision: 10,
      scale: 2,
    }).notNull(),
    fccaEquipamentoPrecoKit: decimal("fcca_equipamento_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    fccaPrecoKit: decimal("fcca_preco_kit", { precision: 10, scale: 2 }),
    fccaServicoPrecoKit: decimal("fcca_servico_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    fccaTotalPrecoKit: decimal("fcca_total_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    fnamePrecoKit: varchar("fname_preco_kit", { length: 50 }),
    garagemCustoKit: decimal("garagem_custo_kit", {
      precision: 10,
      scale: 2,
    }).notNull(),
    garagemEquipamentoPrecoKit: decimal("garagem_equipamento_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    garagemPrecoKit: decimal("garagem_preco_kit", { precision: 10, scale: 2 }),
    garagemServicoPrecoKit: decimal("garagem_servico_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    garagemTotalPrecoKit: decimal("garagem_total_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    idPrecoKit: int("id_preco_kit").autoincrement().notNull(),
    maxModulosPrecoKit: int("max_modulos_preco_kit").default(0),
    mdaPrecoKit: varchar("mda_preco_kit", { length: 50 }),
    metalicoCustoKit: decimal("metalico_custo_kit", {
      precision: 10,
      scale: 2,
    }).notNull(),
    metalicoEquipamentoPrecoKit: decimal("metalico_equipamento_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    metalicoPrecoKit: decimal("metalico_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    metalicoServicoPrecoKit: decimal("metalico_servico_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    metalicoTotalPrecoKit: decimal("metalico_total_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    minModulosPrecoKit: int("min_modulos_preco_kit").default(0),
    potenciaPrecoKit: int("potencia_preco_kit").notNull(),
    qtdModulosPrecoKit: int("qtdModulos_preco_kit").notNull(),
    soloCustoKit: decimal("solo_custo_kit", {
      precision: 10,
      scale: 2,
    }).notNull(),
    soloEquipamentoPrecoKit: decimal("solo_equipamento_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    soloPrecoKit: decimal("solo_preco_kit", { precision: 10, scale: 2 }),
    soloServicoPrecoKit: decimal("solo_servico_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    soloTotalPrecoKit: decimal("solo_total_preco_kit", {
      precision: 10,
      scale: 2,
    }),
    statusPrecoKit: int("status_preco_kit").notNull(),
    tabelaPrecoKit: int("tabela_preco_kit").notNull(),
    tipoPrecoKit: int("tipo_preco_kit").notNull(),
    userPrecoKit: int("user_preco_kit").notNull(),
    valorEngenhariaKit: decimal("valor_engenharia_kit", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    index("potencia_preco_kit").on(table.potenciaPrecoKit),
    primaryKey({
      columns: [table.idPrecoKit],
      name: "precos_kits_id_preco_kit",
    }),
  ]
);

export const propostas = mysqlTable(
  "propostas",
  {
    abatimentoProposta: decimal("abatimento_proposta", {
      precision: 10,
      scale: 2,
    }).notNull(),
    adicionalInversoresProposta: decimal("adicionalInversores_proposta", {
      precision: 10,
      scale: 2,
    }).default("0.00"),
    adicionalKitManualProposta: decimal("adicionalKitManual_proposta", {
      precision: 10,
      scale: 2,
    }),
    adicionalTelhadoProposta: decimal("adicionalTelhado_proposta", {
      precision: 10,
      scale: 2,
    })
      .default("0.00")
      .notNull(),
    amperesDisjuntorProposta: int("amperesDisjuntor_proposta")
      .default(0)
      .notNull(),
    caminhoProposta: varchar("caminho_proposta", { length: 1000 }),
    clienteProposta: int("cliente_proposta").notNull(),
    codMdaProposta: varchar("codMda_proposta", { length: 50 }),
    coletaProposta: int("coleta_proposta").notNull(),
    composicao2TabelaPrecoProposta: int("composicao2_tabela_preco_proposta")
      .default(0)
      .notNull(),
    composicaoTabelaPrecoProposta: int("composicao_tabela_preco_proposta")
      .default(0)
      .notNull(),
    consumoTotalProposta: decimal("consumoTotal_proposta", {
      precision: 10,
      scale: 2,
    }).notNull(),
    dataEmailProposta: date("dataEmail_proposta", { mode: "string" }),
    dataProposta: date("data_proposta", { mode: "string" }),
    desvio1Proposta: decimal("desvio1_proposta", {
      precision: 10,
      scale: 2,
    }).notNull(),
    desvio2Proposta: decimal("desvio2_proposta", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    desvio3Proposta: decimal("desvio3_proposta", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    desvio4Proposta: decimal("desvio4_proposta", { precision: 10, scale: 2 })
      .default("0.00")
      .notNull(),
    emailsProposta: varchar("emails_proposta", { length: 10_000 }),
    estimativaProposta: int("estimativa_proposta").notNull(),
    fnameProposta: varchar("fname_proposta", { length: 50 }),
    grupoProposta: varchar("grupo_proposta", { length: 50 }).notNull(),
    horaEmailProposta: time("horaEmail_proposta"),
    horaProposta: time("hora_proposta"),
    idProposta: int("id_proposta").autoincrement().notNull(),
    inclinacao1Proposta: int("inclinacao1_proposta").notNull(),
    inclinacao2Proposta: int("inclinacao2_proposta").default(0).notNull(),
    inclinacao3Proposta: int("inclinacao3_proposta").default(0).notNull(),
    inclinacao4Proposta: int("inclinacao4_proposta").default(0).notNull(),
    kitProposta: int("kit_proposta").notNull(),
    minimoDisjuntorProposta: int("minimoDisjuntor_proposta")
      .default(0)
      .notNull(),
    minimoSubestacaoProposta: int("minimoSubestacao_proposta")
      .default(0)
      .notNull(),
    modulosDigitadoProposta: int("modulosDigitado_proposta").notNull(),
    modulosNecessariosProposta: decimal("modulosNecessarios_proposta", {
      precision: 10,
      scale: 1,
    }).notNull(),
    motivoOutrosProposta: varchar("motivoOutros_proposta", { length: 1000 }),
    orientacao1Proposta: int("orientacao1_proposta").notNull(),
    orientacao2Proposta: int("orientacao2_proposta").default(0).notNull(),
    orientacao3Proposta: int("orientacao3_proposta").default(0).notNull(),
    orientacao4Proposta: int("orientacao4_proposta").default(0).notNull(),
    outrosValoresProposta: decimal("outrosValores_proposta", {
      precision: 10,
      scale: 2,
    })
      .default("0.00")
      .notNull(),
    potenciaSistemaProposta: decimal("potenciaSistema_proposta", {
      precision: 10,
      scale: 2,
    }).notNull(),
    pronafProposta: int("pronaf_proposta").notNull(),
    qtdModulos1Proposta: int("qtdModulos1_proposta").notNull(),
    qtdModulos2Proposta: int("qtdModulos2_proposta").default(0).notNull(),
    qtdModulos3Proposta: int("qtdModulos3_proposta").default(0).notNull(),
    qtdModulos4Proposta: int("qtdModulos4_proposta").default(0).notNull(),
    qtdOrientacoesProposta: int("qtdOrientacoes_proposta").notNull(),
    revisaoProposta: int("revisao_proposta").notNull(),
    statusProposta: int("status_proposta").notNull(),
    tabelaPrecoProposta: int("tabela_preco_proposta"),
    tipoEnvioProposta: int("tipoEnvio_proposta").default(0).notNull(),
    tipoProposta: varchar("tipo_proposta", { length: 100 }).notNull(),
    userEmailProposta: int("userEmail_proposta"),
    userProposta: int("user_proposta"),
    valorEquipamentosProposta: decimal("valorEquipamentos_proposta", {
      precision: 10,
      scale: 2,
    }),
    valorOriginalProposta: decimal("valorOriginal_proposta", {
      precision: 10,
      scale: 2,
    }),
    valorPrazoProposta: decimal("valorPrazo_proposta", {
      precision: 10,
      scale: 2,
    }),
    valorProposta: decimal("valor_proposta", { precision: 10, scale: 2 }),
    valorServicosProposta: decimal("valorServicos_proposta", {
      precision: 10,
      scale: 2,
    }),
    valorSubestacaoProposta: int("valorSubestacao_proposta")
      .default(0)
      .notNull(),
    valorTotalProposta: decimal("valorTotal_proposta", {
      precision: 10,
      scale: 2,
    }),
  },
  (table) => [
    index("coleta_proposta").on(table.coletaProposta),
    primaryKey({ columns: [table.idProposta], name: "propostas_id_proposta" }),
  ]
);

export const regioes = mysqlTable(
  "regioes",
  {
    idRegiao: int("id_regiao").autoincrement().notNull(),
    indiceRegiao: decimal("indice_regiao", {
      precision: 10,
      scale: 2,
    }).notNull(),
    nomeRegiao: varchar("nome_regiao", { length: 100 }).notNull(),
    statusRegiao: int("status_regiao").notNull(),
    tabelasRegiao: varchar("tabelas_regiao", { length: 1000 }),
  },
  (table) => [
    primaryKey({ columns: [table.idRegiao], name: "regioes_id_regiao" }),
  ]
);

export const regioesVenda = mysqlTable(
  "regioes_venda",
  {
    idRegiaoVenda: int("id_regiao_venda").autoincrement().notNull(),
    nomeRegiaoVenda: varchar("nome_regiao_venda", { length: 100 }).notNull(),
    statusRegiaoVenda: int("status_regiao_venda").notNull(),
    tabCustoInstRegiaoVenda: int("tabCustoInst_regiao_venda"),
  },
  (table) => [
    primaryKey({
      columns: [table.idRegiaoVenda],
      name: "regioes_venda_id_regiao_venda",
    }),
  ]
);

export const regionaisConcessionaria = mysqlTable(
  "regionais_concessionaria",
  {
    cidadeRegional: varchar("cidade_regional", { length: 100 }).notNull(),
    idRegional: int("id_regional").autoincrement().notNull(),
    idUfRegional: int("idUf_regional").notNull(),
    nomeConcessionariaRegional: varchar("nomeConcessionaria_regional", {
      length: 150,
    }).notNull(),
    statusRegional: int("status_regional").notNull(),
    ufRegional: varchar("uf_regional", { length: 2 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idRegional],
      name: "regionais_concessionaria_id_regional",
    }),
  ]
);

export const representanteLegalColigado = mysqlTable(
  "representante_legal_coligado",
  {
    codColigadoRepresentante: int("cod_coligado_representante").notNull(),
    cpfRepresentanteColigado: varchar("cpf_representante_coligado", {
      length: 50,
    }).notNull(),
    dataNascRepresentanteColigado: date("data_nasc_representante_coligado", {
      mode: "string",
    }).notNull(),
    emailRepresentanteColigado: varchar("email_representante_coligado", {
      length: 400,
    }).notNull(),
    idRepresentanteColigado: int("id_representante_coligado")
      .autoincrement()
      .notNull(),
    nomeRepresentanteColigado: varchar("nome_representante_coligado", {
      length: 100,
    }).notNull(),
    statusRepresentanteColigado: int("status_representante_coligado")
      .default(1)
      .notNull(),
    telefoneRepresentanteColigado: varchar("telefone_representante_coligado", {
      length: 15,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idRepresentanteColigado],
      name: "representante_legal_coligado_id_representante_coligado",
    }),
  ]
);

export const representantesLegais = mysqlTable(
  "representantes_legais",
  {
    coletaRepresentante: int("coleta_representante").notNull(),
    cpfRepresentante: varchar("cpf_representante", { length: 50 }).notNull(),
    dataNascRepresentante: date("data_nasc_representante", { mode: "string" }),
    emailRepresentante: varchar("email_representante", { length: 300 }),
    idRepresentante: int("id_representante").autoincrement().notNull(),
    nomeRepresentante: varchar("nome_representante", { length: 100 }).notNull(),
    statusRepresentante: int("status_representante").notNull(),
    telefoneRepresentante: varchar("telefone_representante", { length: 30 }),
    tipoRepresentante: int("tipo_representante").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idRepresentante],
      name: "representantes_legais_id_representante",
    }),
  ]
);

export const requerimentosAcesso = mysqlTable(
  "requerimentos_acesso",
  {
    caminhoRequerimento: varchar("caminho_requerimento", {
      length: 1000,
    }).notNull(),
    cepEnderecoRequerimento: varchar("cep_endereco_requerimento", {
      length: 20,
    }),
    cidadeEnderecoRequerimento: varchar("cidade_endereco_requerimento", {
      length: 100,
    }),
    codColetaRequerimento: int("cod_coleta_requerimento").notNull(),
    codColigadoRequerimento: int("cod_coligado_requerimento"),
    codRegconcessRequerimento: int("cod_regconcess_requerimento").notNull(),
    correnteDisjuntorRequerimento: int("corrente_disjuntor_requerimento"),
    docOpcao1Requerimento: tinyint("doc_opcao1_requerimento").notNull(),
    docOpcao2Requerimento: tinyint("doc_opcao2_requerimento").notNull(),
    docOpcao3Requerimento: tinyint("doc_opcao3_requerimento").notNull(),
    docOpcao4Requerimento: tinyint("doc_opcao4_requerimento").notNull(),
    docOpcao5Requerimento: tinyint("doc_opcao5_requerimento").notNull(),
    docOpcao6Requerimento: tinyint("doc_opcao6_requerimento").notNull(),
    docOpcao7Requerimento: tinyint("doc_opcao7_requerimento").notNull(),
    docOpcao8Requerimento: tinyint("doc_opcao8_requerimento").notNull(),
    idRequerimento: int("id_requerimento").autoincrement().notNull(),
    inversor1Requerimento: int("inversor1_requerimento"),
    inversor2Requerimento: int("inversor2_requerimento"),
    inversor3Requerimento: int("inversor3_requerimento"),
    potenciaModulosRequerimento: int("potencia_modulos_requerimento"),
    qtdInversor1Requerimento: int("qtd_inversor1_requerimento"),
    qtdInversor2Requerimento: int("qtd_inversor2_requerimento"),
    qtdInversor3Requerimento: int("qtd_inversor3_requerimento"),
    qtdModulosRequerimento: int("qtd_modulos_requerimento"),
    statusRequerimento: int("status_requerimento").notNull(),
    tipoConexaoRequerimento: tinyint("tipo_conexao_requerimento").notNull(),
    tipoRamalRequerimento: tinyint("tipo_ramal_requerimento").notNull(),
    usarColigadoRequerimento: tinyint("usar_coligado_requerimento").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idRequerimento],
      name: "requerimentos_acesso_id_requerimento",
    }),
  ]
);

export const requisicaoComplementares = mysqlTable(
  "requisicao_complementares",
  {
    idComplementar: int("id_complementar").autoincrement().notNull(),
    materialComplementar: varchar("material_complementar", {
      length: 200,
    }).notNull(),
    qtdComplementar: int("qtd_complementar").notNull(),
    requisicaoComplementar: int("requisicao_complementar").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idComplementar],
      name: "requisicao_complementares_id_complementar",
    }),
  ]
);

export const requisicaoMateriais = mysqlTable(
  "requisicao_materiais",
  {
    coletaRequisicao: int("coleta_requisicao").notNull(),
    dataRequisicao: date("data_requisicao", { mode: "string" }).notNull(),
    idRequisicao: int("id_requisicao").autoincrement().notNull(),
    revisaoRequisicao: int("revisao_requisicao").notNull(),
    statusRequisicao: int("status_requisicao").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idRequisicao],
      name: "requisicao_materiais_id_requisicao",
    }),
  ]
);

export const rsi = mysqlTable(
  "rsi",
  {
    abatEnergiaTotalNecRsi: decimal("abat_energia_total_nec_rsi", {
      precision: 10,
      scale: 2,
    }).notNull(),
    caminhoRsi: varchar("caminho_rsi", { length: 500 }),
    chaveRsi: varchar("chave_rsi", { length: 100 }).notNull(),
    clienteRsi: int("cliente_rsi").notNull(),
    coletaRsi: int("coleta_rsi").notNull(),
    geracaoPrimeiroAnoRsi: decimal("geracao_primeiro_ano_rsi", {
      precision: 10,
      scale: 2,
    }).notNull(),
    idRsi: int("id_rsi").autoincrement().notNull(),
    investimentoRsi: decimal("investimento_rsi", {
      precision: 10,
      scale: 2,
    }).notNull(),
    mdConsumoFpMesRsi: decimal("md_consumo_fp_mes_rsi", {
      precision: 10,
      scale: 2,
    }).notNull(),
    mdConsumoPMesRsi: decimal("md_consumo_p_mes_rsi", {
      precision: 10,
      scale: 2,
    }).notNull(),
    mdConsumoTotalMesRsi: decimal("md_consumo_total_mes_rsi", {
      precision: 10,
      scale: 2,
    }).notNull(),
    mdGeracaoMensalRsi: decimal("md_geracao_mensal_rsi", {
      precision: 10,
      scale: 2,
    }).notNull(),
    paybackRsi: varchar("payback_rsi", { length: 100 }).notNull(),
    propostaRsi: int("proposta_rsi"),
    revisaoRsi: varchar("revisao_rsi", { length: 3 }).notNull(),
    statusRsi: int("status_rsi").notNull(),
    tipoRsi: varchar("tipo_rsi", { length: 50 }).notNull(),
  },
  (table) => [
    index("coleta_rsi").on(table.coletaRsi),
    primaryKey({ columns: [table.idRsi], name: "rsi_id_rsi" }),
  ]
);

export const rsiGeracoesMeses = mysqlTable(
  "rsi_geracoes_meses",
  {
    idEstimativa: int("id_estimativa").autoincrement().notNull(),
    mesEstimativa: tinyint("mes_estimativa").notNull(),
    rsiEstimativa: int("rsi_estimativa").notNull(),
    valorEstimativa: decimal("valor_estimativa", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    index("rsi_estimativa").on(table.rsiEstimativa),
    primaryKey({
      columns: [table.idEstimativa],
      name: "rsi_geracoes_meses_id_estimativa",
    }),
  ]
);

export const sequenciaSemUcs = mysqlTable(
  "sequencia_sem_ucs",
  {
    coletaSemUc: int("coleta_sem_uc").notNull(),
    idSemUc: bigint("id_sem_uc", { mode: "number" }).autoincrement().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idSemUc],
      name: "sequencia_sem_ucs_id_sem_uc",
    }),
  ]
);

export const sqlmapfile = mysqlTable("sqlmapfile", {
  data: longtext(),
});

export const statusFollowup = mysqlTable(
  "status_followup",
  {
    exigeCampoDataFollowup: int("exigeCampoData_followup").default(0).notNull(),
    idStatusFollowup: int("id_status_followup").autoincrement().notNull(),
    mostrarStatusFollowup: int("mostrar_status_followup").notNull(),
    nomeStatusFollowup: varchar("nome_status_followup", {
      length: 100,
    }).notNull(),
    permiteMudancaFollowup: int("permiteMudanca_followup").default(1).notNull(),
    propostaAtivaFollowup: int("propostaAtiva_followup").default(0).notNull(),
    rsiAtivoFollowup: int("rsiAtivo_followup").default(0).notNull(),
    statusStatusFollowup: int("status_status_followup").notNull(),
    tipoStatusFollowup: int("tipoStatus_followup").default(0).notNull(),
    validadeStatusFollowup: int("validade_status_followup"),
  },
  (table) => [
    primaryKey({
      columns: [table.idStatusFollowup],
      name: "status_followup_id_status_followup",
    }),
  ]
);

export const subestacoes = mysqlTable(
  "subestacoes",
  {
    idSubestacao: int("id_subestacao").autoincrement().notNull(),
    statusSubestacao: int("status_subestacao").notNull(),
    valorSubestacao: int("valor_subestacao").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idSubestacao],
      name: "subestacoes_id_subestacao",
    }),
  ]
);

export const tabelasPreco = mysqlTable(
  "tabelas_preco",
  {
    acaoIndiceTabelaPreco: int("acaoIndice_tabela_preco").default(1).notNull(),
    idTabelaPreco: int("id_tabela_preco").autoincrement().notNull(),
    indiceTabelaPreco: decimal("indice_tabela_preco", {
      precision: 10,
      scale: 4,
    })
      .default("0.0000")
      .notNull(),
    nomeTabelaPreco: varchar("nome_tabela_preco", { length: 50 }),
    numeroTabelaPreco: int("numero_tabela_preco").notNull(),
    statusTabelaPreco: int("status_tabela_preco").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTabelaPreco],
      name: "tabelas_preco_id_tabela_preco",
    }),
  ]
);

export const tarifasBandeiras = mysqlTable(
  "tarifas_bandeiras",
  {
    idBandeira: int("id_bandeira").autoincrement().notNull(),
    nomeBandeira: varchar("nome_bandeira", { length: 100 }).notNull(),
    statusBandeira: int("status_bandeira").notNull(),
    valorBandeira: decimal("valor_bandeira", {
      precision: 10,
      scale: 7,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idBandeira],
      name: "tarifas_bandeiras_id_bandeira",
    }),
  ]
);

export const tarifasEnergia = mysqlTable(
  "tarifas_energia",
  {
    classificacaoTarifa: varchar("classificacao_tarifa", {
      length: 100,
    }).notNull(),
    concessionariaTarifa: varchar("concessionaria_tarifa", {
      length: 100,
    }).notNull(),
    fiobTarifa: decimal("fiob_tarifa", { precision: 10, scale: 7 })
      .default("0.0000000")
      .notNull(),
    grupoTarifa: varchar("grupo_tarifa", { length: 5 }).notNull(),
    idTarifa: int("id_tarifa").autoincrement().notNull(),
    percentFioBTarifa: decimal("percentFioB_tarifa", {
      precision: 10,
      scale: 7,
    })
      .default("0.0000000")
      .notNull(),
    precoDemandaTarifa: decimal("preco_demanda_tarifa", {
      precision: 10,
      scale: 7,
    }),
    precoFixoTarifa: decimal("preco_fixo_tarifa", { precision: 10, scale: 7 }),
    precoForaPontaTarifa: decimal("preco_fora_ponta_tarifa", {
      precision: 10,
      scale: 7,
    }),
    precoPontaTarifa: decimal("preco_ponta_tarifa", {
      precision: 10,
      scale: 7,
    }),
    precoTusdgTarifa: decimal("preco_tusdg_tarifa", { precision: 10, scale: 7 })
      .default("0.0000000")
      .notNull(),
    statusTarifa: int("status_tarifa").notNull(),
    subgrupoTarifa: varchar("subgrupo_tarifa", { length: 5 }).notNull(),
    teTarifa: decimal("te_tarifa", { precision: 10, scale: 7 }).default(
      "0.0000000"
    ),
    tusdeTarifa: decimal("tusde_tarifa", { precision: 10, scale: 7 })
      .default("0.0000000")
      .notNull(),
    ufTarifa: varchar("uf_tarifa", { length: 5 }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTarifa],
      name: "tarifas_energia_id_tarifa",
    }),
  ]
);

export const tiposContrato = mysqlTable(
  "tipos_contrato",
  {
    idTipoContrato: int("id_tipo_contrato").autoincrement().notNull(),
    nomeTipoContrato: varchar("nome_tipo_contrato", { length: 100 }).notNull(),
    statusTipoContrato: int("status_tipo_contrato").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTipoContrato],
      name: "tipos_contrato_id_tipo_contrato",
    }),
  ]
);

export const tiposFatura = mysqlTable(
  "tipos_fatura",
  {
    idTipoFatura: int("id_tipo_fatura").autoincrement().notNull(),
    nomeTipoFatura: varchar("nome_tipo_fatura", { length: 100 }).notNull(),
    statusTipoFatura: int("status_tipo_fatura").notNull(),
    subsidioTipoFatura: decimal("subsidio_tipo_fatura", {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTipoFatura],
      name: "tipos_fatura_id_tipo_fatura",
    }),
  ]
);

export const tiposInstalacao = mysqlTable(
  "tipos_instalacao",
  {
    idTipo: int("id_tipo").autoincrement().notNull(),
    indiceTipo: decimal("indice_tipo", { precision: 10, scale: 2 }).notNull(),
    nomeTipo: varchar("nome_tipo", { length: 250 }).notNull(),
    siglaTipo: varchar("sigla_tipo", { length: 50 }).notNull(),
    statusTipo: int("status_tipo").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.idTipo], name: "tipos_instalacao_id_tipo" }),
  ]
);

export const tiposTelhado = mysqlTable(
  "tipos_telhado",
  {
    categoriaTelhado: int("categoria_telhado").notNull(),
    custoAdicionalTelhado: decimal("custo_adicional_telhado", {
      precision: 10,
      scale: 2,
    })
      .default("0.00")
      .notNull(),
    idTelhado: int("id_telhado").autoincrement().notNull(),
    nomeTelhado: varchar("nome_telhado", { length: 250 }).notNull(),
    statusTelhado: int("status_telhado").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTelhado],
      name: "tipos_telhado_id_telhado",
    }),
  ]
);

export const transferenciasColetas = mysqlTable(
  "transferencias_coletas",
  {
    clienteTransferencia: int("cliente_transferencia").notNull(),
    coletaTransferencia: int("coleta_transferencia").notNull(),
    datetimeTransferencia: datetime("datetime_transferencia", {
      mode: "string",
    }).notNull(),
    idTransferencia: int("id_transferencia").autoincrement().notNull(),
    justificativaTransferencia: varchar("justificativa_transferencia", {
      length: 5000,
    }),
    tipoTransferencia: int("tipo_transferencia").notNull(),
    userTransferencia: int("user_transferencia").notNull(),
    vendedorDestinoTransferencia: int(
      "vendedorDestino_transferencia"
    ).notNull(),
    vendedorOrigemTransferencia: int("vendedorOrigem_transferencia").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idTransferencia],
      name: "transferencias_coletas_id_transferencia",
    }),
  ]
);

export const ucsColeta = mysqlTable(
  "ucs_coleta",
  {
    aumentoConsumoColeta: int("aumentoConsumo_coleta").notNull(),
    codColeta: int("cod_coleta").notNull(),
    cosipColeta: decimal("cosip_coleta", { precision: 10, scale: 2 }).notNull(),
    custoDispColeta: int("custoDisp_coleta").notNull(),
    enderecoColeta: varchar("endereco_coleta", { length: 1000 }),
    enderecoFaturaColeta: varchar("enderecoFatura_coleta", { length: 500 }),
    historicoColeta: int("historico_coleta").notNull(),
    iducsColeta: int("iducs_coleta").autoincrement().notNull(),
    latitudeAux1Coleta: varchar("latitude_aux1_coleta", { length: 50 }),
    latitudeAux2Coleta: varchar("latitude_aux2_coleta", { length: 50 }),
    latitudeColeta: varchar("latitude_coleta", { length: 50 }).notNull(),
    ligacaoColeta: varchar("ligacao_coleta", { length: 50 }).notNull(),
    longitudeAux1Coleta: varchar("longitude_aux1_coleta", { length: 50 }),
    longitudeAux2Coleta: varchar("longitude_aux2_coleta", { length: 50 }),
    longitudeColeta: varchar("longitude_coleta", { length: 50 }).notNull(),
    nroucColeta: varchar("nrouc_coleta", { length: 50 }).notNull(),
    outrosCustosColeta: decimal("outrosCustos_coleta", {
      precision: 10,
      scale: 2,
    }).notNull(),
    ucGeradoraColeta: int("UCGeradora_coleta").notNull(),
    valorAumentoColeta: int("valorAumento_coleta").notNull(),
  },
  (table) => [
    index("cod_coleta").on(table.codColeta),
    primaryKey({
      columns: [table.iducsColeta],
      name: "ucs_coleta_iducs_coleta",
    }),
  ]
);

export const usuarioUltimaRotina = mysqlTable(
  "usuario_ultima_rotina",
  {
    codUsuario: int("cod_usuario").notNull(),
    dataUltimaRotina: timestamp("data_ultima_rotina", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull(),
    idUltimaRotina: int("id_ultima_rotina").autoincrement().notNull(),
    nomeUltimaRotina: varchar("nome_ultima_rotina", { length: 50 }).notNull(),
    reabrirUltimaRotina: int("reabrir_ultima_rotina").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idUltimaRotina],
      name: "usuario_ultima_rotina_id_ultima_rotina",
    }),
  ]
);

export const usuarios = mysqlTable(
  "usuarios",
  {
    ativarComissaoSenhaUsuario: int("ativarComissaoSenha_usuario"),
    bairroUsuario: varchar("bairro_usuario", { length: 100 }).notNull(),
    cepUsuario: varchar("cep_usuario", { length: 10 }).notNull(),
    cidadeUsuario: varchar("cidade_usuario", { length: 100 }).notNull(),
    comissaoUsuario: decimal("comissao_usuario", {
      precision: 10,
      scale: 2,
    }).notNull(),
    compUsuario: varchar("comp_usuario", { length: 100 }).notNull(),
    cpfRepresentanteUsuario: varchar("cpf_representante_usuario", {
      length: 30,
    }),
    cpfcnpjUsuario: varchar("cpfcnpj_usuario", { length: 20 }).notNull(),
    emailRepresentanteUsuario: varchar("email_representante_usuario", {
      length: 300,
    }),
    emailUsuario: varchar("email_usuario", { length: 100 }).notNull(),
    empresaUsuario: int("empresa_usuario").notNull(),
    estadoUsuario: varchar("estado_usuario", { length: 100 }).notNull(),
    idUsuario: int("id_usuario").autoincrement().notNull(),
    loginUsuario: varchar("login_usuario", { length: 100 }).notNull(),
    modulosPermUsuario: int("modulos_perm_usuario").default(100_000).notNull(),
    nascimentoRepresentanteUsuario: date("nascimento_representante_usuario", {
      mode: "string",
    }),
    nascimentoUsuario: date("nascimento_usuario", { mode: "string" }).notNull(),
    nomeRepresentanteUsuario: varchar("nome_representante_usuario", {
      length: 300,
    }),
    nomeUsuario: varchar("nome_usuario", { length: 100 }).notNull(),
    nroUsuario: varchar("nro_usuario", { length: 50 }).notNull(),
    perfilUsuario: int("perfil_usuario").notNull(),
    potInversoresPermUsuario: int("potInversores_perm_usuario"),
    regiaoUsuario: int("regiao_usuario").notNull(),
    ruaUsuario: varchar("rua_usuario", { length: 100 }).notNull(),
    senhaComissaoUsuario: varchar("senhaComissao_usuario", { length: 500 }),
    senhaUsuario: varchar("senha_usuario", { length: 100 }).notNull(),
    statusUsuario: int("status_usuario").notNull(),
    tabelaUsuario: int("tabela_usuario").notNull(),
    tabelasExcecaoUsuario: varchar("tabelas_excecao_usuario", { length: 500 }),
    telefone1Usuario: varchar("telefone1_usuario", { length: 20 }).notNull(),
    telefone2Usuario: varchar("telefone2_usuario", { length: 20 }).notNull(),
    telefoneRepresentanteUsuario: varchar("telefone_representante_usuario", {
      length: 120,
    }),
    terceiroPosvUsuario: int("terceiro_posv_usuario").default(0).notNull(),
    termoAceito: int("termo_aceito").default(0),
  },
  (table) => [
    index("id_usuario").on(table.idUsuario),
    primaryKey({ columns: [table.idUsuario], name: "usuarios_id_usuario" }),
  ]
);

export const validadeEtapas = mysqlTable(
  "validade_etapas",
  {
    etapaContagemValidade: int("etapaContagem_validade").notNull(),
    etapaValidade: int("etapa_validade").notNull(),
    idValidade: int("id_validade").autoincrement().notNull(),
    prazoValidade: int("prazo_validade").notNull(),
    statusValidade: int("status_validade").notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.idValidade],
      name: "validade_etapas_id_validade",
    }),
  ]
);
