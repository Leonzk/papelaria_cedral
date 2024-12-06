using MySql.Data.MySqlClient;
using papelaria_backend.Entities;

namespace papelaria_backend.Services
{
    public class ItemVendaServices
    {
        private readonly BD _bd;

        public ItemVendaServices(BD bd) { _bd = bd; }

        public bool SalvarItemVenda(Entities.ItemVenda itemvenda)
        {
            bool sucesso = false;
            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();

            cmd.CommandText = $@"INSERT INTO itemvenda (item_venda_quant, venda_id, item_id) VALUES(@item_venda_quant, @venda_id, @item_id)";

            cmd.Parameters.AddWithValue("@item_venda_quant", itemvenda.quant);
            cmd.Parameters.AddWithValue("@venda_id", itemvenda.id_venda);
            cmd.Parameters.AddWithValue("@item_id", itemvenda.id_item);

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

        public bool AtualizarItemVenda(int quant, int id_venda, int id_item)
        {
            bool sucesso = false;

            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();
            cmd.CommandText = $@"UPDATE ITEMVENDA SET venda_Data = @venda_Data WHERE venda_id = @venda_id";

            cmd.Parameters.AddWithValue("@item_venda_quant", quant);
            cmd.Parameters.AddWithValue("@venda_id", id_venda);
            cmd.Parameters.AddWithValue("@item_id", id_item);

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

        public IEnumerable<Entities.ItemVenda> ObterTodosItemVendas()
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT ItemVenda.item_venda_id as id, ItemVenda.item_venda_quant as quant, ItemVenda.venda_id as venda_id, ItemVenda.item_id as item_id, Venda.venda_Valor as venda_valor, Venda.venda_Data as data, Item.item_nome as nome, Item.item_valor as item_valor
                                FROM ItemVenda
                                INNER JOIN Item ON Item.item_id = ItemVenda.item_id
                                INNER JOIN Venda ON Venda.venda_id = ItemVenda.venda_id";

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            List<ItemVenda> itemvendas = new List<ItemVenda>();
            while (dr.Read())
            {

                itemvendas.Add(new ItemVenda()
                {
                    id = Convert.ToInt32(dr["id"]),
                    id_item = Convert.ToInt32(dr["item_id"]),
                    id_venda = Convert.ToInt32(dr["venda_id"]),
                    quant = Convert.ToInt32(dr["quant"]),
                    item = new Item()
                    {
                        id = Convert.ToInt32(dr["item_id"]),
                        nome = dr["nome"].ToString(),
                        valor = (float)dr["item_valor"]
                    },
                    venda = new Venda()
                    {
                       id = Convert.ToInt32(dr["venda_id"]),
                       data = Convert.ToDateTime(dr["data"]),
                       valor = (float)dr["venda_valor"]
                    }
                });
            }
            conn.Close();

            return itemvendas;
        }

        public IEnumerable<Entities.ItemVenda> ObterItemVendaPelaVenda(int idvenda)
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT ItemVenda.item_venda_id, ItemVenda.item_venda_quant as quant, Item.item_id, Venda.venda_id, Venda.venda_Valor as venda_valor, Venda.venda_Data as data, Item.item_nome as nome, Item.item_valor as item_valor
                                FROM ItemVenda
                                INNER JOIN Item ON Item.item_id = ItemVenda.item_id
                                INNER JOIN Venda ON Venda.venda_id = ItemVenda.venda_id
                                WHERE Venda.venda_id = @id";

            cmd.Parameters.AddWithValue("@id", idvenda);

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            List<ItemVenda> itemvendas = new List<ItemVenda>();
            while (dr.Read())
            {

                itemvendas.Add(new ItemVenda()
                {
                    id = Convert.ToInt32(dr["item_venda_id"]),
                    id_item = Convert.ToInt32(dr["item_id"]),
                    id_venda = Convert.ToInt32(dr["venda_id"]),
                    quant = Convert.ToInt32(dr["quant"]),
                    item = new Item()
                    {
                        id = Convert.ToInt32(dr["item_id"]),
                        nome = dr["nome"].ToString(),
                        valor = (float)dr["item_valor"]
                    },
                    venda = new Venda()
                    {
                        id = Convert.ToInt32(dr["venda_id"]),
                        data = Convert.ToDateTime(dr["data"]),
                        valor = (float)dr["venda_valor"]
                    }
                });
            }
            conn.Close();

            return itemvendas;
        }

        public IEnumerable<Entities.ItemVenda> ObterItemVendaPeloItem(int idvenda)
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT ItemVenda.item_venda_id as id, ItemVenda.item_venda_quant as quant, ItemVenda.venda_id as venda_id, ItemVenda.item_id as item_id, Venda.venda_Valor as venda_valor, Venda.venda_Data as data, Item.item_nome as nome, Item.item_valor as item_valor
                                FROM ItemVenda
                                INNER JOIN Item ON Item.item_id = ItemVenda.item_id
                                INNER JOIN Venda ON Venda.venda_id = ItemVenda.venda_id
                                WHERE item_id = @id";

            cmd.Parameters.AddWithValue("@id", idvenda);

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            List<ItemVenda> itemvendas = new List<ItemVenda>();
            if (dr.Read())
            {

                itemvendas.Add(new ItemVenda()
                {
                    id = Convert.ToInt32(dr["id"]),
                    id_item = Convert.ToInt32(dr["item_id"]),
                    id_venda = Convert.ToInt32(dr["venda_id"]),
                    quant = Convert.ToInt32(dr["quant"]),
                    item = new Item()
                    {
                        id = Convert.ToInt32(dr["item_id"]),
                        nome = dr["nome"].ToString(),
                        valor = (float)dr["item_valor"]
                    },
                    venda = new Venda()
                    {
                        id = Convert.ToInt32(dr["venda_id"]),
                        data = Convert.ToDateTime(dr["data"]),
                        valor = (float)dr["venda_valor"]
                    }
                });
            }
            conn.Close();

            return itemvendas;
        }
    }
}
