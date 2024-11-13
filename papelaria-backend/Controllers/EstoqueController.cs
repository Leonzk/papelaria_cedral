using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using papelaria_backend.Services;
using papelaria_backend.ViewModel.Estoque;
using papelaria_backend.ViewModel.Item;

namespace papelaria_backend.Controllers
{
    [Route("api/estoque")]
    [ApiController]
    public class EstoqueController : ControllerBase
    {
        private readonly Services.EstoqueServices _estoqueServices;

        public EstoqueController(Services.EstoqueServices estoqueServices)
        {
            _estoqueServices = estoqueServices;
        }

        [HttpPost]
        public IActionResult CriarEstoqueProduto([FromBody] EstoqueCriarViewModel estoqueVM)
        {
            Entities.Estoque estoque = new Entities.Estoque();
            estoque.quant = estoqueVM.quant;
            estoque.id_produto = estoqueVM.item_id;

            bool sucesso = _estoqueServices.SalvarEstoque(estoque);


            if (!sucesso)
            {
                return UnprocessableEntity();
            }
            else
            {
               
                return Ok();
            }
        }

        [HttpPost("venda/{id}")]
        public IActionResult VendaEstoqueProduto([FromBody] EstoqueAtualizarViewModel estoqueVM)
        {
            Entities.Estoque estoque = new Entities.Estoque();

            estoque = _estoqueServices.ObterEstoque(estoqueVM.item_id);

            if (estoque != null)
            {
                if (estoque.quant > estoqueVM.quant)
                {
                    int quantAtt = estoque.quant;

                    quantAtt = quantAtt - estoqueVM.quant;

                    bool sucesso = false;

                    sucesso = _estoqueServices.AtualizarEstoque(quantAtt, estoqueVM.item_id);

                    if (sucesso)
                    {
                        return Ok();
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
            else
            {
                return NotFound();
            }
        }
    }
}
