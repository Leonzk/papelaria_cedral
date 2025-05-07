using MySql.Data.MySqlClient;
using papelaria_backend.Entities;
using papelaria_backend.ViewModel.Venda;

namespace papelaria_backend.Services
{
    public class VendaServices
    {
        private readonly BD _bd;

        public VendaServices(BD bd) { _bd = bd; }

        public bool SalvarVenda(Entities.Venda venda)
        {
            bool sucesso = false;
            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();

            cmd.CommandText = $@"INSERT INTO VENDA (venda_Valor, venda_Data)
                                    VALUES(@venda_Valor, @venda_Data)";

            cmd.Parameters.AddWithValue("@venda_Valor", venda.valor);
            cmd.Parameters.AddWithValue("@venda_Data", venda.data);

            try
            {
                if (conexao.State != System.Data.ConnectionState.Open)
                {
                    conexao.Open();
                }
                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();
                cmd.CommandText = $@"SELECT LAST_INSERT_ID()";
                int id = Convert.ToInt32(cmd.ExecuteScalar());
                venda.id = id;
                sucesso = true;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }

            return sucesso;
        }

        public bool AtualizarVenda(int Data, int id_venda)
        {
            bool sucesso = false;

            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();
            cmd.CommandText = $@"UPDATE VENDA SET venda_Data = @venda_Data WHERE venda_id = @venda_id";
            
            cmd.Parameters.AddWithValue("@venda_Data", Data);
            cmd.Parameters.AddWithValue("@venda_id", id_venda);

            try
            {
                if (conexao.State != System.Data.ConnectionState.Open)
                {
                    conexao.Open();
                }
                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();

                sucesso = true;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }

            return sucesso;

        }

        public bool DeletarVenda(int id)
        {
            bool sucesso = false;

            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();

            cmd.CommandText = $@"delete from venda where venda_id = @id;
                                    delete from item where venda_id = @id;
            ";

            cmd.Parameters.AddWithValue("@id", id);
            try
            {

                if (conexao.State != System.Data.ConnectionState.Open)
                    conexao.Open();

                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();



                sucesso = true;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }

            return sucesso;
        }

        public IEnumerable<Entities.Venda> ObterTodasVendas()
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT venda_id, venda_Valor, venda_Data
                                FROM Venda;";

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            List<Venda> vendas = new List<Venda>();
            while (dr.Read())
            {

                vendas.Add(new Venda()
                {
                    id = Convert.ToInt32(dr["venda_id"]),
                    data  = Convert.ToDateTime(dr["venda_Data"]),
                    valor = (float)dr["venda_Valor"]
                });
            }
            conn.Close();

            return vendas;
        }

        public Venda? ObterVenda(int idvenda)
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT venda_id, venda_Valor, venda_Data
                                FROM Venda
                                WHERE venda_id = @id";

            cmd.Parameters.AddWithValue("@id", idvenda);

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            Venda? venda = null;
            if (dr.Read())
            {

                venda = new Venda()
                {
                    id = Convert.ToInt32(dr["venda_id"]),
                    data = Convert.ToDateTime(dr["venda_Data"]),
                    valor = (float)dr["venda_Valor"]
                };
            }
            conn.Close();

            return venda;
        }

        public IEnumerable<Entities.Venda> ObterVendasPeriodo(DateTime dataInicial, DateTime dataFinal)
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT venda_id, venda_Valor, venda_Data
                                FROM Venda
                                WHERE venda_Data BETWEEN @dataInicial AND @dataFinal";

            cmd.Parameters.AddWithValue("@dataInicial", dataInicial);
            cmd.Parameters.AddWithValue("@dataFinal", dataFinal);

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            List<Venda> vendas = new List<Venda>();
            while (dr.Read())
            {
                vendas.Add(new Venda()
                {
                    id = Convert.ToInt32(dr["venda_id"]),
                    data = Convert.ToDateTime(dr["venda_Data"]),
                    valor = (float)dr["venda_Valor"]
                });
            }
            conn.Close();

            return vendas;
        }

        public IEnumerable<VendaRelatorioItemViewModel> ObterRelatorioVendas(DateTime dataInicio, DateTime dataFim)
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"
                SELECT
                    DATE_FORMAT(v.venda_Data, '%Y-%m') AS mes,
                    i.item_nome,
                    SUM(iv.item_venda_quant) AS quantidade_vendida,
                    SUM(iv.item_venda_quant * i.item_valor) AS valor_vendido
                FROM
                    ItemVenda iv
                JOIN
                    Venda v ON iv.venda_id = v.venda_id
                JOIN
                    Item i ON iv.item_id = i.item_id
                WHERE
                    v.venda_Data BETWEEN @dataInicio AND @dataFim
                GROUP BY
                    DATE_FORMAT(v.venda_Data, '%Y-%m'),
                    i.item_id
                ORDER BY
                    mes,
                    i.item_nome";

            cmd.Parameters.AddWithValue("@dataInicio", dataInicio);
            cmd.Parameters.AddWithValue("@dataFim", dataFim);

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            List<VendaRelatorioItemViewModel> relatorio = new List<VendaRelatorioItemViewModel>();

            while (dr.Read())
            {
                relatorio.Add(new VendaRelatorioItemViewModel
                {
                    Mes = dr["mes"].ToString(),
                    ItemNome = dr["item_nome"].ToString(),
                    QuantidadeVendida = Convert.ToInt32(dr["quantidade_vendida"]),
                    ValorVendido = Convert.ToSingle(dr["valor_vendido"])
                });
            }

            conn.Close();
            return relatorio;
        }
    }
}
