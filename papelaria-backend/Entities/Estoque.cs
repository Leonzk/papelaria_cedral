using System.ComponentModel.DataAnnotations;

namespace papelaria_backend.Entities
{
    public class Estoque
    {
        public int id { get; set; }
        [Required]
        public int quant {  get; set; }
        public int id_produto { get; set; }
        public virtual Item.Produto estoque_produto { get; set; }
    }
}
