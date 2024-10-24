using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace papelaria_backend.Controllers
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly Services.ItemServices _itemServices;

        public ItemController(Services.ItemServices itemServices)
        {
            _itemServices = itemServices;
        }

        [HttpPost("produto")]
        public IActionResult CriarProduto([FromBody] ViewModel.ProdutoCriarViewModel produtoVM)
        {
            Entities.Item item = new Entities.Item();
            item.nome = produtoVM.nome;
            item.valor = produtoVM.valor;

            var sucesso1 = _itemServices.SalvarItem(item);

            Entities.Item.Produto produto = new Entities.Item.Produto()
            {
                id = item.id,
                nome = item.nome,
                valor = item.valor,
                cod_barra = produtoVM.cod_barra
            };

            var sucesso2 = _itemServices.SalvarProduto(produto);

            if (!sucesso1 || !sucesso2)
            {
                return UnprocessableEntity();
            }
            else
            {
                produto = _itemServices.ObterProduto(item.id);
                return Ok(produto);
            }
        }

        [HttpGet("produto")]
        public IActionResult ObterProdutos()
        {
            var produto = _itemServices.ObterTodosProdutos();
            if(produto==null)
            {
                return NotFound();
            }
            else
            {
                return Ok(produto);
            }
        }

        [HttpGet("produto/{id}")]
        public IActionResult ObterProduto(int id)
        {
            var produto = _itemServices.ObterProduto(id);
            if (produto == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(produto);
            }
        }
    }
}
