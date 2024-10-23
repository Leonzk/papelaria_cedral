namespace papelaria_backend.Entities
{
    public class VendaCaixa
    {
        public int id { get; set; }
        public int id_venda { get; set; }
        public int id_caixa { get; set; }

        public virtual Venda venda { get; set; }
        public virtual Caixa caixa { get; set; }

    }
}
