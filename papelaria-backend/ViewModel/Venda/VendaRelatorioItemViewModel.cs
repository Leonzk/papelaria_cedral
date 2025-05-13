namespace papelaria_backend.ViewModel.Venda
{
    public class VendaRelatorioItemViewModel
    {
        public int ItemId { get; set; }
        public string ItemNome { get; set; }
        public int QuantidadeVendida { get; set; }
        public float ValorVendido { get; set; }
    }
}