using Microsoft.AspNetCore.Mvc;
using papelaria_backend.Entities;
using papelaria_backend.Services;
using papelaria_backend.ViewModel.Caixa;
namespace papelaria_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaixaController : ControllerBase
    {
        private readonly CaixaServices _caixaServices;
        private readonly VendaServices _vendaServices;
        private readonly VendaCaixaServices _vendaCaixaServices;

        public CaixaController(CaixaServices caixaServices, VendaServices vendaServices, VendaCaixaServices vendaCaixaServices)
        {
            _caixaServices = caixaServices;
            _vendaServices = vendaServices;
            _vendaCaixaServices = vendaCaixaServices;
        }

        // Fechar o caixa do dia
        [HttpPost("fechar")]
        public IActionResult FecharCaixa([FromBody] FecharCaixaRequest request)
        {
            var data = request.data;
            var vendasDoDia = _vendaServices.ObterVendasPeriodo(data.Date, data.Date.AddDays(1).AddSeconds(-1)).ToList();
            if (vendasDoDia == null || vendasDoDia.Count == 0)
                
                return BadRequest(new { mensagem = "Nenhuma venda encontrada para o dia informado." });

            // Cria o caixa
            var caixa = new Caixa
            {
                data = data.Date,
                status = true // fechado
            };

            var sucesso = _caixaServices.SalvarCaixa(caixa);

            if (!sucesso)
                return StatusCode(500, new { mensagem = "Erro ao criar o caixa." });

            // Recupera o caixa criado (pega o último caixa do dia)
            var caixas = _caixaServices.ObterTodosCaixas().Where(c => c.data.Date == data.Date).OrderByDescending(c => c.id).ToList();
            var caixaCriado = caixas.FirstOrDefault();
            if (caixaCriado == null)
                return StatusCode(500, new { mensagem = "Erro ao recuperar o caixa criado." });

            // Relaciona as vendas ao caixa
            foreach (var venda in vendasDoDia)
            {
                _vendaCaixaServices.SalvarVendaCaixa(new VendaCaixa
                {
                    id_caixa = caixaCriado.id,
                    id_venda = venda.id
                });
            }

            return Ok(new
            {
                mensagem = "Caixa fechado com sucesso.",
                caixa = caixaCriado,
                vendas = vendasDoDia
            });
        }

        // CRUD básico do Caixa

        [HttpGet]
        public IActionResult ObterTodosCaixas()
        {
            var caixas = _caixaServices.ObterTodosCaixas();
            return Ok(caixas);
        }

        [HttpGet("{id}")]
        public IActionResult ObterCaixa(int id)
        {
            var caixa = _caixaServices.ObterCaixa(id);
            if (caixa == null)
                return NotFound();

            // Buscar as vendas relacionadas a este caixa
            var vendaCaixas = _vendaCaixaServices.ObterTodosVendaCaixas()
                .Where(vc => vc.id_caixa == caixa.id)
                .ToList();

            // Buscar os dados das vendas
            var vendas = new List<Venda>();
            foreach (var vc in vendaCaixas)
            {
                var venda = _vendaServices.ObterVenda(vc.id_venda);
                if (venda != null)
                    vendas.Add(venda);
            }

            // Retornar o caixa com as vendas
            return Ok(new
            {
                id = caixa.id,
                data = caixa.data,
                status = caixa.status,
                vendas = vendas
            });
        }

        [HttpPost]
        public IActionResult CriarCaixa([FromBody] Caixa caixa)
        {
            var sucesso = _caixaServices.SalvarCaixa(caixa);
            if (sucesso)
                return Ok();
            return StatusCode(500, new { mensagem = "Erro ao criar o caixa." });
        }

        [HttpPut("{id}")]
        public IActionResult AtualizarCaixa(int id, [FromBody] Caixa caixa)
        {
            caixa.id = id;
            var sucesso = _caixaServices.AtualizarCaixa(caixa);
            if (sucesso)
                return Ok();
            return StatusCode(500, new { mensagem = "Erro ao atualizar o caixa." });
        }

        [HttpDelete("{id}")]
        public IActionResult DeletarCaixa(int id)
        {
            var sucesso = _caixaServices.DeletarCaixa(id);
            if (sucesso)
                return Ok();
            return StatusCode(500, new { mensagem = "Erro ao deletar o caixa." });
        }
    }
}