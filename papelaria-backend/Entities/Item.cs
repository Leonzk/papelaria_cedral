namespace papelaria_backend.Entities
{
    public class Item
    {
        public int id { get; set; }
        public string nome { get; set; }
        public float valor { get; set; }

        public class Servico : Item
        {
            public int disponivel { get; set; }
        }

        public class Produto : Item
        {
            public string cod_barra { get; set; }
        }
    }
}
