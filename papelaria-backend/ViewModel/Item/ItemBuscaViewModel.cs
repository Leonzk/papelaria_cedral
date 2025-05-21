namespace papelaria_backend.ViewModel.Item
{
    public class ItemBuscaViewModel
    {
        public int id { get; set; }
        public string nome { get; set; }
        public float valor { get; set; }
        public string? cod_barra { get; set; } // null se não for produto
    }
}