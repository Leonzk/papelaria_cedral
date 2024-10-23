namespace papelaria_backend.Entities
{
    public class ItemVenda
    {
        public int id { get; set; }
        public int id_item { get; set; }
        public int id_venda { get; set; }

        public virtual Item item { get; set; }

        public virtual Venda venda { get; set; }
    }
}
