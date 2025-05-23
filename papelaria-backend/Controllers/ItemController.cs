using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace papelaria_backend.ViewModel.Item
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly Services.ItemServices _itemServices;
        private readonly Services.EstoqueServices _estoqueServices;


        public ItemController(Services.ItemServices itemServices, Services.EstoqueServices estoqueServices)
        {
            _itemServices = itemServices;
            _estoqueServices = estoqueServices;
        }

        [HttpGet("buscar")]
        public IActionResult BuscarItensPorNome([FromQuery] string nome)
        {
            var itens = _itemServices.BuscarItensPorNome(nome);
            if (itens == null || !itens.Any())
            {
                return NotFound();
            }

            var produtos = _itemServices.ObterTodosProdutos().ToDictionary(p => p.id, p => p.cod_barra);

            var resultado = itens.Select(item => new ItemBuscaViewModel
            {
                id = item.id,
                nome = item.nome,
                valor = item.valor,
                cod_barra = produtos.ContainsKey(item.id) ? produtos[item.id] : null
            });

            return Ok(resultado);
        }
        
        //CONTROLLERS DE PRODUTO

        [HttpPost("produto")]
        public IActionResult CriarProduto([FromBody] ProdutoCriarViewModel produtoVM)
        {
            // Verificar se já existe um produto com o mesmo nome ou código de barras
            var produtoExistente = _itemServices.ObterTodosProdutos()
                .FirstOrDefault(p => p.nome == produtoVM.nome || p.cod_barra == produtoVM.cod_barra);

            if (produtoExistente != null)
            {
                return Conflict();
            }

            // Criar o item
            Entities.Item item = new Entities.Item
            {
                nome = produtoVM.nome,
                valor = produtoVM.valor
            };

            var sucesso1 = _itemServices.SalvarItem(item);

            // Criar o produto
            Entities.Item.Produto produto = new Entities.Item.Produto
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
            if (produto == null)
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

        [HttpGet("produtos/buscar")]
        public IActionResult BuscarProdutosPorNome([FromQuery] string nome)
        {
            var itens = _itemServices.BuscarItensPorNome(nome);
            if (itens == null || !itens.Any())
            {
                return NotFound();
            }

            // Filtra apenas produtos (que existem na tabela Produto)
            var produtos = _itemServices.ObterTodosProdutos().ToDictionary(p => p.id, p => p.cod_barra);

            var resultado = itens
                .Where(item => produtos.ContainsKey(item.id))
                .Select(item => new
                {
                    id = item.id,
                    nome = item.nome,
                    valor = item.valor,
                    cod_barra = produtos[item.id]
                });

            return Ok(resultado);
        }

        [HttpPost("produto/atualizar/{id}")]
        public IActionResult AtualizarProduto([FromBody] ProdutoAtualizarViewModel produtoVM, int id)
        {
            Entities.Item item = new Entities.Item();

            Entities.Item.Produto produto = _itemServices.ObterProduto(id);

            item.id = id;
            if (produtoVM.nome != "") { item.nome = produtoVM.nome; } else { item.nome = produto.nome; }
            if (produtoVM.valor != 0) { item.valor = produtoVM.valor; } else { item.valor = produto.valor; }


            var sucesso1 = _itemServices.AtualizarItem(item);


            Entities.Item.Produto produtoatt = new Entities.Item.Produto()
            {
                id = item.id,
                nome = item.nome,
                valor = item.valor,
            };

            if (produtoVM.cod_barra != "") { produtoatt.cod_barra = produtoVM.cod_barra; }
            else { produtoatt.cod_barra = produto.cod_barra; }

            var sucesso2 = _itemServices.AtualizarProduto(produtoatt);

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

        [HttpPost("produto/deletar/{id}")]
        public IActionResult DeletarProduto(int id)
        {
            bool sucessoEstoque = false;
            bool sucessoProduto = false;

            // Primeiro, deletar o estoque associado ao produto
            sucessoEstoque = _estoqueServices.DeletarEstoque(id);

            if (!sucessoEstoque)
            {
                return UnprocessableEntity(new { mensagem = "Erro ao deletar o estoque do produto." });
            }

            // Depois, deletar o produto
            sucessoProduto = _itemServices.DeletarProduto(id);

            if (sucessoProduto)
            {
                return Ok(new { mensagem = "Produto deletado com sucesso." });
            }
            else
            {
                return UnprocessableEntity(new { mensagem = "Erro ao deletar o produto." });
            }
        }

        //CONTROLLERS DE SERVIÇO

        [HttpPost("servico")]
        public IActionResult CriarServico([FromBody] ServicoCriarViewModel servicoVM)
        {
            Entities.Item item = new Entities.Item();
            item.nome = servicoVM.nome;
            item.valor = servicoVM.valor;

            var sucesso1 = _itemServices.SalvarItem(item);

            Entities.Item.Servico servico = new Entities.Item.Servico()
            {
                id = item.id,
                nome = item.nome,
                valor = item.valor,
                disponivel = (int)servicoVM.disponivel
            };

            var sucesso2 = _itemServices.SalvarServico(servico);

            if (!sucesso1 || !sucesso2)
            {
                return UnprocessableEntity();
            }
            else
            {
                servico = _itemServices.ObterServico(item.id);
                return Ok(servico);
            }
        }

        [HttpGet("servico")]
        public IActionResult ObterServicos()
        {
            var servico = _itemServices.ObterTodosServicos();
            if (servico == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(servico);
            }
        }

        [HttpGet("servico/{id}")]
        public IActionResult ObterServico(int id)
        {
            var servico = _itemServices.ObterServico(id);
            if (servico == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(servico);
            }
        }

        [HttpPost("servico/atualizar/{id}")]
        public IActionResult AtualizarServico([FromBody] ServicoAtualizarViewModel servicoVM, int id)
        {
            Entities.Item item = new Entities.Item();

            Entities.Item.Servico servico = _itemServices.ObterServico(id);

            item.id = id;
            if (servicoVM.nome != "") { item.nome = servicoVM.nome; } else { item.nome = servico.nome; }
            if (servicoVM.valor != 0) { item.valor = servicoVM.valor; } else { item.valor = servico.valor; }


            var sucesso1 = _itemServices.AtualizarItem(item);


            Entities.Item.Servico servicoatt = new Entities.Item.Servico()
            {
                id = item.id,
                nome = item.nome,
                valor = item.valor,
            };

            var sucesso2 = _itemServices.AtualizarServico(servicoatt);

            if (!sucesso1 || !sucesso2)
            {
                return UnprocessableEntity();
            }
            else
            {
                servico = _itemServices.ObterServico(item.id);
                return Ok(servico);
            }
        }

        [HttpPost("servico/deletar/{id}")]
        public IActionResult DeletarServico(int id)
        {
            bool sucesso = false;

            sucesso = _itemServices.DeletarServico(id);

            if (sucesso)
            {
                return Ok();
            }
            else
            {
                return UnprocessableEntity();
            }

        }
    }
}
