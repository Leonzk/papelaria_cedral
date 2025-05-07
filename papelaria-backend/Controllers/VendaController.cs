using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using papelaria_backend.Entities;
using papelaria_backend.Services;
using papelaria_backend.ViewModel.Estoque;
using papelaria_backend.ViewModel.Venda;

namespace papelaria_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendaController : ControllerBase
    {
        private readonly Services.VendaServices _vendaServices;

        public VendaController(Services.VendaServices vendaServices)
        {
            _vendaServices = vendaServices;
        }

        [HttpPost]
        public IActionResult RealizarVenda([FromBody] VendaCriarViewModel vendaVM)
        {
            Entities.Venda venda = new Entities.Venda();
            venda.valor = vendaVM.valor;
            venda.data = DateTime.Now;
            if (vendaVM.valor > 0)
            {
                bool sucesso = false;
                sucesso = _vendaServices.SalvarVenda(venda);

                if (sucesso)
                {
                    return Ok(venda);
                }
                else
                {
                    return UnprocessableEntity();
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("{id}")]
        public IActionResult ObterVenda(int id)
        {
            Entities.Venda venda = new Entities.Venda();

            bool sucesso = false;

            venda = _vendaServices.ObterVenda(id);

            if (venda != null)
            {
                sucesso = true;

                if (sucesso)
                {
                    return Ok(venda);
                }
                else
                {
                    return UnprocessableEntity();
                }
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet]
        public IActionResult ObterVendas()
        {
            var venda = _vendaServices.ObterTodasVendas();

            bool sucesso = false;

            if (venda != null)
            {
                sucesso = true;

                if (sucesso)
                {
                    return Ok(venda);
                }
                else
                {
                    return UnprocessableEntity();
                }
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("periodo/{dataInicio}/{dataFim}")]
        public IActionResult ObterVendasPeriodo(DateTime dataInicio, DateTime dataFim)
        {
            var venda = _vendaServices.ObterVendasPeriodo(dataInicio, dataFim);

            bool sucesso = false;

            if (venda != null)
            {
                sucesso = true;

                if (sucesso)
                {
                    return Ok(venda);
                }
                else
                {
                    return UnprocessableEntity();
                }
            }
            else
            {
                return NotFound();
            }
        
        }

        [HttpGet("grafico/itens")]
        public IActionResult ObterRelatorioVendas([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            var relatorio = _vendaServices.ObterRelatorioVendas(dataInicio, dataFim);

            if (relatorio != null && relatorio.Any())
            {
                return Ok(relatorio);
            }
            else
            {
                return NotFound("Nenhum dado encontrado para o período especificado.");
            }
        }
    }
}
