using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using papelaria_backend.Entities;
using papelaria_backend.ViewModel.ItemVenda;
using papelaria_backend.ViewModel.Venda;

namespace papelaria_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemVendaController : ControllerBase
    {
        private readonly Services.ItemVendaServices _itemvendaServices;
        private readonly Services.VendaServices _vendaServices;
        private readonly Services.ItemServices _itemServices;

        public ItemVendaController(Services.ItemVendaServices itemvendaServices, Services.VendaServices vendaServices, Services.ItemServices itemServices)
        {
            _itemvendaServices = itemvendaServices;
            _vendaServices = vendaServices;
            _itemServices = itemServices;
        }

        [HttpPost]
        public IActionResult RealizarItemVenda([FromBody] ItemVendaCriarViewModel itemvendaVM)
        {
            Entities.ItemVenda itemvenda = new Entities.ItemVenda();
            itemvenda.id_item = itemvendaVM.id_item;
            itemvenda.id_venda = itemvendaVM.id_venda;
            itemvenda.quant = itemvendaVM.quant;
            if (itemvendaVM.quant > 0)
            {
                Entities.Item item = new Entities.Item();
                item = _itemServices.ObterItem(itemvenda.id_item);

                if(item != null)
                {
                    Entities.Venda venda = new Entities.Venda();
                    venda = _vendaServices.ObterVenda(itemvenda.id_venda);

                    if(venda != null)
                    {
                        bool sucesso = false;
                        itemvenda.venda = venda;
                        itemvenda.item = item;
                        sucesso = _itemvendaServices.SalvarItemVenda(itemvenda);
                        if(sucesso)
                        {
                            return Ok(itemvenda);
                        }
                        else
                        {
                            return UnprocessableEntity();
                        }
                    }
                    else
                    {
                        return NotFound("Venda Não Encontrada");
                    }
                }
                else
                {
                    return NotFound("Item Não Encontrado");
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("/item/{id}")]
        public IActionResult ObterPeloItem(int id)
        {

            bool sucesso = false;

            var itemvenda = _itemvendaServices.ObterItemVendaPeloItem(id);

            if (itemvenda != null)
            {
                sucesso = true;

                if (sucesso)
                {
                    return Ok(itemvenda);
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

        [HttpGet("/venda/{id}")]
        public IActionResult ObterPelaVenda(int id)
        {

            bool sucesso = false;

            var itemvenda = _itemvendaServices.ObterItemVendaPelaVenda(id);

            if (itemvenda != null)
            {
                sucesso = true;

                if (sucesso)
                {
                    return Ok(itemvenda);
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
        public IActionResult ObterItemVendas()
        {
            bool sucesso = false;

            var itemvenda = _itemvendaServices.ObterTodosItemVendas();

            if (itemvenda != null)
            {
                sucesso = true;

                if (sucesso)
                {
                    return Ok(itemvenda);
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
    }
}
