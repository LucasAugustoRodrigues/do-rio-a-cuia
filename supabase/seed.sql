-- Do Rio à Cuia | dados iniciais. Rodar depois do schema.sql, no SQL Editor.
-- Pode rodar de novo sem duplicar (on conflict do nothing).

-- ===================== Checklist do batedor (21 itens) =====================
insert into checklist_itens (etapa, ordem, descricao, motivo, fonte) values
('recebimento',1,'Frutos recebidos em caixas ou rasas limpas.','Embalagem suja contamina o lote desde a chegada.','Visa Manaus'),
('recebimento',2,'Separei frutos verdes, secos ou estragados.','Fruto ruim piora o sabor e a segurança do açaí.','Visa Manaus'),
('recebimento',3,'Conferi de qual ilha ou comunidade veio o lote.','Permite informar a origem no app e rastrear possíveis problemas.','Do Rio à Cuia'),
('recebimento',4,'Mantive os frutos longe do chão e do sol.','Evita sujeira, calor e fermentação.','Visa Manaus'),
('lavagem',1,'Lavei os frutos em água potável.','Retira terra, folhas e insetos.','Visa Manaus'),
('lavagem',2,'Usei recipiente limpo, só para a lavagem.','Evita contaminação cruzada.','Visa Manaus'),
('lavagem',3,'Removi folhas, galhos e outras sujeiras.','Resíduos soltos vão parar no açaí se ficarem.','Visa Manaus'),
('lavagem',4,'Escorri bem os frutos antes da próxima etapa.','Prepara os frutos para o branqueamento.','Visa Manaus'),
('branqueamento',1,'Água a 80 °C, medida com termômetro.','Temperatura indicada para eliminar o parasita da doença de Chagas.','Embrapa Amapá'),
('branqueamento',2,'Frutos mergulhados por cerca de 10 segundos.','Tempo de choque térmico recomendado.','Embrapa Amapá'),
('branqueamento',3,'Resfriei os frutos logo após, em água potável.','Evita que o fruto cozinhe demais.','Embrapa Amapá'),
('branqueamento',4,'Usei tanque ou panela limpa, só para isso.','Evita contaminação cruzada.','Embrapa Amapá'),
('branqueamento',5,'Nunca bati fruto sem branqueamento.','Pode transmitir Chagas pela via oral.','Embrapa Amapá'),
('armazenamento',1,'Guardei o açaí em recipiente limpo e tampado.','Protege de poeira, insetos e contaminação.','Visa Manaus'),
('armazenamento',2,'Mantive o açaí refrigerado ou com gelo.','Calor acelera a fermentação.','Visa Manaus'),
('armazenamento',3,'Identifiquei o lote com data e origem.','Ajuda a vender o mais antigo primeiro e a rastrear.','Do Rio à Cuia'),
('armazenamento',4,'Guardei longe de lixo e produtos de limpeza.','Evita contaminação cruzada.','Visa Manaus'),
('venda',1,'Mãos limpas, unhas curtas e cabelo preso.','A higiene de quem manipula protege o cliente.','Visa Manaus'),
('venda',2,'Batedeira, bacias e utensílios higienizados.','Limpe antes e depois de cada uso.','Visa Manaus'),
('venda',3,'Selo Açaí Bom à vista e dentro da validade.','O cliente confere pelo QR code do Do Rio à Cuia.','Prefeitura de Belém'),
('venda',4,'Informo ao cliente a origem do lote.','Transparência aumenta a confiança no seu ponto.','Do Rio à Cuia')
on conflict (etapa, ordem) do nothing;

-- ===================== Pontos de demonstração (Belém) =====================
-- Nomes e números de selo fictícios, só para a demonstração (R3: a lista oficial não é pública).
-- Datas relativas a hoje em Belém: o válido continua válido e o vencido continua vencido.
-- qr_slug fixo para os testes: /p/demo-valido, /p/demo-vencido, /p/demo-origem.

insert into origens (id, nome, municipio) values
('a0000000-0000-4000-8000-000000000001', 'Ilha do Combu', 'Belém')
on conflict do nothing;

insert into pontos_venda (id, nome, endereco, bairro, municipio, latitude, longitude, qr_slug, ativo) values
('b0000000-0000-4000-8000-000000000001', 'Açaí Batista Campos', 'Tv. Padre Eutíquio, 1200', 'Batista Campos', 'Belém', -1.458500, -48.490500, 'demo-valido', true),
('b0000000-0000-4000-8000-000000000002', 'Açaí do Umarizal', 'Av. Visconde de Souza Franco, 500', 'Umarizal', 'Belém', -1.444000, -48.488000, 'demo-vencido', true),
('b0000000-0000-4000-8000-000000000003', 'Açaí do Combu', 'Rua Dr. Assis, 300', 'Cidade Velha', 'Belém', -1.459000, -48.504500, 'demo-origem', true)
on conflict do nothing;

insert into selos (id, ponto_id, orgao_emissor, programa, numero, data_emissao, data_validade) values
('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Prefeitura de Belém', 'Açaí Bom', 'DEMO-0001', hoje_belem() - 60,  hoje_belem() + 305),
('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', 'Prefeitura de Belém', 'Açaí Bom', 'DEMO-0002', hoje_belem() - 400, hoje_belem() - 35),
('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003', 'Prefeitura de Belém', 'Açaí Bom', 'DEMO-0003', hoje_belem() - 30,  hoje_belem() + 335)
on conflict do nothing;

insert into lotes (id, ponto_id, origem_id, data_recebimento, observacao) values
('d0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', hoje_belem(), 'Lote de demonstração')
on conflict do nothing;

-- Conferência (deve dar 3 linhas: valido, vencido, valido com origem Ilha do Combu)
select nome, qr_slug, situacao, data_validade, origem_lote from v_pontos_status order by qr_slug;
