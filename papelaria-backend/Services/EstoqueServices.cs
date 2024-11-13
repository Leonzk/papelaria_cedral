using MySql.Data.MySqlClient;
using papelaria_backend.Entities;

namespace papelaria_backend.Services
{
    public class EstoqueServices
    {
        private readonly BD _bd;

        public EstoqueServices(BD bd) { _bd = bd; }

        public bool SalvarEstoque(Entities.Estoque estoque)
        {
            bool sucesso = false;
            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();

            cmd.CommandText = $@"INSERT INTO ESTOQUE (estoque_quant, produtoItem_id)
                                    VALUES(@estoque_quant, @produtoItem_id)";

            cmd.Parameters.AddWithValue("@estoque_quant", estoque.quant);
            cmd.Parameters.AddWithValue("@produtoItem_id", estoque.id_produto);

            try
            {
                if(conexao.State != System.Data.ConnectionState.Open)
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

        public bool AtualizarEstoque(int quant, int id_produto)
        {
            bool sucesso = false;

            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();
            cmd.CommandText = $@"UPDATE ESTOQUE SET estoque_quant = @estoque_quant WHERE produtoItem_id = @produtoItem_id";
            cmd.Parameters.AddWithValue("@estoque_quant", quant);
            cmd.Parameters.AddWithValue("@produtoItem_id", id_produto);

            try
            {
                if (conexao.State != System.Data.ConnectionState.Open)
                {
                    conexao.Open();
                }
                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();

                sucesso = true;
            }
            catch(Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }

            return sucesso;

        }

        public bool DeletarEstoque(int id)
        {
            bool sucesso = false;

            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();

            cmd.CommandText = $@"delete from estoque where item_id = @id;
                                    delete from item where item_id = @id;
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

        public IEnumerable<Entities.Estoque> ObterTodosEstoques()
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT Item.item_id, Item.item_nome, Item.item_valor, Produto.produto_codbarra as item_codbarra, Estoque.estoque_quant as quantidade, Estoque.estoque_id
                                FROM Item
                                INNER JOIN Produto ON Item.item_id = Produto.item_id
                                INNER JOIN Estoque ON Produto.item_id = Estoque.produtoItem_id";

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            List<Estoque> estoques = new List<Estoque>();
            while (dr.Read())
            {

                estoques.Add(new Estoque()
                {
                    id = Convert.ToInt32(dr["estoque_id"]),
                    quant = Convert.ToInt32(dr["quantidade"])
                });
            }
            conn.Close();

            return estoques;
        }

        public Estoque? ObterEstoque(int iditem)
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT Item.item_id, Item.item_nome, Item.item_valor, Produto.produto_codbarra as item_codbarra, Estoque.estoque_quant as quantidade, Estoque.estoque_id
                                FROM Item
                                INNER JOIN Produto ON Item.item_id = Produto.item_id
                                INNER JOIN Estoque ON Produto.item_id = Estoque.produtoItem_id
                                WHERE Item.item_id = @id";

            cmd.Parameters.AddWithValue("@id", iditem);

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            Estoque? estoque = null;
            if (dr.Read())
            {

                estoque = new Estoque()
                {
                    id_produto = Convert.ToInt32(dr["estoque_id"]),
                    quant = Convert.ToInt32(dr["quantidade"])
                };
            }
            conn.Close();

            return estoque;
        }
    }
}
