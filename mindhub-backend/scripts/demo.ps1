param(
    [string]$BaseUrl = 'http://localhost:3000'
)

$ErrorActionPreference = 'Stop'
$BaseUrl = $BaseUrl.TrimEnd('/')

function Enviar-Json {
    param([string]$Caminho, [hashtable]$Dados)
    $jsonBody = $Dados | ConvertTo-Json -Depth 6
    Invoke-RestMethod -Uri ($BaseUrl + $Caminho) -Method Post `
        -ContentType 'application/json; charset=utf-8' `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($jsonBody))
}

$health = Invoke-RestMethod -Uri ($BaseUrl + '/health')
if ($health.aplicacao -ne 'Mindhub' -or $health.status -ne 'ok') {
    throw 'O servidor não respondeu como a API Mindhub.'
}

$demoSuffix = [guid]::NewGuid().ToString('N').Substring(0, 8)
$cliente = Enviar-Json '/api/usuarios' @{
    nome = 'Cliente de demonstração'
    email = "cliente.$demoSuffix@example.com"
}
$profissional = Enviar-Json '/api/usuarios' @{
    nome = 'Especialista de demonstração'
    email = "mentor.$demoSuffix@example.com"
}
$perfil = Enviar-Json '/api/especialistas' @{
    usuarioId = $profissional.id
    descricao = 'Mentoria para desenvolvimento de APIs'
    especialidades = @('NestJS', 'TypeScript')
}
$servicoDireto = Enviar-Json '/api/servicos' @{
    especialistaId = $perfil.id
    titulo = 'Mentoria inicial de NestJS'
    descricao = 'Orientação para começar um backend'
    tipo = 'MENTORIA'
    modeloContratacao = 'RESERVA_DIRETA'
    condicoesComerciais = @{
        preco = @{ valorCentavos = 15000; moeda = 'BRL' }
        quantidadeSessoes = 1
        duracaoMinutos = 60
    }
}
$servicoProposta = Enviar-Json '/api/servicos' @{
    especialistaId = $perfil.id
    titulo = 'Consultoria de arquitetura'
    descricao = 'Escopo a negociar conforme a necessidade do cliente'
    tipo = 'CONSULTORIA'
    modeloContratacao = 'SOB_PROPOSTA'
}
$solicitacao = Enviar-Json '/api/solicitacoes' @{
    clienteId = $cliente.id
    especialistaId = $perfil.id
    servicoId = $servicoProposta.id
    objetivo = 'Estruturar o backend da plataforma Mindhub'
    escopo = 'Cadastro de usuários e catálogo de mentorias'
}

$catalogo = Invoke-RestMethod -Uri ($BaseUrl + '/api/servicos?especialistaId=' + $perfil.id)
if ($catalogo.Count -ne 2) { throw 'O catálogo não retornou os dois serviços criados.' }
$consulta = Invoke-RestMethod -Uri ($BaseUrl + '/api/solicitacoes/' + $solicitacao.id)
if ($consulta.clienteId -ne $cliente.id) { throw 'A solicitação não preservou o cliente.' }

[pscustomobject]@{
    clienteId = $cliente.id
    especialistaId = $perfil.id
    servicoDiretoId = $servicoDireto.id
    servicoSobPropostaId = $servicoProposta.id
    solicitacaoId = $solicitacao.id
    servicosNoCatalogo = $catalogo.Count
    resultado = 'Fluxo básico concluído com sucesso'
} | ConvertTo-Json
