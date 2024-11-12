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

        //CONTROLLERS DE PRODUTO

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

        [HttpPut("produto/{id}")]
        public IActionResult AtualizarProduto([FromBody] ViewModel.ProdutoAtualizarViewModel produtoVM, int id)
        {
            Entities.Item item = new Entities.Item();

            Entities.Item.Produto produto = _itemServices.ObterProduto(id);

            item.id = id;
            if(produtoVM.nome != "" ){ item.nome = produtoVM.nome; } else { item.nome = produto.nome; }
            if(produtoVM.valor != 0){ item.valor = produtoVM.valor; } else { item.valor = produto.valor; }
            

            var sucesso1 = _itemServices.AtualizarItem(item);


            Entities.Item.Produto produtoatt = new Entities.Item.Produto()
            {
                id = item.id,
                nome = item.nome,
                valor = item.valor,
            };

            if(produtoVM.cod_barra != ""){ produtoatt.cod_barra = produtoVM.cod_barra; }
            else{ produtoatt.cod_barra = produto.cod_barra; }

            var sucesso2 = _itemServices.AtualizarProduto(produtoatt);

            if(!sucesso1 || !sucesso2)
            {
                return UnprocessableEntity();
            }
            else
            {
                produto = _itemServices.ObterProduto(item.id);
                return Ok(produto);
            }
        }

        [HttpDelete("produto/{id}")]
        public IActionResult DeletarProduto(int id)
        {
            bool sucesso=false;

            sucesso = _itemServices.DeletarProduto(id);

            if (sucesso)
            {
                return Ok();
            }
            else
            {
                return UnprocessableEntity();
            }
            
        }

        //CONTROLLERS DE SERVIÇO
    }
}
